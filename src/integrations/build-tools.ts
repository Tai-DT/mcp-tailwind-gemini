import { GeminiHelper } from '../utils/gemini-helper.js';
import { ProjectConfig } from '../adapters/framework-adapter.js';

// Build tool integrations for different platforms
export interface BuildToolIntegration {
  name: string;
  configFile: string;
  extensions: string[];
  generateConfig(options: BuildConfigOptions): Promise<BuildConfig>;
  addTailwindSupport(config: any): any;
  optimizeForProduction(config: any): any;
  addDevTools(config: any): any;
}

export interface BuildConfigOptions {
  framework: string;
  features: string[];
  outputDir: string;
  publicDir: string;
  entryPoint: string;
  cssFramework: 'tailwind' | 'bootstrap' | 'bulma';
  optimization: 'development' | 'production';
  bundleAnalysis?: boolean;
  sourceMaps?: boolean;
  hotReload?: boolean;
}

export interface BuildConfig {
  configFile: string;
  content: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

// Vite Integration
export class ViteIntegration implements BuildToolIntegration {
  name = 'Vite';
  configFile = 'vite.config.js';
  extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'];

  async generateConfig(options: BuildConfigOptions): Promise<BuildConfig> {
    const plugins = this.getPluginsForFramework(options.framework);
    const tailwindConfig = options.cssFramework === 'tailwind' ? this.getTailwindConfig() : '';
    
    const config = `import { defineConfig } from 'vite'
${plugins.imports.join('\n')}

export default defineConfig({
  plugins: [
    ${plugins.list.join(',\n    ')}
  ],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  build: {
    outDir: '${options.outputDir}',
    sourcemap: ${options.sourceMaps !== false},
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  },
  server: {
    port: 3000,
    hot: ${options.hotReload !== false}
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})`;

    return {
      configFile: this.configFile,
      content: config,
      dependencies: {
        'vite': '^5.0.0',
        ...(options.cssFramework === 'tailwind' && {
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0'
        })
      },
      devDependencies: plugins.devDependencies,
      scripts: {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview',
        ...(options.bundleAnalysis && {
          'analyze': 'vite-bundle-analyzer'
        })
      }
    };
  }

  addTailwindSupport(config: any): any {
    return {
      ...config,
      css: {
        ...config.css,
        postcss: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    };
  }

  optimizeForProduction(config: any): any {
    return {
      ...config,
      build: {
        ...config.build,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
            manualChunks: {
              vendor: ['react', 'react-dom'],
              utils: ['lodash', 'date-fns']
            }
          }
        }
      }
    };
  }

  addDevTools(config: any): any {
    return {
      ...config,
      server: {
        ...config.server,
        hmr: true,
        open: true,
      },
      define: {
        __DEV__: true,
      }
    };
  }

  private getPluginsForFramework(framework: string) {
    switch (framework.toLowerCase()) {
      case 'react':
        return {
          imports: ["import react from '@vitejs/plugin-react'"],
          list: ['react()'],
          devDependencies: {
            '@vitejs/plugin-react': '^4.2.0'
          }
        };
      case 'vue':
        return {
          imports: ["import vue from '@vitejs/plugin-vue'"],
          list: ['vue()'],
          devDependencies: {
            '@vitejs/plugin-vue': '^5.0.0'
          }
        };
      case 'svelte':
        return {
          imports: ["import { svelte } from '@sveltejs/vite-plugin-svelte'"],
          list: ['svelte()'],
          devDependencies: {
            '@sveltejs/vite-plugin-svelte': '^3.0.0'
          }
        };
      default:
        return {
          imports: [],
          list: [],
          devDependencies: {}
        };
    }
  }

