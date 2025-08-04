import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

export interface ComponentGenerationOptions {
  description: string;
  type: 'button' | 'card' | 'form' | 'navigation' | 'modal' | 'table' | 'custom';
  framework?: 'html' | 'react' | 'vue' | 'svelte' | 'angular';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  responsive?: boolean;
  accessibility?: boolean;
}

const COMPONENT_TEMPLATES = {
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      link: 'text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500'
    },
    sizes: {
      xs: 'h-6 px-2 text-xs rounded',
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-sm rounded-md',
      lg: 'h-11 px-6 text-base rounded-md',
      xl: 'h-12 px-8 text-lg rounded-lg'
    }
  },
  card: {
    base: 'bg-white rounded-lg shadow border border-gray-200 overflow-hidden',
    variants: {
      primary: 'shadow-md',
      secondary: 'shadow-sm',
      outline: 'border-2',
      ghost: 'shadow-none border-transparent',
      link: 'hover:shadow-lg transition-shadow cursor-pointer'
    }
  }
};

export async function generateComponent(args: ComponentGenerationOptions) {
  try {
    const {
      description,
      type,
      framework = 'html',
      variant = 'primary',
      size = 'md',
      theme = 'light',
      responsive = true,
      accessibility = true
    } = args;

    let componentCode = '';

    if (isGeminiAvailable()) {
      // Use AI to generate more sophisticated components
      const prompt = `Generate a ${type} component using Tailwind CSS with the following specifications:

Description: ${description}
Framework: ${framework}
Variant: ${variant}
Size: ${size}
Theme: ${theme}
Responsive: ${responsive}
Accessibility: ${accessibility}

Requirements:
1. Use only Tailwind CSS classes
2. Make it modern and visually appealing
3. Include proper semantic HTML
4. ${accessibility ? 'Include ARIA attributes and accessibility features' : ''}
5. ${responsive ? 'Make it responsive with proper breakpoints' : ''}
6. ${theme === 'dark' ? 'Include dark mode classes' : theme === 'auto' ? 'Include both light and dark mode support' : ''}
7. Return only the ${framework} code without explanations

${framework === 'react' ? 'Return as a React functional component with TypeScript.' : ''}
${framework === 'vue' ? 'Return as a Vue 3 single file component.' : ''}
${framework === 'svelte' ? 'Return as a Svelte component.' : ''}
${framework === 'angular' ? 'Return as an Angular component template.' : ''}`;

      componentCode = await callGemini(prompt);
    } else {
      // Fallback to template-based generation
      componentCode = generateFromTemplate(type, variant, size, framework, responsive, accessibility);
    }

    // Clean up the generated code
    componentCode = componentCode.replace(/```[\w]*\n?/g, '').trim();

    return {
      content: [
        {
          type: 'text',
          text: `# Generated ${type} Component\n\n**Framework:** ${framework}\n**Variant:** ${variant}\n**Size:** ${size}\n\n\`\`\`${framework === 'html' ? 'html' : framework}\n${componentCode}\n\`\`\``
        }
      ]
    };
  } catch (error) {
    console.error('Component generation error:', error);
    throw new Error(`Failed to generate component: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateFromTemplate(
  type: string,
  variant: string,
  size: string,
  framework: string,
  responsive: boolean,
  accessibility: boolean
): string {
  if (type === 'button') {
    const buttonTemplate = COMPONENT_TEMPLATES.button;
    const baseClasses = buttonTemplate.base;
    const variantClasses = buttonTemplate.variants[variant as keyof typeof buttonTemplate.variants] || buttonTemplate.variants.primary;
    const sizeClasses = buttonTemplate.sizes[size as keyof typeof buttonTemplate.sizes] || buttonTemplate.sizes.md;
    
    const classes = `${baseClasses} ${variantClasses} ${sizeClasses}`;
    
    if (framework === 'react') {
      return `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ children, onClick, disabled = false, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`${classes} \${className}\`}
      ${accessibility ? 'aria-label="Button"' : ''}
    >
      {children}
    </button>
  );
}`;
    } else {
      return `<button 
  class="${classes}"
  ${accessibility ? 'aria-label="Button"' : ''}
>
  Button Text
</button>`;
    }
  }

  // For other component types
  const template = COMPONENT_TEMPLATES[type as keyof typeof COMPONENT_TEMPLATES];
  if (!template) {
    throw new Error(`Template not found for component type: ${type}`);
  }

  return `<div class="${template.base} ${template.variants[variant as keyof typeof template.variants] || ''}">\n  <!-- ${type} content -->\n</div>`;
}
