import { GeminiHelper } from '../utils/gemini-helper.js';

// Framework-specific adapters for cross-platform support
export interface FrameworkAdapter {
  name: string;
  fileExtensions: string[];
  componentSyntax: ComponentSyntax;
  stylingMethod: 'classes' | 'styled-components' | 'css-modules' | 'emotion';
  convertComponent(html: string, options?: ConversionOptions): Promise<string>;
  generateProject(config: ProjectConfig): Promise<ProjectStructure>;
  optimizeForFramework(code: string): Promise<string>;
}

export interface ComponentSyntax {
  componentWrapper: string;
  propsInterface: string;
  stateManagement: string;
  eventHandling: string;
  conditionalRendering: string;
  listRendering: string;
}

export interface ConversionOptions {
  includeTypes?: boolean;
  useCompositionAPI?: boolean;
  addAccessibility?: boolean;
  optimizeBundle?: boolean;
  targetVersion?: string;
}

export interface ProjectConfig {
  name: string;
  framework: string;
  features: string[];
  buildTool: 'vite' | 'webpack' | 'rollup' | 'parcel' | 'esbuild';
  cssFramework: 'tailwind' | 'bootstrap' | 'bulma' | 'material-ui';
  stateManagement?: 'redux' | 'zustand' | 'pinia' | 'mobx' | 'recoil';
  routing?: 'react-router' | 'vue-router' | 'reach-router' | 'next-router';
}

export interface ProjectStructure {
  files: ProjectFile[];
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
  config: Record<string, any>;
}

export interface ProjectFile {
  path: string;
  content: string;
  type: 'component' | 'config' | 'style' | 'test' | 'doc';
}

// React Adapter
export class ReactAdapter implements FrameworkAdapter {
  name = 'React';
  fileExtensions = ['.jsx', '.tsx'];
  stylingMethod: 'classes' = 'classes';
  
  componentSyntax: ComponentSyntax = {
    componentWrapper: 'function Component(props) { return (...); }',
    propsInterface: 'interface Props { ... }',
    stateManagement: 'const [state, setState] = useState(...)',
    eventHandling: 'onClick={handleClick}',
    conditionalRendering: '{condition && <element />}',
    listRendering: '{items.map(item => <Item key={item.id} />)}'
  };

  async convertComponent(html: string, options: ConversionOptions = {}): Promise<string> {
    const gemini = new GeminiHelper();
    
    try {
      const prompt = `Convert this HTML with Tailwind CSS to a React component:

${html}

Requirements:
- Use TypeScript: ${options.includeTypes !== false}
- Add accessibility: ${options.addAccessibility !== false}
- Optimize for performance: ${options.optimizeBundle !== false}
- Target React version: ${options.targetVersion || '18'}

Generate:
1. Proper React component with hooks
2. TypeScript interfaces if enabled
3. Proper event handlers
4. Accessibility attributes
5. Performance optimizations`;

      const reactCode = await gemini.generateContent(prompt);
      
      return this.formatReactComponent(reactCode, options);
    } catch (error) {
      console.error('React conversion failed:', error);
      return this.fallbackReactComponent(html, options);
    }
  }

  async generateProject(config: ProjectConfig): Promise<ProjectStructure> {
    const files: ProjectFile[] = [];
    
    // Package.json
    files.push({
      path: 'package.json',
      type: 'config',
      content: JSON.stringify({
        name: config.name,
        version: '0.1.0',
        private: true,
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0',
          ...(config.stateManagement === 'redux' && {
            '@reduxjs/toolkit': '^2.0.0',
            'react-redux': '^9.0.0'
          }),
          ...(config.routing === 'react-router' && {
            'react-router-dom': '^6.8.0'
          })
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.2.0',
          'vite': '^5.0.0',
          'typescript': '^5.2.0',
          'eslint': '^8.55.0',
          '@typescript-eslint/eslint-plugin': '^6.0.0',
          '@typescript-eslint/parser': '^6.0.0'
        },
        scripts: {
          'dev': 'vite',
          'build': 'tsc && vite build',
          'lint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
          'preview': 'vite preview'
        }
      }, null, 2)
    });