  private getTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}`;
  }
}

// Webpack Integration
export class WebpackIntegration implements BuildToolIntegration {
  name = 'Webpack';
  configFile = 'webpack.config.js';
  extensions = ['.js', '.ts', '.jsx', '.tsx'];

  async generateConfig(options: BuildConfigOptions): Promise<BuildConfig> {
    const config = `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.${this.getExtension(options.framework)}',
  output: {
    path: path.resolve(__dirname, '${options.outputDir}'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\\.css$/,
        use: [
          ${options.optimization === 'production' ? 'MiniCssExtractPlugin.loader' : "'style-loader'"},
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    ${options.optimization === 'production' ? 'new MiniCssExtractPlugin(),' : ''}
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, '${options.publicDir}'),
    hot: ${options.hotReload !== false},
    port: 3000,
  }
};`;

    return {
      configFile: this.configFile,
      content: config,
      dependencies: {},
      devDependencies: {
        'webpack': '^5.89.0',
        'webpack-cli': '^5.1.0',
        'webpack-dev-server': '^4.15.0',
        'html-webpack-plugin': '^5.6.0',
        'mini-css-extract-plugin': '^2.7.6',
        'babel-loader': '^9.1.3',
        '@babel/core': '^7.23.6',
        '@babel/preset-env': '^7.23.6',
        '@babel/preset-react': '^7.23.3',
        '@babel/preset-typescript': '^7.23.3',
        'css-loader': '^6.8.1',
        'style-loader': '^3.3.3',
        'postcss-loader': '^7.3.3',
        ...(options.cssFramework === 'tailwind' && {
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0'
        })
      },
      scripts: {
        'start': 'webpack serve --mode development',
        'build': 'webpack --mode production',
        'dev': 'webpack serve --mode development --open'
      }
    };
  }

  addTailwindSupport(config: any): any {
    // Add PostCSS configuration for Tailwind
    return config;
  }

  optimizeForProduction(config: any): any {
    return {
      ...config,
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      },
    };
  }

  addDevTools(config: any): any {
    return {
      ...config,
      devtool: 'eval-source-map',
    };
  }

  private getExtension(framework: string): string {
    switch (framework.toLowerCase()) {
      case 'react':
        return 'tsx';
      case 'vue':
        return 'ts';
      default:
        return 'js';
    }
  }
}

// Next.js Integration
export class NextJSIntegration implements BuildToolIntegration {
  name = 'Next.js';
  configFile = 'next.config.js';
  extensions = ['.js', '.ts', '.jsx', '.tsx'];

  async generateConfig(options: BuildConfigOptions): Promise<BuildConfig> {
    const config = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    appDir: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration
    return config;
  },
  ${options.optimization === 'production' ? `
  compiler: {
    removeConsole: true,
  },` : ''}
}

module.exports = nextConfig`;

    return {
      configFile: this.configFile,
      content: config,
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        ...(options.cssFramework === 'tailwind' && {
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0'
        })
      },
      devDependencies: {
        '@types/node': '^20.10.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.3.0'
      },
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'next lint'
      }
    };
  }

  addTailwindSupport(config: any): any {
    return config;
  }

  optimizeForProduction(config: any): any {
    return {
      ...config,
      compiler: {
        ...config.compiler,
        removeConsole: true,
      },
      experimental: {
        ...config.experimental,
        optimizeCss: true,
      }
    };
  }

  addDevTools(config: any): any {
    return {
      ...config,
      reactStrictMode: true,
    };
  }
}

// Nuxt.js Integration
export class NuxtIntegration implements BuildToolIntegration {
  name = 'Nuxt.js';
  configFile = 'nuxt.config.ts';
  extensions = ['.vue', '.ts', '.js'];

