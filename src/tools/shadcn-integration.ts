import { GoogleGenerativeAI } from '@google/generative-ai';

interface ShadcnComponentArgs {
  componentName: string;
  includeDemo?: boolean;
  framework?: 'react' | 'svelte';
}

interface ComponentData {
  name: string;
  source: string;
  demo?: string;
  dependencies: string[];
  description: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// shadcn/ui components registry
const SHADCN_COMPONENTS = {
  react: {
    button: {
      source: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,
      demo: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button>Button</Button>
}

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}`,
      dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
      description: 'A versatile button component with multiple variants and sizes'
    },
    card: {
      source: `import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`,
      demo: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name">Name</label>
              <input id="name" placeholder="Name of your project" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}`,
      dependencies: [],
      description: 'A flexible card component for displaying content'
    }
  },
  svelte: {
    button: {
      source: `<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Button as ButtonPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";

  const buttonVariants = tv({
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  type Variant = VariantProps<typeof buttonVariants>["variant"];
  type Size = VariantProps<typeof buttonVariants>["size"];

  let className: string | undefined | null = undefined;
  export { className as class };
  export let variant: Variant = "default";
  export let size: Size = "default";
  export let builders: ButtonPrimitive.Props["builders"] = [];
</script>

<button
  class={cn(buttonVariants({ variant, size, className }))}
  use:builders.action
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</button>`,
      demo: `<script>
  import { Button } from "$lib/components/ui/button";
</script>

<Button>Click me</Button>

<!-- Variants -->
<div class="flex gap-2">
  <Button variant="default">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button variant="destructive">Destructive</Button>
</div>`,
      dependencies: ['tailwind-variants', 'bits-ui'],
      description: 'A versatile button component with multiple variants and sizes'
    }
  }
};

export async function getComponent(args: ShadcnComponentArgs) {
  try {
    const { componentName, includeDemo = true, framework = 'react' } = args;
    
    // Get component from registry
    const components = SHADCN_COMPONENTS[framework];
    if (!components) {
      return {
        content: [
          {
            type: 'text',
            text: `Framework "${framework}" not supported. Available frameworks: ${Object.keys(SHADCN_COMPONENTS).join(', ')}`
          }
        ]
      };
    }

    const component = (components as any)[componentName];
    
    if (!component) {
      return {
        content: [
          {
            type: 'text',
            text: `Component "${componentName}" not found for framework "${framework}". Available components: ${Object.keys(components).join(', ')}`
          }
        ]
      };
    }

    let content = `# ${componentName} Component (${framework})\n\n`;
    content += `${component.description}\n\n`;
    
    if (component.dependencies.length > 0) {
      content += `## Dependencies\n\`\`\`bash\nnpm install ${component.dependencies.join(' ')}\n\`\`\`\n\n`;
    }
    
    content += `## Source Code\n\`\`\`${framework === 'react' ? 'tsx' : 'svelte'}\n${component.source}\n\`\`\`\n\n`;
    
    if (includeDemo && component.demo) {
      content += `## Usage Examples\n\`\`\`${framework === 'react' ? 'tsx' : 'svelte'}\n${component.demo}\n\`\`\`\n\n`;
    }

    // Get AI insights about the component
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Analyze this ${framework} component and provide insights about its design patterns, best practices, and potential use cases:

Component: ${componentName}
Code: ${component.source}

Please provide:
1. Key design patterns used
2. Best practices demonstrated
3. Common use cases
4. Customization tips
5. Accessibility considerations`;

        const result = await model.generateContent(prompt);
        const aiInsights = result.response.text();
        
        content += `## AI Insights\n${aiInsights}\n\n`;
      } catch (error) {
        console.warn('Failed to get AI insights:', error);
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
          text: `Error getting component: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ]
    };
  }
}
