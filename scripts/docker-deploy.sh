#!/bin/bash

# 🐳 Docker Build and Deploy Script for MCP Tailwind Gemini
# Automated deployment script with error handling and logging

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="mcp-tailwind-gemini"
IMAGE_TAG="latest"
CONTAINER_NAME="mcp-tailwind-gemini"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    success "All dependencies are available"
}

# Environment setup
setup_environment() {
    log "Setting up environment..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            warning ".env file not found. Copying from .env.example"
            cp .env.example .env
            warning "Please edit .env file with your actual API keys before proceeding"
            echo "Edit .env file now? (y/n)"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                ${EDITOR:-nano} .env
            fi
        else
            error ".env.example file not found. Cannot set up environment."
            exit 1
        fi
    fi
    
    success "Environment setup complete"
}

# Pre-build validation
validate_project() {
    log "Validating project structure..."
    
    # Check required files
    required_files=("package.json" "tsconfig.json" "Dockerfile" "src/index.ts")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "Required file not found: $file"
            exit 1
        fi
    done
    
    # Run TypeScript compilation check
    log "Checking TypeScript compilation..."
    if command -v npm &> /dev/null; then
        npm run build
        success "TypeScript compilation successful"
    else
        warning "npm not found, skipping TypeScript check"
    fi
    
    success "Project validation complete"
}

# Build Docker image
build_image() {
    log "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
    
    # Build with BuildKit for better performance
    DOCKER_BUILDKIT=1 docker build \
        --target production \
        --tag "$IMAGE_NAME:$IMAGE_TAG" \
        --label "build.date=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --label "build.version=$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
        . || {
        error "Docker image build failed"
        exit 1
    }
    
    success "Docker image built successfully"
}

# Deploy with Docker Compose
deploy_compose() {
    log "Deploying with Docker Compose..."
    
    # Stop existing containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down --remove-orphans
    
    # Start services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 10
    
    # Check container health
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        success "Services deployed successfully"
        
        # Show container status
        log "Container status:"
        docker-compose -f "$DOCKER_COMPOSE_FILE" ps
        
        # Show logs
        log "Recent logs:"
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=20
        
    else
        error "Service deployment failed"
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs
        exit 1
    fi
}

# Test deployment
test_deployment() {
    log "Testing deployment..."
    
    # Health check
    container_id=$(docker ps -q -f name="$CONTAINER_NAME")
    
    if [ -n "$container_id" ]; then
        # Test if container is responding
        if docker exec "$container_id" node -e "console.log('Container is responsive')" &>/dev/null; then
            success "Container health check passed"
        else
            warning "Container health check failed"
        fi
        
        # Show resource usage
        log "Resource usage:"
        docker stats "$container_id" --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
        
    else
        error "Container not found or not running"
        exit 1
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with this in production)
    # docker volume prune -f
    
    success "Cleanup complete"
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --build-only     Build Docker image only"
    echo "  --deploy-only    Deploy without building"
    echo "  --test-only      Test existing deployment"
    echo "  --cleanup        Cleanup unused Docker resources"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full build and deploy"
    echo "  $0 --build-only       # Build image only"
    echo "  $0 --deploy-only      # Deploy existing image"
    echo "  $0 --test-only        # Test deployment"
}

# Main execution
main() {
    log "🐳 Starting MCP Tailwind Gemini Docker Deployment"
    
    case "${1:-}" in
        --build-only)
            check_dependencies
            validate_project
            build_image
            ;;
        --deploy-only)
            check_dependencies
            setup_environment
            deploy_compose
            test_deployment
            ;;
        --test-only)
            check_dependencies
            test_deployment
            ;;
        --cleanup)
            cleanup
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        "")
            # Full deployment
            check_dependencies
            setup_environment
            validate_project
            build_image
            deploy_compose
            test_deployment
            success "🎉 MCP Tailwind Gemini deployed successfully!"
            ;;
        *)
            error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Trap for cleanup on exit
trap 'echo -e "\n${YELLOW}Deployment interrupted${NC}"' INT TERM

# Run main function
main "$@"