    // Vite config
    files.push({
      path: 'vite.config.ts',
      type: 'config',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})`
    });

    // Tailwind config
    files.push({
      path: 'tailwind.config.js',
      type: 'config',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    });

    // Main App component
    files.push({
      path: 'src/App.tsx',
      type: 'component',
      content: `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ${config.name}
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Welcome to your new React app!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App`
    });

    return {
      files,
      dependencies: {},
      scripts: {},
      config: {}
    };
  }

  async optimizeForFramework(code: string): Promise<string> {
    // React-specific optimizations
    return code
      .replace(/className="([^"]*?)"/g, (match, classes) => {
        // Optimize class names for React
        const optimized = classes.split(' ').filter(Boolean).join(' ');
        return `className="${optimized}"`;
      })
      .replace(/onClick="([^"]*?)"/g, 'onClick={$1}') // Convert to proper React event handlers
      .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2 />'); // Ensure self-closing tags
  }

  private formatReactComponent(code: string, options: ConversionOptions): string {
    let formatted = code;
    
    if (options.includeTypes !== false) {
      formatted = `import React from 'react';\n\n${formatted}`;
    }
    
    return formatted;
  }

  private fallbackReactComponent(html: string, options: ConversionOptions): string {
    const componentName = 'GeneratedComponent';
    
    return `import React from 'react';

${options.includeTypes !== false ? `interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}` : ''}

export const ${componentName}${options.includeTypes !== false ? ': React.FC<' + componentName + 'Props>' : ''} = ({ className, children, ...props }) => {
  return (
    <div className={\`\${className || ''}\`} {...props}>
      {/* Converted from HTML */}
      ${html.replace(/class=/g, 'className=')}
      {children}
    </div>
  );
};

export default ${componentName};`;
  }
}

// Vue Adapter
export class VueAdapter implements FrameworkAdapter {
  name = 'Vue';
  fileExtensions = ['.vue'];
  stylingMethod: 'classes' = 'classes';
  
  componentSyntax: ComponentSyntax = {
    componentWrapper: '<template>...</template><script setup>...</script>',
    propsInterface: 'interface Props { ... }',
    stateManagement: 'const state = ref(...)',
    eventHandling: '@click="handleClick"',
    conditionalRendering: 'v-if="condition"',
    listRendering: 'v-for="item in items" :key="item.id"'
  };

  async convertComponent(html: string, options: ConversionOptions = {}): Promise<string> {
    const gemini = new GeminiHelper();
    
    try {
      const prompt = `Convert this HTML with Tailwind CSS to a Vue 3 component:

${html}

Requirements:
- Use Composition API: ${options.useCompositionAPI !== false}
- Use TypeScript: ${options.includeTypes !== false}
- Add accessibility: ${options.addAccessibility !== false}
- Target Vue version: ${options.targetVersion || '3'}

Generate:
1. Single File Component (.vue)
2. Composition API with <script setup>
3. TypeScript support if enabled
4. Proper Vue directives
5. Reactive state management`;

      const vueCode = await gemini.generateContent(prompt);
      return this.formatVueComponent(vueCode, options);
    } catch (error) {
      console.error('Vue conversion failed:', error);
      return this.fallbackVueComponent(html, options);
    }
  }

  async generateProject(config: ProjectConfig): Promise<ProjectStructure> {
    const files: ProjectFile[] = [];
    
    // Package.json for Vue
    files.push({
      path: 'package.json',
      type: 'config',
      content: JSON.stringify({
        name: config.name,
        version: '0.1.0',
        private: true,
        dependencies: {
          'vue': '^3.4.0',
          '@vitejs/plugin-vue': '^5.0.0',
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0',
          ...(config.stateManagement === 'pinia' && {
            'pinia': '^2.1.0'
          }),
          ...(config.routing === 'vue-router' && {
            'vue-router': '^4.2.0'
          })
        },
        devDependencies: {
          'vite': '^5.0.0',
          'typescript': '^5.2.0',
          'vue-tsc': '^1.8.0',
          '@vue/tsconfig': '^0.5.0'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vue-tsc && vite build',
          'preview': 'vite preview'
        }
      }, null, 2)
    });

    // Vue-specific App component
    files.push({
      path: 'src/App.vue',
      type: 'component',
      content: `<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          ${config.name}
        </h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p class="text-gray-500">Welcome to your new Vue app!</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Component logic here
</script>

<style scoped>
/* Component-specific styles */
</style>`
    });

    return {
      files,
      dependencies: {},
      scripts: {},
      config: {}
    };
  }

  async optimizeForFramework(code: string): Promise<string> {
    // Vue-specific optimizations
    return code
      .replace(/onClick=/g, '@click=')
      .replace(/onChange=/g, '@change=')
      .replace(/className=/g, 'class=')
      .replace(/htmlFor=/g, 'for=');
  }

  private formatVueComponent(code: string, options: ConversionOptions): string {
    return code;
  }

  private fallbackVueComponent(html: string, options: ConversionOptions): string {
    return `<template>
  <div>
    ${html}
  </div>
</template>

<script setup${options.includeTypes !== false ? ' lang="ts"' : ''}>
import { ref } from 'vue'

// Component logic
</script>

<style scoped>
/* Component styles */
</style>`;
  }
}

// Svelte Adapter
export class SvelteAdapter implements FrameworkAdapter {
  name = 'Svelte';
  fileExtensions = ['.svelte'];
  stylingMethod: 'classes' = 'classes';
  
  componentSyntax: ComponentSyntax = {
    componentWrapper: '<script>...</script><main>...</main>',
    propsInterface: 'export let prop: type',
    stateManagement: 'let state = $state(...)',
    eventHandling: 'on:click={handleClick}',
    conditionalRendering: '{#if condition}...{/if}',
    listRendering: '{#each items as item (item.id)}...{/each}'
  };

  async convertComponent(html: string, options: ConversionOptions = {}): Promise<string> {
    const gemini = new GeminiHelper();
    
    try {
      const prompt = `Convert this HTML with Tailwind CSS to a Svelte component:

${html}

Requirements:
- Use TypeScript: ${options.includeTypes !== false}
- Add accessibility: ${options.addAccessibility !== false}
- Use Svelte 5 runes: ${options.targetVersion === '5'}

Generate:
1. Svelte component (.svelte)
2. TypeScript support if enabled
3. Proper Svelte directives
4. Reactive state management
5. Event handling`;

      const svelteCode = await gemini.generateContent(prompt);
      return this.formatSvelteComponent(svelteCode, options);
    } catch (error) {
      console.error('Svelte conversion failed:', error);
      return this.fallbackSvelteComponent(html, options);
    }
  }

  async generateProject(config: ProjectConfig): Promise<ProjectStructure> {
    const files: ProjectFile[] = [];
    
    // Package.json for Svelte
    files.push({
      path: 'package.json',
      type: 'config',
      content: JSON.stringify({
        name: config.name,
        version: '0.1.0',
        private: true,
        dependencies: {
          'svelte': '^4.2.0',
          '@sveltejs/vite-plugin-svelte': '^3.0.0',
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0'
        },
        devDependencies: {
          'vite': '^5.0.0',
          'typescript': '^5.2.0',
          'svelte-check': '^3.6.0',
          '@tsconfig/svelte': '^5.0.0'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build',
          'preview': 'vite preview',
          'check': 'svelte-check --tsconfig ./tsconfig.json'
        }
      }, null, 2)
    });

    return {
      files,
      dependencies: {},
      scripts: {},
      config: {}
    };
  }

  async optimizeForFramework(code: string): Promise<string> {
    // Svelte-specific optimizations
    return code
      .replace(/onClick=/g, 'on:click=')
      .replace(/onChange=/g, 'on:change=')
      .replace(/className=/g, 'class=');
  }

  private formatSvelteComponent(code: string, options: ConversionOptions): string {
    return code;
  }

  private fallbackSvelteComponent(html: string, options: ConversionOptions): string {
    return `<script${options.includeTypes !== false ? ' lang="ts"' : ''}>
  // Component logic
</script>

<main>
  ${html}
</main>

<style>
  /* Component styles */
</style>`;
  }
}

// Angular Adapter
export class AngularAdapter implements FrameworkAdapter {
  name = 'Angular';
  fileExtensions = ['.component.ts', '.component.html'];
  stylingMethod: 'classes' = 'classes';
  
  componentSyntax: ComponentSyntax = {
    componentWrapper: '@Component({ ... }) export class Component { }',
    propsInterface: '@Input() prop: type',
    stateManagement: 'private state = signal(...)',
    eventHandling: '(click)="handleClick()"',
    conditionalRendering: '*ngIf="condition"',
    listRendering: '*ngFor="let item of items; trackBy: trackByFn"'
  };

  async convertComponent(html: string, options: ConversionOptions = {}): Promise<string> {
    const componentName = 'GeneratedComponent';
    
    const template = html
      .replace(/class=/g, 'class=')
      .replace(/onClick=/g, '(click)=')
      .replace(/onChange=/g, '(change)=');

    const component = `import { Component } from '@angular/core';

@Component({
  selector: 'app-generated',
  template: \`
    ${template}
  \`,
  styleUrls: ['./generated.component.css']
})
export class ${componentName} {
  constructor() {}
}`;

    return component;
  }

  async generateProject(config: ProjectConfig): Promise<ProjectStructure> {
    // Angular project structure would be more complex
    return {
      files: [],
      dependencies: {},
      scripts: {},
      config: {}
    };
  }

  async optimizeForFramework(code: string): Promise<string> {
    return code
      .replace(/className=/g, 'class=')
      .replace(/onClick=/g, '(click)=')
      .replace(/onChange=/g, '(change)=');
  }
}

// Factory for creating adapters
export class AdapterFactory {
  private static adapters: Map<string, FrameworkAdapter> = new Map([
    ['react', new ReactAdapter()],
    ['vue', new VueAdapter()],
    ['svelte', new SvelteAdapter()],
    ['angular', new AngularAdapter()]
  ]);

  static getAdapter(framework: string): FrameworkAdapter | null {
    return this.adapters.get(framework.toLowerCase()) || null;
  }

  static getSupportedFrameworks(): string[] {
    return Array.from(this.adapters.keys());
  }

  static registerAdapter(name: string, adapter: FrameworkAdapter): void {
    this.adapters.set(name.toLowerCase(), adapter);
  }
}
