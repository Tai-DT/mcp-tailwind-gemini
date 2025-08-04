# MCP Tailwind Gemini Server

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/Tai-DT/mcp-tailwind-gemini)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Advanced Model Context Protocol (MCP) server for Tailwind CSS with Gemini AI integration and **cross-platform support** for intelligent design assistance across all major development environments.

## 🌟 Features

### 🤖 AI-Powered Design
- **Intelligent Component Generation**: Create sophisticated Tailwind components using Gemini AI
- **Smart Optimization**: AI-driven class optimization and conflict resolution
- **Design Analysis**: Comprehensive design quality assessment with improvement suggestions
- **Theme Creation**: Generate cohesive design systems with AI assistance

### 🎨 Tailwind CSS Tools
- **Component Generator**: Create buttons, cards, forms, navigation, modals, and custom components
- **Class Optimizer**: Clean up redundant classes and resolve conflicts
- **CSS Converter**: Transform existing CSS/SCSS to Tailwind classes
- **Layout Generator**: Build responsive layouts for dashboards, landing pages, blogs, and more
- **Theme Creator**: Generate custom color palettes, typography, and design tokens
- **Preview Generator**: Visual component previews with screenshot capability

### 🌐 Cross-Platform Integration
- **Multi-Framework Support**: React, Vue, Svelte, Angular with automatic component conversion
- **Build Tool Integration**: Vite, Webpack, Next.js, Nuxt, SvelteKit project generation
- **IDE Extensions**: VS Code, WebStorm plugins with live assistance
- **Design Tool Sync**: Figma plugin for design-to-code conversion
- **Universal Deployment**: CLI tools, browser extensions, and API integrations

### 🚀 Advanced Capabilities
- **Framework Adapters**: Automatic component conversion between frameworks
- **Universal Project Generation**: Create full-stack applications with any tech stack
- **Multi-Platform Deployment**: Deploy to development environments, production, and design tools
- **External API Integration**: Gemini, OpenAI, Claude, Figma for enhanced AI capabilities
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG compliance checking and enhancement suggestions
- **Performance**: Bundle size optimization and render performance analysis
- **Visual Preview**: Screenshot generation for component visualization

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Docker (for containerized deployment)
- (Optional) Gemini API key for AI features

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/Tai-DT/mcp-tailwind-gemini.git
cd mcp-tailwind-gemini
```

2. Set up environment:
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your API key
# GEMINI_API_KEY=your_actual_api_key_here
```

3. Deploy with Docker:
```bash
# Build and run production container
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker ps | grep mcp-tailwind-server
```

### Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Set up environment:
```bash
# Copy environment template
cp env.example .env

# Edit with your API key
# GEMINI_API_KEY=your_actual_api_key_here
```

