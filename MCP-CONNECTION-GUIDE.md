# 🔌 MCP Connection Guide - Tailwind Gemini

## 📋 Quick Setup

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=production
```

### 2. MCP Server Connection

#### For VS Code with MCP Extension
```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### For Claude Desktop
```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node",
      "args": ["/path/to/mcp-tailwind-gemini/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### 3. Docker Deployment
```bash
# Build and run container
docker run -d \
  --name mcp-tailwind-server \
  -e GEMINI_API_KEY=your_api_key_here \
  mcp-tailwind-runtime:latest
```

## 🛠 Development Setup

### Local Development
```bash
# Install dependencies
npm install

# Build project
npm run build

# Start MCP server
npm start
```

### Testing MCP Connection
```bash
# Test server functionality
npm test

# Run functionality tests
node scripts/test-functionality-features.mjs

# Validate Docker deployment
node scripts/validate-docker.mjs
```

## 🔧 Configuration Options

### MCP Server Settings
- **Protocol:** stdio (standard for MCP)
- **Port:** Not applicable (stdio-based)
- **Format:** JSON-RPC 2.0
- **Transport:** Standard input/output

### Available Tools
- `generate_tailwind_css` - AI-powered CSS generation
- `optimize_css` - CSS optimization and minification
- `create_component` - React/Vue/Svelte component creation
- `analyze_design` - Design analysis and suggestions
- `build_integration` - Build tool integration helpers

## 📱 Client Integration

### For MCP Clients
1. **Server Path:** Point to `dist/index.js`
2. **Environment:** Set `GEMINI_API_KEY`
3. **Transport:** stdio
4. **Protocol:** MCP v1.0

### Example Client Configuration
```typescript
const mcpClient = new MCPClient({
  serverPath: 'node',
  serverArgs: ['dist/index.js'],
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  }
});
```

## 🚀 Production Deployment

### Option 1: Direct Node.js
```bash
# Set environment
export GEMINI_API_KEY=your_key
export NODE_ENV=production

# Start server
node dist/index.js
```

### Option 2: Docker Container
```bash
docker run -d \
  --name mcp-tailwind \
  -e GEMINI_API_KEY=your_key \
  --restart unless-stopped \
  mcp-tailwind-runtime:latest
```

### Option 3: Docker Compose
```yaml
version: '3.8'
services:
  mcp-tailwind:
    image: mcp-tailwind-runtime:latest
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔍 Troubleshooting

### Common Issues
1. **API Key Missing:** Ensure GEMINI_API_KEY is set
2. **Build Errors:** Run `npm run build` before starting
3. **Port Conflicts:** MCP uses stdio, no port needed
4. **Permission Issues:** Check file permissions on dist/

### Debug Commands
```bash
# Check server logs
docker logs mcp-tailwind

# Test API connectivity
node -e "console.log(process.env.GEMINI_API_KEY ? 'API Key Set' : 'API Key Missing')"

# Validate MCP protocol
echo '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' | node dist/index.js
```

## 📚 Documentation Links

- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Gemini AI API Documentation](https://ai.google.dev/docs)
- [Project GitHub Repository](https://github.com/your-username/mcp-tailwind-gemini)

---

**Ready to connect!** 🎉 Your MCP Tailwind Gemini server is configured and ready for integration.
