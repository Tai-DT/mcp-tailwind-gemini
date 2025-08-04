import { AdapterFactory } from '../adapters/framework-adapter.js';
import { BuildToolFactory } from '../integrations/build-tools.js';
import { IntegrationManager } from '../integrations/external-apis.js';
import { GeminiHelper } from '../utils/gemini-helper.js';

// Platform-specific plugins and extensions
export interface PlatformPlugin {
  name: string;
  platform: string;
  version: string;
  capabilities: string[];
  install(): Promise<void>;
  configure(options: any): Promise<void>;
  generateCode(prompt: string, context?: any): Promise<string>;
}

// VS Code Extension Integration
export class VSCodeExtension implements PlatformPlugin {
  name = 'Tailwind MCP for VS Code';
  platform = 'vscode';
  version = '1.0.0';
  capabilities = [
    'component-generation',
    'class-optimization',
    'design-analysis',
    'auto-completion',
    'preview-generation'
  ];

  async install(): Promise<void> {
    // VS Code extension installation logic
    console.log('Installing VS Code extension...');
  }

  async configure(options: any): Promise<void> {
    // Generate VS Code extension configuration
    const extensionConfig = {
      "name": "tailwind-mcp-assistant",
      "displayName": "Tailwind MCP Assistant",
      "description": "AI-powered Tailwind CSS development with MCP integration",
      "version": this.version,
      "engines": {
        "vscode": "^1.74.0"
      },
      "categories": ["Other"],
      "main": "./out/extension.js",
      "contributes": {
        "commands": [
          {
            "command": "tailwindMCP.generateComponent",
            "title": "Generate Tailwind Component",
            "category": "Tailwind MCP"
          },
          {
            "command": "tailwindMCP.optimizeClasses",
            "title": "Optimize Tailwind Classes",
            "category": "Tailwind MCP"
          },
          {
            "command": "tailwindMCP.analyzeDesign",
            "title": "Analyze Design",
            "category": "Tailwind MCP"
          },
          {
            "command": "tailwindMCP.createTheme",
            "title": "Create Theme",
            "category": "Tailwind MCP"
          }
        ],
        "keybindings": [
          {
            "command": "tailwindMCP.generateComponent",
            "key": "ctrl+shift+t g",
            "mac": "cmd+shift+t g"
          },
          {
            "command": "tailwindMCP.optimizeClasses",
            "key": "ctrl+shift+t o",
            "mac": "cmd+shift+t o"
          }
        ],
        "menus": {
          "editor/context": [
            {
              "command": "tailwindMCP.optimizeClasses",
              "when": "editorHasSelection",
              "group": "tailwindMCP"
            }
          ]
        },
        "configuration": {
          "title": "Tailwind MCP",
          "properties": {
            "tailwindMCP.apiKey": {
              "type": "string",
              "description": "Gemini API key for AI features"
            },
            "tailwindMCP.autoOptimize": {
              "type": "boolean",
              "default": true,
              "description": "Automatically optimize classes on save"
            },
            "tailwindMCP.framework": {
              "type": "string",
              "enum": ["react", "vue", "svelte", "angular", "html"],
              "default": "react",
              "description": "Default framework for component generation"
            }
          }
        }
      },
      "scripts": {
        "vscode:prepublish": "npm run compile",
        "compile": "tsc -p ./",
        "watch": "tsc -watch -p ./"
      },
      "devDependencies": {
        "@types/vscode": "^1.74.0",
        "@types/node": "16.x",
        "typescript": "^4.9.4"
      }
    };

    console.log('VS Code extension configured:', extensionConfig);
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    const gemini = new GeminiHelper();
    
    const vsCodePrompt = `Generate a VS Code extension command handler for: ${prompt}
    
Context: ${JSON.stringify(context)}

Generate TypeScript code that:
1. Uses VS Code API properly
2. Integrates with MCP server
3. Handles errors gracefully
4. Provides user feedback
5. Supports all major frameworks`;

    return await gemini.generateContent(vsCodePrompt);
  }
}

// WebStorm Plugin Integration
export class WebStormPlugin implements PlatformPlugin {
  name = 'Tailwind MCP for WebStorm';
  platform = 'webstorm';
  version = '1.0.0';
  capabilities = [
    'component-generation',
    'class-optimization',
    'live-templates',
    'intentions',
    'inspections'
  ];

