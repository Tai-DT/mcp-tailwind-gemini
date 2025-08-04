# 🐳 Docker Deployment & Security Guide

## 🚀 Quick Docker Deployment

### Prerequisites
- Docker installed on your system
- Git repository cloned locally
- Gemini API key ready

### 1. Build Docker Image

```bash
# Navigate to project directory
cd mcp-tailwind-gemini

# Build production image
docker build -f Dockerfile.runtime -t mcp-tailwind-runtime:latest .
```

### 2. Create Environment File

Create `.env` file in project root:

```bash
# Create environment file
cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
EOF
```

### 3. Run Container

```bash
# Run with environment file
docker run -d \
  --name mcp-tailwind-server \
  --env-file .env \
  --restart unless-stopped \
  mcp-tailwind-runtime:latest
```

### 4. Verify Deployment

```bash
# Check container status
docker ps | grep mcp-tailwind-server

# View logs
docker logs -f mcp-tailwind-server

# Test MCP connection
docker exec mcp-tailwind-server node -e "console.log('MCP Server running')"
```

---

## 🔒 Security Best Practices

### 1. Environment Variables Management

**❌ Never commit API keys to Git:**
```bash
# BAD - Don't do this
echo "GEMINI_API_KEY=your_key" >> .gitignore
```

**✅ Use environment files:**
```bash
# GOOD - Use .env file (already in .gitignore)
GEMINI_API_KEY=your_actual_key_here
NODE_ENV=production
```

### 2. Docker Security Configuration

**Use non-root user:**
```dockerfile
# Dockerfile.runtime already configured
USER mcp
```

**Limit container resources:**
```bash
docker run -d \
  --name mcp-tailwind-server \
  --env-file .env \
  --memory=512m \
  --cpus=1.0 \
  --restart unless-stopped \
  mcp-tailwind-runtime:latest
```

### 3. Network Security

**Use custom network:**
```bash
# Create isolated network
docker network create mcp-network

# Run with custom network
docker run -d \
  --name mcp-tailwind-server \
  --network mcp-network \
  --env-file .env \
  --restart unless-stopped \
  mcp-tailwind-runtime:latest
```

---

## 🛠️ Production Deployment

### Docker Compose Setup

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mcp-tailwind:
    build:
      context: .
      dockerfile: Dockerfile.runtime
    container_name: mcp-tailwind-server
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - mcp-network
    volumes:
      - ./logs:/app/logs
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'

networks:
  mcp-network:
    driver: bridge
```

### Deployment Commands

```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update and restart
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Development Setup

### Local Development Container

```bash
# Build development image
docker build -f Dockerfile -t mcp-tailwind-dev:latest .

# Run with volume mounting
docker run -it --rm \
  --name mcp-tailwind-dev \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/tests:/app/tests \
  --env-file .env \
  mcp-tailwind-dev:latest
```

### Hot Reload Development

```bash
# Run with nodemon for development
docker run -it --rm \
  --name mcp-tailwind-dev \
  -v $(pwd):/app \
  --env-file .env \
  -p 3000:3000 \
  mcp-tailwind-dev:latest npm run dev
```

---

## 🚨 Security Checklist

### ✅ Pre-Deployment
- [ ] API keys in `.env` file (not in code)
- [ ] `.env` file in `.gitignore`
- [ ] Docker image built with security patches
- [ ] Non-root user configured
- [ ] Resource limits set

### ✅ Runtime Security
- [ ] Container running with minimal privileges
- [ ] Network isolation configured
- [ ] Logs monitored for security events
- [ ] Regular security updates applied

### ✅ Monitoring
- [ ] Container health checks enabled
- [ ] Log aggregation configured
- [ ] Resource usage monitored
- [ ] Security alerts set up

---

## 🔍 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker logs mcp-tailwind-server

# Check environment
docker exec mcp-tailwind-server env | grep GEMINI
```

**API key issues:**
```bash
# Verify environment file
cat .env

# Test API connection
docker exec mcp-tailwind-server node -e "
const { GeminiAPI } = require('./src/utils/gemini');
console.log('API Key configured:', !!process.env.GEMINI_API_KEY);
"
```

**Permission issues:**
```bash
# Fix file permissions
chmod 600 .env
chown $USER:$USER .env
```

---

## 📚 Additional Resources

### Useful Commands

```bash
# Container management
docker ps -a | grep mcp-tailwind
docker stats mcp-tailwind-server
docker exec -it mcp-tailwind-server /bin/sh

# Log management
docker logs --tail=100 mcp-tailwind-server
docker logs -f mcp-tailwind-server | grep ERROR

# Backup and restore
docker commit mcp-tailwind-server mcp-tailwind-backup
docker save mcp-tailwind-runtime:latest > mcp-tailwind-backup.tar
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ | - | Your Gemini API key |
| `NODE_ENV` | ❌ | development | Environment mode |
| `LOG_LEVEL` | ❌ | info | Logging level |
| `PORT` | ❌ | 3000 | Server port |

---

## 🎯 Next Steps

1. **Deploy to Production:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Configure Monitoring:**
   - Set up log aggregation
   - Configure health checks
   - Enable security scanning

3. **Scale Deployment:**
   - Use Docker Swarm for orchestration
   - Configure load balancing
   - Set up auto-scaling

4. **Security Hardening:**
   - Regular security audits
   - Update dependencies
   - Monitor for vulnerabilities

---

**⚠️ Important Security Notes:**

- Never commit API keys or sensitive data to Git
- Always use environment files for configuration
- Regularly update Docker images and dependencies
- Monitor container logs for security events
- Use resource limits to prevent abuse
- Implement proper backup strategies 