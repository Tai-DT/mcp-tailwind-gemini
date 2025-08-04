#!/bin/bash

# 🐳 Docker Development Environment for MCP Tailwind Gemini
# Quick setup for development with hot reload and debugging

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[DEV]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Development Docker Compose
create_dev_compose() {
    log "Creating development docker-compose..."
    
    cat > docker-compose.dev.yml << EOF
version: '3.8'

services:
  mcp-tailwind-gemini-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: mcp-tailwind-gemini-dev
    
    environment:
      - NODE_ENV=development
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - CHOKIDAR_USEPOLLING=true
    
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port
    
    volumes:
      - ./src:/app/src:ro
      - ./package.json:/app/package.json:ro
      - ./tsconfig.json:/app/tsconfig.json:ro
      - ./mcp.json:/app/mcp.json:ro
      - node_modules:/app/node_modules
    
    command: npm run dev
    
    restart: unless-stopped
    
    networks:
      - mcp-dev-network

networks:
  mcp-dev-network:
    driver: bridge

volumes:
  node_modules:
EOF
    
    success "Development docker-compose.yml created"
}

# Development Dockerfile
create_dev_dockerfile() {
    log "Creating development Dockerfile..."
    
    cat > Dockerfile.dev << EOF
# Development Dockerfile for MCP Tailwind Gemini
FROM node:20-alpine

# Install development tools
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY src/ ./src/
COPY mcp.json ./

# Expose ports
EXPOSE 3000 9229

# Development command with hot reload
CMD ["npm", "run", "dev"]
EOF
    
    success "Development Dockerfile created"
}

# Add development scripts to package.json
add_dev_scripts() {
    log "Adding development scripts..."
    
    # Check if dev script exists
    if ! grep -q '"dev"' package.json; then
        # Add dev script using Node.js
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.dev = 'ts-node-esm --inspect=0.0.0.0:9229 src/index.ts';
        pkg.scripts['dev:watch'] = 'nodemon --exec ts-node-esm --inspect=0.0.0.0:9229 src/index.ts';
        pkg.scripts['docker:dev'] = 'docker-compose -f docker-compose.dev.yml up --build';
        pkg.scripts['docker:dev:down'] = 'docker-compose -f docker-compose.dev.yml down';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
        
        success "Development scripts added to package.json"
    else
        warning "Development scripts already exist"
    fi
}

# Install development dependencies
install_dev_deps() {
    log "Installing development dependencies..."
    
    if command -v npm &> /dev/null; then
        npm install --save-dev \
            ts-node \
            nodemon \
            @types/node
        
        success "Development dependencies installed"
    else
        warning "npm not found, skipping dependency installation"
    fi
}

# Setup development environment
setup_dev_env() {
    log "Setting up development environment..."
    
    # Create .env for development if it doesn't exist
    if [ ! -f ".env" ]; then
        cp .env.example .env
        warning "Created .env from .env.example - please configure your API keys"
    fi
    
    # Set development mode
    sed -i.bak 's/NODE_ENV=production/NODE_ENV=development/' .env 2>/dev/null || true
    
    success "Development environment configured"
}

# Start development environment
start_dev() {
    log "Starting development environment..."
    
    # Build and start development containers
    docker-compose -f docker-compose.dev.yml up --build -d
    
    # Show logs
    log "Development environment started. Logs:"
    docker-compose -f docker-compose.dev.yml logs -f &
    
    # Save the background process PID
    LOGS_PID=$!
    
    success "Development environment is running!"
    echo ""
    echo "🔗 Available endpoints:"
    echo "   • MCP Server: http://localhost:3000"
    echo "   • Debug Port: localhost:9229"
    echo ""
    echo "📝 Development commands:"
    echo "   • View logs: docker-compose -f docker-compose.dev.yml logs -f"
    echo "   • Restart: docker-compose -f docker-compose.dev.yml restart"
    echo "   • Stop: docker-compose -f docker-compose.dev.yml down"
    echo ""
    echo "Press Ctrl+C to stop watching logs (containers will keep running)"
    
    # Wait for Ctrl+C
    trap "kill $LOGS_PID 2>/dev/null; exit 0" INT
    wait $LOGS_PID
}

# Stop development environment
stop_dev() {
    log "Stopping development environment..."
    
    docker-compose -f docker-compose.dev.yml down
    
    success "Development environment stopped"
}

# Show development status
show_dev_status() {
    log "Development environment status:"
    
    if [ -f "docker-compose.dev.yml" ]; then
        docker-compose -f docker-compose.dev.yml ps
        
        # Show resource usage
        container_id=$(docker ps -q -f name="mcp-tailwind-gemini-dev")
        if [ -n "$container_id" ]; then
            echo ""
            log "Resource usage:"
            docker stats "$container_id" --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
        fi
    else
        warning "Development environment not set up. Run with --setup first."
    fi
}

# Clean development environment
clean_dev() {
    log "Cleaning development environment..."
    
    # Stop and remove containers
    docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
    
    # Remove development images
    docker image rm mcp-tailwind-gemini-dev_mcp-tailwind-gemini-dev 2>/dev/null || true
    
    # Remove development files
    rm -f docker-compose.dev.yml Dockerfile.dev
    
    success "Development environment cleaned"
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup      Set up development environment"
    echo "  start      Start development environment"
    echo "  stop       Stop development environment"
    echo "  restart    Restart development environment"
    echo "  status     Show development environment status"
    echo "  logs       Show logs"
    echo "  clean      Clean up development environment"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup     # Set up development environment"
    echo "  $0 start     # Start development with hot reload"
    echo "  $0 logs      # View real-time logs"
}

# Main execution
main() {
    case "${1:-}" in
        setup)
            create_dev_compose
            create_dev_dockerfile
            add_dev_scripts
            install_dev_deps
            setup_dev_env
            success "🚀 Development environment setup complete!"
            echo "Run '$0 start' to start development environment"
            ;;
        start)
            if [ ! -f "docker-compose.dev.yml" ]; then
                warning "Development environment not set up. Setting up now..."
                create_dev_compose
                create_dev_dockerfile
                setup_dev_env
            fi
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            stop_dev
            sleep 2
            start_dev
            ;;
        status)
            show_dev_status
            ;;
        logs)
            if [ -f "docker-compose.dev.yml" ]; then
                docker-compose -f docker-compose.dev.yml logs -f
            else
                warning "Development environment not set up"
            fi
            ;;
        clean)
            clean_dev
            ;;
        help|-h|--help)
            show_usage
            ;;
        "")
            show_usage
            ;;
        *)
            echo "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
