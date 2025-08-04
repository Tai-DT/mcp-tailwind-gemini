# 🐳 Docker Deployment Guide for MCP Tailwind Gemini

This guide covers Docker deployment options for the MCP Tailwind Gemini cross-platform integration system.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Development Environment](#development-environment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## 🚀 Quick Start

### Prerequisites

- Docker 20.0+ and Docker Compose 2.0+
- At least 512MB RAM available
- Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1-Minute Deployment

```bash
# Clone or navigate to project directory
cd mcp-tailwind-gemini

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Deploy with one command
./scripts/docker-deploy.sh
```

Your MCP server will be running at `http://localhost:3000`

## 🏭 Production Deployment

### Manual Build and Deploy

```bash
# Build production image
docker build -t mcp-tailwind-gemini:latest .

# Run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Automated Deployment Script

```bash
# Full deployment with validation
./scripts/docker-deploy.sh

# Build only
./scripts/docker-deploy.sh --build-only

# Deploy existing image
./scripts/docker-deploy.sh --deploy-only

# Test deployment
./scripts/docker-deploy.sh --test-only
```

### Production Environment Variables

Required variables in `.env`:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional but recommended
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
FIGMA_ACCESS_TOKEN=your_figma_token

# Application settings
NODE_ENV=production
MCP_PORT=3000
LOG_LEVEL=info
```

## 🛠️ Development Environment

### Quick Development Setup

```bash
# Set up development environment
./scripts/docker-dev.sh setup

# Start development with hot reload
./scripts/docker-dev.sh start

# View logs
./scripts/docker-dev.sh logs

# Stop development environment
./scripts/docker-dev.sh stop
```

### Development Features

- **Hot Reload**: Automatic restart on file changes
- **Debug Support**: Debug port exposed on 9229
- **Volume Mounts**: Real-time code synchronization
- **Development Dependencies**: Full TypeScript toolchain

### Development Commands

```bash
# Development environment management
./scripts/docker-dev.sh setup     # Initial setup
./scripts/docker-dev.sh start     # Start with hot reload
./scripts/docker-dev.sh stop      # Stop services
./scripts/docker-dev.sh restart   # Restart services
./scripts/docker-dev.sh status    # Show status
./scripts/docker-dev.sh logs      # View real-time logs
./scripts/docker-dev.sh clean     # Clean up environment
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Google Gemini AI API key |
| `OPENAI_API_KEY` | No | - | OpenAI API key for additional features |
| `CLAUDE_API_KEY` | No | - | Anthropic Claude API key |
| `FIGMA_ACCESS_TOKEN` | No | - | Figma API token for design integration |
| `NODE_ENV` | No | production | Environment mode |
| `MCP_PORT` | No | 3000 | Server port |
| `LOG_LEVEL` | No | info | Logging level |
| `MAX_CONCURRENT_REQUESTS` | No | 10 | Rate limiting |
| `REQUEST_TIMEOUT` | No | 30000 | Request timeout (ms) |

### Docker Compose Configuration

#### Production (docker-compose.yml)
- Optimized for performance and security
- Resource limits and health checks
- Automatic restarts
- Production logging

#### Development (docker-compose.dev.yml)
- Volume mounts for hot reload
- Debug port exposure
- Development dependencies
- Verbose logging

### Multi-Stage Docker Build

The Dockerfile uses multi-stage builds for optimization:

1. **Builder Stage**: Installs dependencies and builds TypeScript
2. **Production Stage**: Minimal runtime with only production dependencies

### Security Features

- Non-root user execution
- Minimal Alpine Linux base image
- No unnecessary packages
- Environment variable validation
- Resource limits

## 🔧 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check container logs
docker-compose logs mcp-tailwind-gemini

# Check container status
docker ps -a

# Restart services
docker-compose restart
```

#### Port Already in Use

```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port

# Or stop conflicting services
sudo lsof -i :3000
```

#### API Key Issues

```bash
# Verify environment variables
docker-compose exec mcp-tailwind-gemini env | grep API

# Test API connectivity
docker-compose exec mcp-tailwind-gemini node -e "
  console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Missing');
"
```

#### Memory Issues

```bash
# Check resource usage
docker stats

# Increase memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G  # Increase from 512M
```

### Debug Mode

```bash
# Run in debug mode
docker-compose -f docker-compose.dev.yml up

# Attach debugger to port 9229
# VS Code: Add launch configuration for Node.js attach
```

### Log Analysis

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f mcp-tailwind-gemini

# View last 100 lines
docker-compose logs --tail=100

# Export logs to file
docker-compose logs > mcp-logs.txt
```

## 🚀 Advanced Usage

### Custom Build Arguments

```bash
# Build with custom arguments
docker build \
  --build-arg NODE_VERSION=20 \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  -t mcp-tailwind-gemini:custom .
```

### Health Checks

```bash
# Manual health check
docker exec mcp-tailwind-gemini node -e "console.log('Health: OK')"

# Custom health check endpoint
curl http://localhost:3000/health
```

### Scaling and Load Balancing

```bash
# Scale service replicas
docker-compose up --scale mcp-tailwind-gemini=3 -d

# Use with reverse proxy (nginx, traefik)
# Add labels for automatic discovery
```

### Monitoring and Observability

```bash
# Resource monitoring
docker stats mcp-tailwind-gemini

# Container inspection
docker inspect mcp-tailwind-gemini

# Process monitoring inside container
docker exec mcp-tailwind-gemini ps aux
```

### Backup and Persistence

```bash
# Backup logs
docker cp mcp-tailwind-gemini:/app/logs ./backup/

# Backup configuration
docker cp mcp-tailwind-gemini:/app/mcp.json ./backup/

# Volume backup
docker run --rm -v mcp_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/mcp-data-backup.tar.gz -C /data .
```

### Integration with CI/CD

```bash
# GitHub Actions example
- name: Build and Deploy
  run: |
    ./scripts/docker-deploy.sh --build-only
    docker tag mcp-tailwind-gemini:latest registry.com/mcp-tailwind-gemini:${{ github.sha }}
    docker push registry.com/mcp-tailwind-gemini:${{ github.sha }}
```

## 📊 Performance Tuning

### Memory Optimization

```yaml
# Optimize Node.js memory usage
environment:
  - NODE_OPTIONS="--max-old-space-size=256"
  - UV_THREADPOOL_SIZE=4
```

### CPU Optimization

```yaml
# CPU limits for better resource sharing
deploy:
  resources:
    limits:
      cpus: '0.5'
    reservations:
      cpus: '0.25'
```

### Network Optimization

```yaml
# Custom network configuration
networks:
  mcp-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **User Permissions**: Run as non-root user (implemented)
3. **Network Security**: Use custom networks and firewall rules
4. **Image Scanning**: Regularly scan images for vulnerabilities
5. **Updates**: Keep base images and dependencies updated

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [MCP Tailwind Gemini Main Documentation](../README.md)
- [Cross-Platform Integration Guide](./CROSS_PLATFORM_GUIDE.md)

---

**Need Help?** Check the [troubleshooting section](#troubleshooting) or open an issue on GitHub.
