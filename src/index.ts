#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Import tools
import {
  generateComponent,
  optimizeClasses,
  createTheme,
  analyzeDesign,
  generatePreview,
  convertToTailwind,
  suggestImprovements,
  createLayout,
  getComponent,
  createProject
} from './utils/tool-functions.js';

// Import types
import type {
  ComponentGenerationOptions,
  ClassOptimizationOptions,
  ThemeCreationOptions,
  DesignAnalysisOptions,
  PreviewOptions,
  ConversionOptions,
  SuggestionOptions,
  LayoutOptions,
  ShadcnComponentRequest,
  ProjectGenerationOptions
} from './types.js';

// Enhanced tool definitions with shadcn/ui integration
const TOOLS = [
  {
    name: 'generate_component',
    description: 'Generate Tailwind CSS components with AI assistance using Gemini',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of the component to generate'
        },
        type: {
          type: 'string',
          enum: ['button', 'card', 'form', 'navigation', 'modal', 'table', 'custom'],
          description: 'Type of component'
        },
        framework: {
          type: 'string',
          enum: ['html', 'react', 'vue', 'svelte', 'angular'],
          default: 'react',
          description: 'Target framework'
        },
        variant: {
          type: 'string',
          enum: ['primary', 'secondary', 'outline', 'ghost', 'link'],
          default: 'primary',
          description: 'Component variant'
        },
        size: {
          type: 'string',
          enum: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
          description: 'Component size'
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'auto'],
          default: 'light',
          description: 'Theme preference'
        },
        useShadcn: {
          type: 'boolean',
          default: true,
          description: 'Use shadcn/ui components as base'
        },
        responsive: {
          type: 'boolean',
          default: true,
          description: 'Make component responsive'
        },
        accessibility: {
          type: 'boolean',
          default: true,
          description: 'Include accessibility features'
        }
      },
      required: ['description', 'type']
    }
  },
  {
    name: 'get_shadcn_component',
    description: 'Get shadcn/ui component source code and usage examples',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the shadcn/ui component (e.g., "button", "card", "form")'
        },
        includeDemo: {
          type: 'boolean',
          default: true,
          description: 'Include usage examples'
        },
        framework: {
          type: 'string',
          enum: ['react', 'svelte'],
          default: 'react',
          description: 'Framework to get component for'
        }
      },
      required: ['componentName']
    }
  },
  {
    name: 'create_project',
    description: 'Create a complete project with Vite + Tailwind + shadcn/ui setup',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project'
        },
        framework: {
          type: 'string',
          enum: ['react', 'vue', 'svelte'],
          default: 'react',
          description: 'Framework to use'
        },
        typescript: {
          type: 'boolean',
          default: true,
          description: 'Use TypeScript'
        },
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'Initial shadcn/ui components to include'
        },
        template: {
          type: 'string',
          enum: ['basic', 'dashboard', 'landing', 'blog', 'auth'],
          default: 'basic',
          description: 'Project template'
        }
      },
      required: ['projectName']
    }
  },
  {
    name: 'optimize_classes',
    description: 'Optimize and clean up Tailwind CSS classes',
    inputSchema: {
      type: 'object',
      properties: {
        html: {
          type: 'string',
          description: 'HTML with Tailwind classes to optimize'
        },
        removeRedundant: {
          type: 'boolean',
          default: true,
          description: 'Remove redundant classes'
        },
        mergeConflicts: {
          type: 'boolean',
          default: true,
          description: 'Resolve conflicting classes'
        },
        suggestAlternatives: {
          type: 'boolean',
          default: true,
          description: 'Suggest better alternatives'
        }
      },
      required: ['html']
    }
  },
  {
    name: 'create_theme',
    description: 'Generate custom Tailwind theme with AI assistance',
    inputSchema: {
      type: 'object',
      properties: {
        brandColor: {
          type: 'string',
          description: 'Primary brand color (hex, rgb, or color name)'
        },
        style: {
          type: 'string',
          enum: ['minimal', 'modern', 'classic', 'bold', 'elegant'],
          default: 'modern',
          description: 'Design style'
        },
        colorCount: {
          type: 'number',
          default: 9,
          minimum: 5,
          maximum: 11,
          description: 'Number of color shades to generate'
        },
        includeConfig: {
          type: 'boolean',
          default: true,
          description: 'Generate tailwind.config.js'
        },
        typography: {
          type: 'boolean',
          default: true,
          description: 'Include typography scale'
        },
        spacing: {
          type: 'boolean',
          default: true,
          description: 'Include custom spacing scale'
        }
      },
      required: ['brandColor']
    }
  },
  {
    name: 'analyze_design',
    description: 'Analyze design with AI for improvements and best practices',
    inputSchema: {
      type: 'object',
      properties: {
        html: {
          type: 'string',
          description: 'HTML code to analyze'
        },
        css: {
          type: 'string',
          description: 'Additional CSS code (optional)'
        },
        context: {
          type: 'string',
          description: 'Design context or purpose'
        },
        checkAccessibility: {
          type: 'boolean',
          default: true,
          description: 'Check accessibility compliance'
        },
        checkResponsive: {
          type: 'boolean',
          default: true,
          description: 'Check responsive design'
        },
        checkPerformance: {
          type: 'boolean',
          default: true,
          description: 'Check performance implications'
        }
      },
      required: ['html']
    }
  },
  {
    name: 'generate_preview',
    description: 'Generate visual preview of Tailwind components',
    inputSchema: {
      type: 'object',
      properties: {
        html: {
          type: 'string',
          description: 'HTML code to preview'
        },
        width: {
          type: 'number',
          default: 800,
          description: 'Preview width in pixels'
        },
        height: {
          type: 'number',
          default: 600,
          description: 'Preview height in pixels'
        },
        darkMode: {
          type: 'boolean',
          default: false,
          description: 'Generate dark mode preview'
        },
        responsive: {
          type: 'boolean',
          default: false,
          description: 'Generate responsive breakpoint previews'
        }
      },
      required: ['html']
    }
  },
  {
    name: 'convert_to_tailwind',
    description: 'Convert CSS/SCSS to Tailwind classes',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'CSS, SCSS, or HTML with styles to convert'
        },
        format: {
          type: 'string',
          enum: ['css', 'scss', 'html'],
          description: 'Input format'
        },
        preserveCustom: {
          type: 'boolean',
          default: false,
          description: 'Preserve custom properties that cannot be converted'
        },
        optimize: {
          type: 'boolean',
          default: true,
          description: 'Optimize the converted classes'
        }
      },
      required: ['code', 'format']
    }
  },
  {
    name: 'suggest_improvements',
    description: 'Get AI-powered suggestions for design improvements',
    inputSchema: {
      type: 'object',
      properties: {
        html: {
          type: 'string',
          description: 'HTML code to analyze'
        },
        context: {
          type: 'string',
          description: 'Context about the design goals'
        },
        targetAudience: {
          type: 'string',
          description: 'Target audience for the design'
        },
        focusAreas: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['accessibility', 'performance', 'ux', 'aesthetics', 'responsiveness']
          },
          description: 'Areas to focus improvements on'
        }
      },
      required: ['html']
    }
  },
  {
    name: 'create_layout',
    description: 'Generate responsive layouts with Tailwind CSS',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['dashboard', 'landing', 'blog', 'ecommerce', 'portfolio', 'documentation'],
          description: 'Layout type'
        },
        sections: {
          type: 'array',
          items: { type: 'string' },
          description: 'Layout sections (header, sidebar, main, footer, etc.)'
        },
        complexity: {
          type: 'string',
          enum: ['simple', 'medium', 'complex'],
          default: 'medium',
          description: 'Layout complexity'
        },
        framework: {
          type: 'string',
          enum: ['html', 'react', 'vue', 'svelte'],
          default: 'html',
          description: 'Target framework'
        }
      },
      required: ['type', 'sections']
    }
  }
];

class TailwindGeminiServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-tailwind-gemini',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Validate args exists
      if (!args) {
        throw new Error(`No arguments provided for tool: ${name}`);
      }

      try {
        switch (name) {
          case 'generate_component':
            return await generateComponent(args as unknown as ComponentGenerationOptions);
          case 'get_shadcn_component':
            return await getComponent(args as unknown as ShadcnComponentRequest);
          case 'create_project':
            return await createProject(args as unknown as ProjectGenerationOptions);
          case 'optimize_classes':
            return await optimizeClasses(args as unknown as ClassOptimizationOptions);
          case 'create_theme':
            return await createTheme(args as unknown as ThemeCreationOptions);
          case 'analyze_design':
            return await analyzeDesign(args as unknown as DesignAnalysisOptions);
          case 'generate_preview':
            return await generatePreview(args as unknown as PreviewOptions);
          case 'convert_to_tailwind':
            return await convertToTailwind(args as unknown as ConversionOptions);
          case 'suggest_improvements':
            return await suggestImprovements(args as unknown as SuggestionOptions);
          case 'create_layout':
            return await createLayout(args as unknown as LayoutOptions);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Tailwind Gemini Server running on stdio');
  }
}

const server = new TailwindGeminiServer();
server.run().catch(console.error);