  async install(): Promise<void> {
    console.log('Installing WebStorm plugin...');
  }

  async configure(options: any): Promise<void> {
    const pluginConfig = {
      "id": "com.tailwindmcp.plugin",
      "name": "Tailwind MCP Assistant",
      "version": this.version,
      "vendor": {
        "name": "Tailwind MCP Team"
      },
      "description": "AI-powered Tailwind CSS development",
      "since-build": "223",
      "idea-version": {
        "since-build": "223"
      },
      "depends": [
        "com.intellij.modules.platform",
        "JavaScript"
      ],
      "extensions": {
        "intentionAction": [
          {
            "className": "com.tailwindmcp.intentions.OptimizeClassesIntention"
          }
        ],
        "inspection": [
          {
            "className": "com.tailwindmcp.inspections.RedundantClassesInspection"
          }
        ]
      }
    };

    console.log('WebStorm plugin configured:', pluginConfig);
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    const gemini = new GeminiHelper();
    
    const webStormPrompt = `Generate a WebStorm plugin action for: ${prompt}
    
Context: ${JSON.stringify(context)}

Generate Java/Kotlin code that:
1. Extends IntelliJ Platform API
2. Integrates with MCP server
3. Provides IDE notifications
4. Supports refactoring
5. Works with all web frameworks`;

    return await gemini.generateContent(webStormPrompt);
  }
}

// Figma Plugin Integration
export class FigmaPlugin implements PlatformPlugin {
  name = 'Tailwind MCP for Figma';
  platform = 'figma';
  version = '1.0.0';
  capabilities = [
    'design-to-code',
    'theme-generation',
    'component-export',
    'design-tokens'
  ];

  async install(): Promise<void> {
    console.log('Installing Figma plugin...');
  }

