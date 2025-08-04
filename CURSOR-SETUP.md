# 🎯 Cursor IDE Setup for MCP Tailwind Gemini

## Current Configuration

Your current Cursor MCP configuration includes:

```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "npx",
      "args": ["mcp-gemini-cli", "--allow-npx"],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

## Adding MCP Tailwind Gemini

To add the MCP Tailwind Gemini server to your existing configuration, update your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "npx",
      "args": ["mcp-gemini-cli", "--allow-npx"],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    },
    "mcp-tailwind-gemini": {
      "command": "node",
      "args": ["/Users/macbook/Desktop/Code/mcp-tailwind-gemini/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

## Complete Setup Steps

### 1. Build the Project
```bash
cd /Users/macbook/Desktop/Code/mcp-tailwind-gemini
npm install
npm run build
```

### 2. Test MCP Server
```bash
# Test if server responds
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

### 3. Update Cursor Configuration
Add the MCP server configuration to your `~/.cursor/mcp.json`

### 4. Restart Cursor
Restart Cursor IDE to load the new MCP server

### 5. Test Integration
Ask Cursor to:
- "Generate a button component with Tailwind CSS"
- "Create a responsive card layout"
- "Optimize these Tailwind classes: p-4 px-4 py-4"

## Available Tools

Once configured, you'll have access to these tools in Cursor:

- `generate_component` - Create Tailwind components
- `optimize_classes` - Clean up Tailwind classes  
- `create_theme` - Generate color themes
- `analyze_design` - Get design feedback
- `generate_preview` - Create visual previews
- `convert_to_tailwind` - Convert CSS to Tailwind
- `suggest_improvements` - Get AI suggestions
- `create_layout` - Generate responsive layouts
- `get_shadcn_component` - Get shadcn/ui components
- `create_project` - Generate complete projects

## Example Usage

### Generate a Button Component
```javascript
{
  "tool": "generate_component",
  "description": "A modern primary button with hover effects",
  "type": "button",
  "variant": "primary",
  "size": "lg",
  "framework": "react",
  "responsive": true,
  "accessibility": true
}
```

### Optimize Tailwind Classes
```javascript
{
  "tool": "optimize_classes",
  "html": "<div class=\"p-4 px-4 py-4 text-blue-500 text-blue-600 bg-white bg-gray-100\">Content</div>",
  "removeRedundant": true,
  "mergeConflicts": true
}
```

### Create a Theme
```javascript
{
  "tool": "create_theme",
  "brandColor": "#3B82F6",
  "style": "modern",
  "colorCount": 9,
  "includeConfig": true
}
```

## Troubleshooting

### Server not found?
```bash
# Check if build was successful
ls -la dist/

# Rebuild if needed
npm run build
```

### Cursor not connecting?
- Restart Cursor IDE
- Check config file syntax
- Verify the path to dist/index.js is correct

### API errors?
- Set your GEMINI_API_KEY
- Check internet connection
- Verify API key permissions

### Path issues?
Make sure the path in your config matches your actual project location:
```json
"args": ["/Users/macbook/Desktop/Code/mcp-tailwind-gemini/dist/index.js"]
```

## Quick Test Commands

```bash
# Test MCP server directly
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test component generation
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "generate_component", "arguments": {"description": "A simple button", "type": "button"}}}' | node dist/index.js

# Test with environment variable
GEMINI_API_KEY="your_key" node dist/index.js
```

## Next Steps

1. **Explore the tools** - Try different component types and frameworks
2. **Create projects** - Generate complete project setups
3. **Optimize existing code** - Use the optimization tools on your current projects
4. **Build themes** - Create custom design systems
5. **Generate layouts** - Build responsive page layouts

---

**Happy coding with MCP Tailwind Gemini! 🎨✨** 