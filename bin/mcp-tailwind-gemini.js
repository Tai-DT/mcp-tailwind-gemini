#!/usr/bin/env node

/**
 * MCP Tailwind Gemini Server CLI
 * Command line interface for running the MCP server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Server entry point
const serverPath = join(__dirname, 'dist', 'index.js');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'start';

switch (command) {
  case 'start':
  case 'run':
    console.log('🚀 Starting MCP Tailwind Gemini Server...');
    
    // Check if Gemini API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not found. AI features will be limited.');
      console.warn('   Set GEMINI_API_KEY environment variable for full functionality.');
    }
    
    // Start the server
    const server = spawn('node', [serverPath], {
      stdio: 'inherit',
      env: process.env
    });
    
    server.on('error', (error) => {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    });
    
    server.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Server exited with code ${code}`);
        process.exit(code);
      }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGTERM');
    });
    
    break;
    
  case 'build':
    console.log('🔨 Building MCP Tailwind Gemini Server...');
    
    const build = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully!');
      } else {
        console.error(`❌ Build failed with code ${code}`);
        process.exit(code);
      }
    });
    
    break;
    
  case 'dev':
    console.log('🔧 Starting MCP Tailwind Gemini Server in development mode...');
    
    const dev = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    dev.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Development server exited with code ${code}`);
        process.exit(code);
      }
    });
    
    break;
    
  case 'help':
  case '--help':
  case '-h':
    console.log(`
🎨 MCP Tailwind Gemini Server CLI

Usage:
  mcp-tailwind-gemini [command]

Commands:
  start, run    Start the MCP server (default)
  build         Build the project
  dev           Start in development mode
  help          Show this help message

Environment Variables:
  GEMINI_API_KEY    Your Gemini AI API key (required for AI features)
  DEBUG_MODE        Enable debug mode (true/false)
  LOG_LEVEL         Set log level (error/warn/info/debug)

Examples:
  mcp-tailwind-gemini start
  GEMINI_API_KEY=your_key mcp-tailwind-gemini start
  DEBUG_MODE=true mcp-tailwind-gemini dev

For more information, visit: https://github.com/your-username/mcp-tailwind-gemini
`);
    break;
    
  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "mcp-tailwind-gemini help" for available commands.');
    process.exit(1);
}
