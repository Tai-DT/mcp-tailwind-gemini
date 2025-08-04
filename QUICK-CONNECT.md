# 🔌 MCP Tailwind Gemini - Quick Connection

## ⚡ Fast Setup (2 minutes)

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd mcp-tailwind-gemini
npm install
npm run build
```

### 2. Configure API
```bash
cp .env.example .env
# Edit .env: GEMINI_API_KEY=your_actual_key
```

### 3. Connect to MCP Client

#### VS Code (MCP Extension)
Add to MCP settings:
```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_api_key"
      }
    }
  }
}
```

#### Claude Desktop
Add to Claude config:
```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node", 
      "args": ["/full/path/to/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_api_key"
      }
    }
  }
}
```

### 4. Docker (Alternative)
```bash
docker run -d \
  -e GEMINI_API_KEY=your_key \
  --name mcp-tailwind \
  mcp-tailwind-runtime:latest
```

## 🛠 Available Tools
- `generate_tailwind_css` - AI CSS generation
- `optimize_css` - CSS optimization
- `create_component` - Component creation
- `analyze_design` - Design analysis

## 📚 Full Documentation
- [Connection Guide](./MCP-CONNECTION-GUIDE.md)
- [Docker Guide](./DOCKER-DEPLOYMENT-REPORT.md)
- [API Documentation](./README.md)

---
**Ready in 2 minutes!** 🚀