  async generateConfig(options: BuildConfigOptions): Promise<BuildConfig> {
    const config = `export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [${options.cssFramework === 'tailwind' ? "'~/assets/css/main.css'" : ''}],
  modules: [
    ${options.cssFramework === 'tailwind' ? "'@nuxtjs/tailwindcss'," : ''}
  ],
  build: {
    transpile: []
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})`;

    return {
      configFile: this.configFile,
      content: config,
      dependencies: {
        'nuxt': '^3.8.0',
        ...(options.cssFramework === 'tailwind' && {
          '@nuxtjs/tailwindcss': '^6.8.0'
        })
      },
      devDependencies: {},
      scripts: {
        'build': 'nuxt build',
        'dev': 'nuxt dev',
        'generate': 'nuxt generate',
        'preview': 'nuxt preview'
      }
    };
  }

  addTailwindSupport(config: any): any {
    return {
      ...config,
      modules: [
        ...config.modules,
        '@nuxtjs/tailwindcss'
      ]
    };
  }

  optimizeForProduction(config: any): any {
    return {
      ...config,
      nitro: {
        ...config.nitro,
        minify: true,
      }
    };
  }

  addDevTools(config: any): any {
    return {
      ...config,
      devtools: { enabled: true }
    };
  }
}

// SvelteKit Integration
export class SvelteKitIntegration implements BuildToolIntegration {
  name = 'SvelteKit';
  configFile = 'svelte.config.js';
  extensions = ['.svelte', '.ts', '.js'];

  async generateConfig(options: BuildConfigOptions): Promise<BuildConfig> {
    const config = `import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter(),
    alias: {
      '@': './src'
    }
  }
};

export default config;`;

    return {
      configFile: this.configFile,
      content: config,
      dependencies: {
        '@sveltejs/adapter-auto': '^2.1.0',
        '@sveltejs/kit': '^1.27.0',
        'svelte': '^4.2.0',
        ...(options.cssFramework === 'tailwind' && {
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.0',
          'postcss': '^8.4.0'
        })
      },
      devDependencies: {
        '@sveltejs/vite-plugin-svelte': '^2.5.0',
        'vite': '^4.5.0'
      },
      scripts: {
        'dev': 'vite dev',
        'build': 'vite build',
        'preview': 'vite preview'
      }
    };
  }

  addTailwindSupport(config: any): any {
    return config;
  }

  optimizeForProduction(config: any): any {
    return config;
  }

  addDevTools(config: any): any {
    return config;
  }
}

// Build Tool Factory
export class BuildToolFactory {
  private static integrations: Map<string, BuildToolIntegration> = new Map([
    ['vite', new ViteIntegration()],
    ['webpack', new WebpackIntegration()],
    ['nextjs', new NextJSIntegration()],
    ['nuxt', new NuxtIntegration()],
    ['sveltekit', new SvelteKitIntegration()]
  ]);

  static getIntegration(tool: string): BuildToolIntegration | null {
    return this.integrations.get(tool.toLowerCase()) || null;
  }

  static getSupportedTools(): string[] {
    return Array.from(this.integrations.keys());
  }

  static registerIntegration(name: string, integration: BuildToolIntegration): void {
    this.integrations.set(name.toLowerCase(), integration);
  }
}

// Universal project generator
export interface UniversalProjectOptions {
  name: string;
  framework: 'react' | 'vue' | 'svelte' | 'angular' | 'nextjs' | 'nuxt' | 'sveltekit';
  buildTool?: 'vite' | 'webpack' | 'rollup' | 'parcel';
  cssFramework: 'tailwind' | 'bootstrap' | 'bulma';
  features: string[];
  typescript: boolean;
  testing: boolean;
  linting: boolean;
  formatting: boolean;
  husky: boolean;
  storybook: boolean;
}

