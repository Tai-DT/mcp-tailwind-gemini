import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProjectArgs {
  projectName: string;
  framework?: 'react' | 'vue' | 'svelte';
  typescript?: boolean;
  components?: string[];
  template?: 'basic' | 'dashboard' | 'landing' | 'blog' | 'auth';
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Project templates
const PROJECT_TEMPLATES = {
  basic: {
    description: 'Basic setup with essential components',
    components: ['button', 'card'],
    pages: ['Home']
  },
  dashboard: {
    description: 'Dashboard layout with navigation and data display',
    components: ['button', 'card', 'table', 'nav-menu', 'sidebar', 'avatar', 'badge', 'chart'],
    pages: ['Dashboard', 'Analytics', 'Settings']
  },
  landing: {
    description: 'Landing page with hero section and features',
    components: ['button', 'card', 'hero', 'features', 'footer'],
    pages: ['Home', 'About', 'Contact']
  },
  blog: {
    description: 'Blog layout with post listing and detail pages',
    components: ['button', 'card', 'breadcrumb', 'avatar', 'separator'],
    pages: ['Home', 'Blog', 'Post', 'About']
  },
  auth: {
    description: 'Authentication pages with forms',
    components: ['button', 'card', 'input', 'label', 'form', 'alert'],
    pages: ['Login', 'Register', 'ForgotPassword', 'Dashboard']
  }
};

// Vite configs for different frameworks
const VITE_CONFIGS = {
  react: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
  vue: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
  svelte: `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`
};

const PACKAGE_CONFIGS = {
  react: {
    dependencies: [
      'react',
      'react-dom',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react'
    ],
    devDependencies: [
      '@types/react',
      '@types/react-dom',
      '@vitejs/plugin-react',
      'vite',
      'typescript',
      '@tailwindcss/vite',
      'tailwindcss',
      'autoprefixer'
    ]
  },
  vue: {
    dependencies: [
      'vue',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-vue-next'
    ],
    devDependencies: [
      '@vitejs/plugin-vue',
      'vite',
      'typescript',
      'vue-tsc',
      '@tailwindcss/vite',
      'tailwindcss',
      'autoprefixer'
    ]
  },
  svelte: {
    dependencies: [
      'svelte',
      'tailwind-variants',
      'bits-ui',
      'clsx',
      'tailwind-merge',
      'lucide-svelte'
    ],
    devDependencies: [
      '@sveltejs/vite-plugin-svelte',
      'vite',
      'typescript',
      'svelte-check',
      '@tailwindcss/vite',
      'tailwindcss',
      'autoprefixer'
    ]
  }
};

export async function createProject(args: ProjectArgs) {
  try {
    const {
      projectName,
      framework = 'react',
      typescript = true,
      components = [],
      template = 'basic'
    } = args;

    const templateConfig = PROJECT_TEMPLATES[template];
    const allComponents = [...new Set([...templateConfig.components, ...components])];

    let content = `# ${projectName} - ${framework} Project Setup\n\n`;
    content += `Generated project setup for a ${templateConfig.description}.\n\n`;

    // 1. Package.json
    const packageConfig = PACKAGE_CONFIGS[framework];
    const packageJson = {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: typescript ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview',
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      },
      dependencies: Object.fromEntries(packageConfig.dependencies.map(dep => [dep, 'latest'])),
      devDependencies: Object.fromEntries(packageConfig.devDependencies.map(dep => [dep, 'latest']))
    };

    content += `## 1. Package Configuration\n\n\`\`\`json\n${JSON.stringify(packageJson, null, 2)}\n\`\`\`\n\n`;

    // 2. Vite config
    content += `## 2. Vite Configuration\n\n\`\`\`${typescript ? 'ts' : 'js'}\n${VITE_CONFIGS[framework]}\n\`\`\`\n\n`;

    // 3. Tailwind config
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{${framework === 'svelte' ? 'js,ts,svelte' : 'js,ts,jsx,tsx'}}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}`;

    content += `## 3. Tailwind Configuration\n\n\`\`\`js\n${tailwindConfig}\n\`\`\`\n\n`;

    // 4. CSS with CSS variables
    const cssContent = `@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

    content += `## 4. Global CSS\n\n\`\`\`css\n${cssContent}\n\`\`\`\n\n`;

    // 5. Utility functions
    const utilsContent = framework === 'react' ? 
      `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}` :
      `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

    content += `## 5. Utility Functions\n\n\`\`\`${typescript ? 'ts' : 'js'}\n${utilsContent}\n\`\`\`\n\n`;

    // 6. Installation steps
    content += `## 6. Installation Steps\n\n`;
    content += `\`\`\`bash\n# 1. Create project directory\nmkdir ${projectName.toLowerCase().replace(/\s+/g, '-')}\ncd ${projectName.toLowerCase().replace(/\s+/g, '-')}\n\n`;
    content += `# 2. Initialize project\nnpm create vite@latest . --template ${framework}${typescript ? '-ts' : ''}\n\n`;
    content += `# 3. Install dependencies\nnpm install ${packageConfig.dependencies.join(' ')}\n\n`;
    content += `# 4. Install dev dependencies\nnpm install -D ${packageConfig.devDependencies.join(' ')}\n\n`;
    content += `# 5. Start development server\nnpm run dev\n\`\`\`\n\n`;

    // 7. Components to implement
    content += `## 7. Recommended Components\n\n`;
    content += `The following shadcn/ui components are recommended for this template:\n\n`;
    allComponents.forEach(comp => {
      content += `- ${comp}\n`;
    });
    content += `\n`;

    // 8. AI-generated project structure
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Generate a detailed project structure and initial implementation plan for a ${framework} project with the following requirements:

Project Name: ${projectName}
Template: ${template} (${templateConfig.description})
Framework: ${framework}
TypeScript: ${typescript}
Components needed: ${allComponents.join(', ')}

Please provide:
1. Detailed folder structure
2. Key files to create initially
3. Development workflow recommendations
4. Best practices for this setup
5. Next steps after setup`;

        const result = await model.generateContent(prompt);
        const aiRecommendations = result.response.text();
        
        content += `## 8. AI-Generated Project Plan\n\n${aiRecommendations}\n\n`;
      } catch (error) {
        console.warn('Failed to get AI recommendations:', error);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: content
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error creating project: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ]
    };
  }
}
