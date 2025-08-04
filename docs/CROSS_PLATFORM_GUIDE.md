# Cross-Platform Tailwind MCP Integration Guide

This guide explains how to integrate and use the Tailwind MCP server across different platforms and technologies.

## 🌐 Supported Platforms

### Development Environments
- **VS Code** - Extension with commands and shortcuts
- **WebStorm/IntelliJ** - Plugin with intentions and inspections  
- **Figma** - Plugin for design-to-code conversion
- **Browser** - Extension for live editing and analysis

### Frameworks & Libraries
- **React** - Components with TypeScript support
- **Vue 3** - Composition API and TypeScript
- **Svelte/SvelteKit** - Modern Svelte components
- **Angular** - Component and service generation
- **Next.js** - Full-stack React applications
- **Nuxt** - Full-stack Vue applications

### Build Tools
- **Vite** - Fast development and optimized builds
- **Webpack** - Advanced bundling and optimization
- **Rollup** - Library and package bundling
- **Parcel** - Zero-configuration bundling

### External APIs
- **Gemini AI** - Google's generative AI
- **OpenAI** - GPT models for generation
- **Claude** - Anthropic's AI assistant
- **Figma API** - Design token extraction

## 🚀 Quick Start

### 1. Framework Integration

#### React + Vite + TypeScript
```bash
# Generate project
tmcp generate --framework react --typescript --name my-react-app

# Generate component
tmcp component --description "Modern button with loading state" --framework react
```

#### Vue 3 + Nuxt + TypeScript  
```bash
# Generate project
tmcp generate --framework nuxt --typescript --name my-vue-app

# Generate component
tmcp component --description "Responsive card component" --framework vue
```

#### Svelte + SvelteKit
```bash
# Generate project
tmcp generate --framework sveltekit --name my-svelte-app

# Generate component
tmcp component --description "Interactive navigation menu" --framework svelte
```

### 2. IDE Integration

#### VS Code Extension
```json
// settings.json
{
  "tailwindMCP.apiKey": "your-gemini-api-key",
  "tailwindMCP.framework": "react",
  "tailwindMCP.autoOptimize": true
}
```

Commands:
- `Ctrl+Shift+T G` - Generate component
- `Ctrl+Shift+T O` - Optimize classes
- `Ctrl+Shift+T A` - Analyze design

#### WebStorm Plugin
- **Intentions**: Right-click → "Optimize Tailwind classes"
- **Inspections**: Automatic detection of redundant classes
- **Live Templates**: Quick component generation

### 3. Design Tool Integration

#### Figma Plugin
1. Install "Tailwind MCP Assistant" plugin
2. Select design elements
3. Choose target framework
4. Generate component code

#### Browser Extension
1. Install browser extension
2. Visit any webpage
3. Analyze Tailwind usage
4. Get optimization suggestions

## 📋 Usage Examples

### Component Generation

#### Basic Button Component
```javascript
// MCP Tool Call
{
  "tool": "generate_component",
  "args": {
    "description": "Primary button with hover effects",
    "type": "button",
    "framework": "react",
    "variant": "primary",
    "useShadcn": true
  }
}
```

Result:
```jsx
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', className, children, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input hover:bg-accent': variant === 'outline'
        },
        {
          'h-9 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-11 px-8': size === 'lg'
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Project Generation

#### Full-Stack React App
```javascript
// MCP Tool Call
{
  "tool": "create_project",
  "args": {
    "projectName": "E-commerce Dashboard",
    "framework": "react",
    "template": "dashboard",
    "components": ["navigation", "sidebar", "data-table", "charts"],
    "features": ["authentication", "api-integration", "state-management"]
  }
}
```

Generated structure:
```
my-app/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── navigation/   # Navigation components
│   │   ├── charts/       # Chart components
│   │   └── tables/       # Table components
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── styles/
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Theme Creation

#### Corporate Theme
```javascript
// MCP Tool Call
{
  "tool": "create_theme",
  "args": {
    "name": "Corporate Blue",
    "style": "corporate",
    "primaryColor": "#1e40af",
    "accentColor": "#3b82f6",
    "includeDarkMode": true,
    "framework": "both"
  }
}
```

Result:
```css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #1e40af;
  --color-primary-900: #1e3a8a;
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-50: var(--color-primary-900);
    /* ... */
  }
}
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          900: 'var(--color-primary-900)',
        }
      }
    }
  }
}
```