export async function generateUniversalProject(options: UniversalProjectOptions): Promise<{
  files: Array<{ path: string; content: string }>;
  instructions: string[];
}> {
  const files: Array<{ path: string; content: string }> = [];
  const instructions: string[] = [];

  // Determine build tool based on framework
  let buildTool = options.buildTool;
  if (!buildTool) {
    buildTool = options.framework === 'nextjs' ? 'webpack' : 
                options.framework === 'nuxt' ? 'webpack' :
                options.framework === 'sveltekit' ? 'vite' : 'vite';
  }

  // Get framework adapter
  const { AdapterFactory } = await import('../adapters/framework-adapter');
  const adapter = AdapterFactory.getAdapter(options.framework);
  
  if (!adapter) {
    throw new Error(`Unsupported framework: ${options.framework}`);
  }

  // Get build tool integration
  const integration = BuildToolFactory.getIntegration(buildTool);
  
  if (!integration) {
    throw new Error(`Unsupported build tool: ${buildTool}`);
  }

  // Generate project structure
  const projectConfig: ProjectConfig = {
    name: options.name,
    framework: options.framework,
    features: options.features,
    buildTool,
    cssFramework: options.cssFramework,
    stateManagement: (options as any).stateManagement,
    routing: (options as any).routing
  };

  const projectStructure = await adapter.generateProject(projectConfig);
  files.push(...projectStructure.files.map((f: any) => ({ path: f.path, content: f.content })));

  // Generate build configuration
  const buildConfig = await integration.generateConfig({
    framework: options.framework,
    features: options.features,
    outputDir: 'dist',
    publicDir: 'public',
    entryPoint: 'src/main',
    cssFramework: options.cssFramework,
    optimization: 'development',
    bundleAnalysis: true,
    sourceMaps: true,
    hotReload: true
  });

  files.push({
    path: buildConfig.configFile,
    content: buildConfig.content
  });

  // Add additional configurations
  if (options.typescript) {
    files.push({
      path: 'tsconfig.json',
      content: generateTSConfig(options.framework)
    });
  }

  if (options.cssFramework === 'tailwind') {
    files.push({
      path: 'tailwind.config.js',
      content: generateTailwindConfig(options.framework)
    });
    
    files.push({
      path: 'postcss.config.js',
      content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    });
  }

  if (options.linting) {
    files.push({
      path: '.eslintrc.js',
      content: generateESLintConfig(options.framework, options.typescript)
    });
  }

  if (options.formatting) {
    files.push({
      path: '.prettierrc',
      content: JSON.stringify({
        semi: true,
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2
      }, null, 2)
    });
  }

  // Generate instructions
  instructions.push(
    `1. Install dependencies: npm install`,
    `2. Start development server: npm run dev`,
    `3. Build for production: npm run build`,
    ...(options.linting ? ['4. Run linting: npm run lint'] : []),
    ...(options.testing ? ['5. Run tests: npm run test'] : [])
  );

  return { files, instructions };
}

function generateTSConfig(framework: string): string {
  const baseConfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: framework === 'react' ? 'react-jsx' : 'preserve',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
    references: [{ path: './tsconfig.node.json' }]
  };

  return JSON.stringify(baseConfig, null, 2);
}

function generateTailwindConfig(framework: string): string {
  const contentPaths = {
    react: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    vue: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    svelte: ['./src/**/*.{html,js,svelte,ts}'],
    angular: ['./src/**/*.{html,ts}']
  };

  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ${JSON.stringify(contentPaths[framework as keyof typeof contentPaths] || contentPaths.react)},
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

function generateESLintConfig(framework: string, typescript: boolean): string {
  const config = {
    env: {
      browser: true,
      es2020: true
    },
    extends: [
      'eslint:recommended',
      ...(typescript ? ['@typescript-eslint/recommended'] : []),
      ...(framework === 'react' ? ['plugin:react-hooks/recommended'] : [])
    ],
    parser: typescript ? '@typescript-eslint/parser' : undefined,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: [
      ...(framework === 'react' ? ['react-refresh'] : []),
      ...(typescript ? ['@typescript-eslint'] : [])
    ],
    rules: {
      ...(framework === 'react' ? {
        'react-refresh/only-export-components': 'warn'
      } : {})
    }
  };

  return `module.exports = ${JSON.stringify(config, null, 2)}`;
}