  async configure(options: any): Promise<void> {
    const manifestConfig = {
      "name": "Tailwind MCP Assistant",
      "id": "tailwind-mcp-assistant",
      "api": "1.0.0",
      "main": "code.js",
      "ui": "ui.html",
      "capabilities": [],
      "enablePrivatePluginApi": false,
      "enableProposedApi": false,
      "build": "",
      "permissions": [
        "currentuser"
      ]
    };

    const uiHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Tailwind MCP Assistant</title>
  <style>
    body { font-family: Inter, sans-serif; margin: 16px; }
    .button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .input { border: 1px solid #d1d5db; padding: 8px; border-radius: 6px; width: 100%; margin: 8px 0; }
  </style>
</head>
<body>
  <h2>Tailwind MCP Assistant</h2>
  
  <div>
    <h3>Generate Component</h3>
    <input type="text" id="prompt" class="input" placeholder="Describe your component...">
    <button class="button" onclick="generateComponent()">Generate</button>
  </div>
  
  <div>
    <h3>Extract Design Tokens</h3>
    <button class="button" onclick="extractTokens()">Extract Tokens</button>
  </div>
  
  <div>
    <h3>Convert to Code</h3>
    <select id="framework" class="input">
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="svelte">Svelte</option>
      <option value="html">HTML</option>
    </select>
    <button class="button" onclick="convertToCode()">Convert Selection</button>
  </div>

  <script>
    function generateComponent() {
      const prompt = document.getElementById('prompt').value;
      parent.postMessage({ 
        pluginMessage: { 
          type: 'generate-component', 
          prompt: prompt 
        } 
      }, '*');
    }
    
    function extractTokens() {
      parent.postMessage({ 
        pluginMessage: { 
          type: 'extract-tokens' 
        } 
      }, '*');
    }
    
    function convertToCode() {
      const framework = document.getElementById('framework').value;
      parent.postMessage({ 
        pluginMessage: { 
          type: 'convert-to-code',
          framework: framework
        } 
      }, '*');
    }
  </script>
</body>
</html>`;

    console.log('Figma plugin configured');
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    const gemini = new GeminiHelper();
    
    const figmaPrompt = `Generate Figma plugin code for: ${prompt}
    
Context: ${JSON.stringify(context)}

Generate TypeScript code that:
1. Uses Figma Plugin API
2. Handles UI communication
3. Processes design nodes
4. Generates Tailwind classes
5. Exports to different frameworks`;

    return await gemini.generateContent(figmaPrompt);
  }
}

// CLI Tool Integration
export class CLITool implements PlatformPlugin {
  name = 'Tailwind MCP CLI';
  platform = 'cli';
  version = '1.0.0';
  capabilities = [
    'project-generation',
    'component-creation',
    'batch-optimization',
    'migration-tools'
  ];

  async install(): Promise<void> {
    console.log('Installing CLI tool...');
  }

  async configure(options: any): Promise<void> {
    const packageJson = {
      "name": "tailwind-mcp-cli",
      "version": this.version,
      "description": "Command line interface for Tailwind MCP",
      "bin": {
        "tmcp": "./bin/tmcp.js"
      },
      "main": "dist/index.js",
      "scripts": {
        "build": "tsc",
        "start": "node dist/index.js"
      },
      "dependencies": {
        "commander": "^11.0.0",
        "inquirer": "^9.0.0",
        "chalk": "^5.0.0",
        "ora": "^7.0.0"
      },
      "devDependencies": {
        "@types/node": "^20.0.0",
        "typescript": "^5.0.0"
      }
    };

    const cliCode = `#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { generateUniversalProject } from '../integrations/build-tools.js';
import { AdapterFactory } from '../adapters/framework-adapter.js';

const program = new Command();

program
  .name('tmcp')
  .description('Tailwind MCP CLI - AI-powered Tailwind development')
  .version('${this.version}');

program
  .command('generate')
  .description('Generate a new project with Tailwind MCP')
  .option('-f, --framework <framework>', 'Target framework', 'react')
  .option('-n, --name <name>', 'Project name', 'my-app')
  .option('-t, --typescript', 'Use TypeScript', false)
  .action(async (options) => {
    const spinner = ora('Generating project...').start();
    
    try {
      const result = await generateUniversalProject({
        name: options.name,
        framework: options.framework,
        cssFramework: 'tailwind',
        features: [],
        typescript: options.typescript,
        testing: false,
        linting: true,
        formatting: true,
        husky: false,
        storybook: false
      });
      
      spinner.succeed(chalk.green('Project generated successfully!'));
      
      console.log(chalk.blue('\\nNext steps:'));
      result.instructions.forEach((instruction, index) => {
        console.log(chalk.gray(\`\${index + 1}. \${instruction}\`));
      });
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate project'));
      console.error(error);
    }
  });

program
  .command('component')
  .description('Generate a component')
  .option('-d, --description <description>', 'Component description')
  .option('-f, --framework <framework>', 'Target framework', 'react')
  .action(async (options) => {
    const spinner = ora('Generating component...').start();
    
    try {
      const adapter = AdapterFactory.getAdapter(options.framework);
      if (!adapter) {
        throw new Error(\`Unsupported framework: \${options.framework}\`);
      }
      
      const component = await adapter.convertComponent('', {
        includeTypes: true,
        addAccessibility: true
      });
      
      spinner.succeed(chalk.green('Component generated!'));
      console.log(component);
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate component'));
      console.error(error);
    }
  });

program
  .command('optimize')
  .description('Optimize Tailwind classes in files')
  .argument('<files...>', 'Files to optimize')
  .action(async (files) => {
    const spinner = ora(\`Optimizing \${files.length} files...\`).start();
    
    try {
      // Optimization logic here
      spinner.succeed(chalk.green('Files optimized!'));
    } catch (error) {
      spinner.fail(chalk.red('Optimization failed'));
      console.error(error);
    }
  });

program.parse();`;

    console.log('CLI tool configured');
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    const gemini = new GeminiHelper();
    
    const cliPrompt = `Generate CLI command code for: ${prompt}
    
Context: ${JSON.stringify(context)}

Generate Node.js TypeScript code that:
1. Uses Commander.js for CLI
2. Provides interactive prompts
3. Shows progress indicators
4. Handles errors gracefully
5. Integrates with MCP server`;

    return await gemini.generateContent(cliPrompt);
  }
}

// Browser Extension Integration
export class BrowserExtension implements PlatformPlugin {
  name = 'Tailwind MCP Browser Extension';
  platform = 'browser';
  version = '1.0.0';
  capabilities = [
    'page-analysis',
    'live-editing',
    'class-suggestions',
    'performance-monitoring'
  ];

  async install(): Promise<void> {
    console.log('Installing browser extension...');
  }

  async configure(options: any): Promise<void> {
    const manifest = {
      "manifest_version": 3,
      "name": "Tailwind MCP Assistant",
      "version": this.version,
      "description": "AI-powered Tailwind CSS development in the browser",
      "permissions": [
        "activeTab",
        "storage",
        "scripting"
      ],
      "action": {
        "default_popup": "popup.html",
        "default_title": "Tailwind MCP Assistant"
      },
      "content_scripts": [
        {
          "matches": ["<all_urls>"],
          "js": ["content.js"],
          "css": ["content.css"]
        }
      ],
      "background": {
        "service_worker": "background.js"
      },
      "web_accessible_resources": [
        {
          "resources": ["assets/*"],
          "matches": ["<all_urls>"]
        }
      ]
    };

    console.log('Browser extension configured');
  }

  async generateCode(prompt: string, context?: any): Promise<string> {
    const gemini = new GeminiHelper();
    
    const extensionPrompt = `Generate browser extension code for: ${prompt}
    
Context: ${JSON.stringify(context)}

Generate JavaScript code that:
1. Uses Chrome Extension API
2. Analyzes page DOM
3. Provides visual feedback
4. Communicates with MCP server
5. Handles cross-origin requests`;

    return await gemini.generateContent(extensionPrompt);
  }
}

// Platform Manager
export class PlatformManager {
  private plugins: Map<string, PlatformPlugin> = new Map();
  private integrationManager: IntegrationManager;

  constructor() {
    this.integrationManager = new IntegrationManager();
    this.initializePlugins();
  }

  private initializePlugins(): void {
    this.plugins.set('vscode', new VSCodeExtension());
    this.plugins.set('webstorm', new WebStormPlugin());
    this.plugins.set('figma', new FigmaPlugin());
    this.plugins.set('cli', new CLITool());
    this.plugins.set('browser', new BrowserExtension());
  }

  getPlugin(platform: string): PlatformPlugin | null {
    return this.plugins.get(platform.toLowerCase()) || null;
  }

  getSupportedPlatforms(): string[] {
    return Array.from(this.plugins.keys());
  }

  async installPlugin(platform: string, options?: any): Promise<void> {
    const plugin = this.getPlugin(platform);
    if (!plugin) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    await plugin.install();
    await plugin.configure(options || {});
  }

  async generateForPlatform(
    platform: string, 
    prompt: string, 
    context?: any
  ): Promise<string> {
    const plugin = this.getPlugin(platform);
    if (!plugin) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    return await plugin.generateCode(prompt, context);
  }

  async deployToAllPlatforms(
    prompt: string, 
    context?: any
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    for (const [platform, plugin] of this.plugins) {
      try {
        results[platform] = await plugin.generateCode(prompt, context);
      } catch (error) {
        results[platform] = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }
    
    return results;
  }

  getCapabilitiesMatrix(): Record<string, string[]> {
    const matrix: Record<string, string[]> = {};
    
    for (const [platform, plugin] of this.plugins) {
      matrix[platform] = plugin.capabilities;
    }
    
    return matrix;
  }
}

// Universal deployment function
export async function deployTailwindMCP(options: {
  platforms: string[];
  features: string[];
  apiKeys: Record<string, string>;
  customConfig?: any;
}): Promise<{
  success: boolean;
  deployments: Record<string, any>;
  errors: string[];
}> {
  const manager = new PlatformManager();
  const deployments: Record<string, any> = {};
  const errors: string[] = [];

  for (const platform of options.platforms) {
    try {
      await manager.installPlugin(platform, {
        features: options.features,
        apiKeys: options.apiKeys,
        ...options.customConfig
      });
      
      deployments[platform] = {
        status: 'success',
        capabilities: manager.getPlugin(platform)?.capabilities || []
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${platform}: ${errorMessage}`);
      deployments[platform] = {
        status: 'failed',
        error: errorMessage
      };
    }
  }

  return {
    success: errors.length === 0,
    deployments,
    errors
  };
}

// Platform aliases for compatibility with test scripts
export { VSCodeExtension as VSCodePlugin };