4. Run development server:
```bash
npm run dev
```

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "npx",
      "args": ["mcp-gemini-cli", "--allow-npx"],
      "env": {
        "GEMINI_API_KEY": ""your-api-key-here"
      }
}
```

**Config File Locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Alternative Configuration (using npm):**
```json
{
  "mcpServers": {
    "mcp-tailwind-gemini": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/path/to/your/mcp-tailwind-gemini",
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

#### For Cursor IDE

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mcp-tailwind-gemini": {
      "command": "node",
      "args": ["/path/to/your/mcp-tailwind-gemini/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```
## 🛠️ Available Tools

### Component Generation
```javascript
{
  "tool": "generate_component",
  "description": "Create a responsive button component",
  "type": "button",
  "variant": "primary",
  "size": "lg",
  "framework": "react",
  "responsive": true,
  "accessibility": true
}
```

### Class Optimization
```javascript
{
  "tool": "optimize_classes", 
  "html": "<div class=\"p-4 px-4 py-4 text-blue-500 text-blue-600\">Content</div>",
  "removeRedundant": true,
  "mergeConflicts": true
}
```

### Theme Creation
```javascript
{
  "tool": "create_theme",
  "brandColor": "#3B82F6",
  "style": "modern",
  "colorCount": 9,
  "includeConfig": true
}
```

### Design Analysis
```javascript
{
  "tool": "analyze_design",
  "html": "<div>...</div>",
  "checkAccessibility": true,
  "checkResponsive": true,
  "checkPerformance": true
}
```

### Preview Generation
```javascript
{
  "tool": "generate_preview",
  "html": "<button class=\"bg-blue-500 text-white px-4 py-2 rounded\">Button</button>",
  "width": 800,
  "height": 600
}
```

### CSS Conversion
```javascript
{
  "tool": "convert_to_tailwind",
  "code": ".button { padding: 1rem; background: #3B82F6; }",
  "format": "css",
  "optimize": true
}
```

### AI Suggestions
```javascript
{
  "tool": "suggest_improvements",
  "html": "<div>...</div>",
  "context": "E-commerce product card",
  "focusAreas": ["accessibility", "performance", "ux"]
}
```

### Layout Generation
```javascript
{
  "tool": "create_layout",
  "type": "dashboard",
  "sections": ["header", "sidebar", "main", "footer"],
  "complexity": "medium",
  "framework": "react"
}
```

## 🎯 Use Cases

### Creating Components
Generate production-ready components with AI assistance:
- Modern button variants with accessibility features
- Responsive card layouts with proper spacing
- Form components with validation styling
- Navigation menus with mobile-first design

### Design Optimization
Improve existing designs with intelligent analysis:
- Remove redundant Tailwind classes
- Resolve conflicting utility classes
- Optimize for performance and maintainability
- Enhance accessibility compliance

### Theme Development
Build comprehensive design systems:
- Generate cohesive color palettes
- Create typography scales
- Design spacing systems
- Export Tailwind configuration files

## 🌐 Cross-Platform Usage

### Multi-Framework Development
```javascript
// Convert HTML component to any framework
{
  "tool": "generate_component",
  "description": "Modern button component",
  "framework": "react", // or "vue", "svelte", "angular"
  "typescript": true,
  "features": ["loading-state", "variant-support"]
}
```

### Universal Project Generation  
```javascript
// Create full-stack project with any tech stack
{
  "tool": "create_project",
  "name": "My App",
  "framework": "react",
  "buildTool": "vite", // or "webpack", "nextjs", "nuxt"
  "features": ["typescript", "tailwind", "testing", "deployment"]
}
```

### Platform Integration
```bash
# VS Code Extension
code --install-extension tailwind-mcp-assistant

# WebStorm Plugin  
# Install from JetBrains Marketplace: "Tailwind MCP Assistant"

# Figma Plugin
# Search "Tailwind MCP" in Figma Community

# CLI Tool
npm install -g tailwind-mcp-cli
tmcp generate --framework react --description "Product card"

# Browser Extension
# Install from Chrome Web Store: "Tailwind MCP Assistant"
```

### Cross-Platform Workflow
```bash
# 1. Design in Figma → Extract with plugin
# 2. Convert to multiple frameworks  
tmcp convert --from figma --to react,vue,svelte

# 3. Generate optimized projects
tmcp create-project --framework react --build vite
tmcp create-project --framework vue --build nuxt

# 4. Deploy to multiple platforms
tmcp deploy --platforms vercel,netlify,aws
```

### Code Migration
Convert existing CSS to Tailwind:
- Transform legacy CSS to utility classes
- Migrate from other frameworks
- Optimize class usage patterns
- Maintain visual consistency

## 🔧 Development

### Running Locally
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing MCP Server

1. **Test with echo command:**
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

2. **Test with a simple tool call:**
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "generate_component", "arguments": {"description": "A simple button", "type": "button"}}}' | node dist/index.js
```

3. **Test with environment variable:**
```bash
GEMINI_API_KEY="your_key" node dist/index.js
```

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (optional)
- `NODE_ENV`: Environment mode (development/production)

### Project Structure
```
src/
├── index.ts              # Main MCP server
├── tools/                # MCP tool implementations
│   ├── component-generator.ts
│   ├── class-optimizer.ts
│   ├── theme-creator.ts
│   ├── design-analyzer.ts
│   ├── preview-generator.ts
│   ├── css-converter.ts
│   ├── ai-suggestions.ts
│   └── layout-generator.ts
└── utils/
    └── gemini.ts          # Gemini AI integration
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🐳 Docker Deployment

### Quick Docker Setup

```bash
# Build production image
docker build -f Dockerfile.runtime -t mcp-tailwind-runtime:latest .

# Run container
docker run -d \
  --name mcp-tailwind-server \
  --env-file .env \
  --restart unless-stopped \
  mcp-tailwind-runtime:latest
```

### Docker Compose (Recommended)

```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Security Best Practices

1. **Environment Variables:**
   ```bash
   # Use .env file (never commit to Git)
   cp env.example .env
   # Edit .env with your actual API key
   ```

2. **Container Security:**
   ```bash
   # Run with resource limits
   docker run -d \
     --name mcp-tailwind-server \
     --env-file .env \
     --memory=512m \
     --cpus=1.0 \
     --restart unless-stopped \
     mcp-tailwind-runtime:latest
   ```

3. **Network Isolation:**
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

For detailed Docker and security guide, see [DOCKER-SECURITY-GUIDE.md](DOCKER-SECURITY-GUIDE.md).

## 🔧 Troubleshooting

### Common Issues

1. **MCP Server not starting:**
   - Ensure you've run `npm run build` first
   - Check that `dist/index.js` exists
   - Verify Node.js version is 18+

2. **Gemini API errors:**
   - Set your `GEMINI_API_KEY` environment variable
   - Verify the API key is valid and has proper permissions
   - Check your internet connection

3. **Docker container issues:**
   ```bash
   # Check container logs
   docker logs mcp-tailwind-server
   
   # Verify environment
   docker exec mcp-tailwind-server env | grep GEMINI
   
   # Restart container
   docker restart mcp-tailwind-server
   ```

4. **Claude Desktop not connecting:**
   - Restart Claude Desktop after updating config
   - Check the config file path is correct
   - Verify JSON syntax is valid

5. **Build errors:**
   ```bash
   # Clean and rebuild
   rm -rf dist/ node_modules/
   npm install
   npm run build
   ```

### Debug Mode
```bash
# Run with debug logging
DEBUG=mcp:* node dist/index.js

# Docker debug
docker run -it --rm \
  --env-file .env \
  mcp-tailwind-runtime:latest npm run dev
```

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/Tai-DT/mcp-tailwind-gemini/issues)
- **Documentation**: Check the examples in this README
- **Discussions**: [GitHub Discussions](https://github.com/Tai-DT/mcp-tailwind-gemini/discussions)

---

Built with ❤️ for the Tailwind CSS and AI community
