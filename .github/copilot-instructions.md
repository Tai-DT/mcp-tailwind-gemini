<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MCP Tailwind Gemini Server Development

This is an advanced Model Context Protocol (MCP) server for Tailwind CSS with Gemini AI integration.

## Project Overview
- **Type**: MCP Server
- **Language**: TypeScript
- **AI Integration**: Google Gemini API
- **Purpose**: Intelligent Tailwind CSS design assistance

## Development Guidelines

### Code Style
- Use TypeScript with strict type checking
- Follow ES modules syntax
- Implement proper error handling
- Use descriptive variable and function names
- Add JSDoc comments for public functions

### MCP Server Architecture
- All tools should be in `/src/tools/` directory
- Each tool should export an async function that returns MCP response format
- Use Zod for input validation
- Handle both AI-powered and fallback manual implementations

### AI Integration
- Always check if Gemini API is available using `isGeminiAvailable()`
- Provide meaningful fallbacks when AI is not available
- Structure AI prompts for optimal results
- Parse AI responses safely with error handling

### Tailwind CSS Best Practices
- Generate semantic HTML with proper accessibility
- Use utility-first approach with Tailwind classes
- Implement responsive design patterns
- Follow modern CSS practices
- Optimize for performance and maintainability

## Available Tools
1. `generate_component` - AI-powered component generation
2. `optimize_classes` - Intelligent class optimization
3. `create_theme` - Custom theme generation with AI
4. `analyze_design` - Comprehensive design analysis
5. `generate_preview` - Visual component preview
6. `convert_to_tailwind` - CSS to Tailwind conversion
7. `suggest_improvements` - AI-powered improvement suggestions
8. `create_layout` - Responsive layout generation

## API References
- MCP SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Gemini AI: https://ai.google.dev/docs
- Tailwind CSS: https://tailwindcss.com/docs
- You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

## Environment Variables
- `GEMINI_API_KEY`: Required for AI features (optional for basic functionality)