## 🔧 Advanced Configuration

### Multi-Framework Project
```javascript
// Support React, Vue, and Svelte in one project
{
  "tool": "create_project",
  "args": {
    "projectName": "Multi-Framework Design System",
    "framework": "monorepo",
    "packages": [
      {
        "name": "react-components",
        "framework": "react",
        "buildTool": "vite"
      },
      {
        "name": "vue-components", 
        "framework": "vue",
        "buildTool": "vite"
      },
      {
        "name": "svelte-components",
        "framework": "svelte",
        "buildTool": "vite"
      }
    ]
  }
}
```

### Custom Build Pipeline
```javascript
// Integrate with existing build tools
{
  "tool": "optimize_build",
  "args": {
    "buildTool": "webpack",
    "optimizations": [
      "tree-shaking",
      "code-splitting",
      "css-extraction",
      "bundle-analysis"
    ],
    "tailwindConfig": {
      "purge": true,
      "minify": true,
      "prefix": "tw-"
    }
  }
}
```

## 🔌 API Integration

### Multiple AI Providers
```javascript
// Configure multiple AI services for redundancy
const integrationManager = new IntegrationManager();

// Primary: Gemini AI
integrationManager.addIntegration('gemini', new GeminiAIIntegration(process.env.GEMINI_API_KEY));

// Fallback: OpenAI
integrationManager.addIntegration('openai', new OpenAIIntegration(process.env.OPENAI_API_KEY));

// Fallback: Claude
integrationManager.addIntegration('claude', new ClaudeIntegration(process.env.CLAUDE_API_KEY));

// Generate with best available service
const result = await integrationManager.generateWithBestAvailable(prompt);
```

### Design Tool Integration
```javascript
// Extract design tokens from Figma
const figma = new FigmaIntegration(process.env.FIGMA_ACCESS_TOKEN);
const tokens = await figma.getDesignTokens('file-id');

// Convert to Tailwind theme
const theme = await convertTokensToTailwind(tokens);

// Apply to project
await applyTheme(theme, 'tailwind.config.js');
```

## 📱 Platform-Specific Features

### Mobile Development
```javascript
// React Native integration
{
  "tool": "generate_component",
  "args": {
    "description": "Mobile-first card component",
    "framework": "react-native",
    "platform": "mobile",
    "responsive": false,
    "touchOptimized": true
  }
}
```

### Desktop Applications
```javascript
// Electron integration
{
  "tool": "create_project",
  "args": {
    "projectName": "Desktop App",
    "framework": "electron",
    "renderer": "react",
    "styling": "tailwind",
    "features": ["auto-updater", "native-menus"]
  }
}
```

### Static Site Generation
```javascript
// Astro integration
{
  "tool": "create_project",
  "args": {
    "projectName": "Documentation Site",
    "framework": "astro",
    "integrations": ["react", "vue", "svelte"],
    "output": "static"
  }
}
```

## 🎯 Best Practices

### 1. Framework Selection
- **React**: Large applications, complex state management
- **Vue**: Rapid prototyping, progressive enhancement
- **Svelte**: Performance-critical applications
- **Angular**: Enterprise applications, large teams

### 2. Build Tool Selection
- **Vite**: Modern development, fast HMR
- **Webpack**: Complex build requirements, legacy support
- **Rollup**: Libraries and packages
- **Parcel**: Zero-configuration projects

### 3. AI Service Selection
- **Gemini**: Best integration, cost-effective
- **OpenAI**: High quality outputs, established
- **Claude**: Detailed analysis, safety-focused

### 4. Performance Optimization
- Use tree-shaking for unused utilities
- Implement critical CSS extraction
- Enable component-level code splitting
- Configure proper caching strategies

## 🚀 Deployment

### Development
```bash
# Start development server
npm run dev

# With hot reload and AI features
GEMINI_API_KEY=your-key npm run dev
```

### Production
```bash
# Build optimized bundle
npm run build

# Deploy to platforms
npm run deploy:vercel
npm run deploy:netlify
npm run deploy:aws
```

### CI/CD Integration
```yaml
# GitHub Actions
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      - run: npm run test
      - run: npm run deploy
```

This comprehensive integration enables Tailwind MCP to work seamlessly across the entire web development ecosystem, from design tools to deployment platforms.
