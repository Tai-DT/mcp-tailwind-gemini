# 🔌 MCP Client Connections

## For Claude Desktop

Add to your Claude Desktop configuration file:

**Location:** `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node",
      "args": ["/Users/macbook/Desktop/Code/mcp-tailwind-gemini/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

## For VS Code (MCP Extension)

Add to VS Code MCP settings:

```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

## For Cline (VS Code Extension)

Configure in Cline settings:

```json
{
  "mcpServers": {
    "tailwind-gemini": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

## For Continue (VS Code Extension)

Add to `.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "tailwind-gemini",
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_actual_api_key_here"
      }
    }
  ]
}
```

## For Other MCP Clients

Generic configuration:
- **Command:** `node`
- **Args:** `["dist/index.js"]` or full path
- **Environment:** `GEMINI_API_KEY=your_key`
- **Working Directory:** Project root

---

**⚠️ Important:** Replace `your_actual_api_key_here` with your real Gemini API key!
