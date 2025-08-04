import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface LayoutRequest {
  type: 'dashboard' | 'landing' | 'blog' | 'ecommerce' | 'portfolio' | 'documentation';
  sections: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  framework?: 'html' | 'react' | 'vue' | 'svelte';
}

const LAYOUT_TEMPLATES = {
  dashboard: {
    simple: {
      structure: ['header', 'sidebar', 'main'],
      gridTemplate: 'grid-rows-[auto_1fr] grid-cols-[250px_1fr]'
    },
    medium: {
      structure: ['header', 'sidebar', 'main', 'footer'],
      gridTemplate: 'grid-rows-[auto_1fr_auto] grid-cols-[250px_1fr]'
    },
    complex: {
      structure: ['header', 'sidebar', 'main', 'aside', 'footer'],
      gridTemplate: 'grid-rows-[auto_1fr_auto] grid-cols-[250px_1fr_300px]'
    }
  },
  landing: {
    simple: {
      structure: ['header', 'hero', 'footer'],
      gridTemplate: 'grid-rows-[auto_1fr_auto]'
    },
    medium: {
      structure: ['header', 'hero', 'features', 'cta', 'footer'],
      gridTemplate: 'grid-rows-[auto_auto_auto_auto_auto]'
    },
    complex: {
      structure: ['header', 'hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'],
      gridTemplate: 'grid-rows-[auto_auto_auto_auto_auto_auto_auto]'
    }
  }
};

export async function createLayout(args: LayoutRequest) {
  try {
    const {
      type,
      sections,
      complexity = 'medium',
      framework = 'html'
    } = args;

    let layoutCode = '';

    if (isGeminiAvailable()) {
      const prompt = `Generate a complete ${complexity} ${type} layout using Tailwind CSS with the following specifications:

Layout Type: ${type}
Sections: ${sections.join(', ')}
Complexity: ${complexity}
Framework: ${framework}

Requirements:
1. Create a fully responsive layout using Tailwind CSS
2. Include proper semantic HTML structure
3. Use modern CSS Grid and Flexbox techniques
4. Implement mobile-first responsive design
5. Include placeholder content that's realistic for a ${type}
6. Add proper spacing, typography, and visual hierarchy
7. Include interactive elements with hover states
8. Ensure accessibility with proper ARIA labels
9. Use appropriate color scheme and styling

${framework === 'react' ? 'Generate as React functional components with TypeScript' : ''}
${framework === 'vue' ? 'Generate as Vue 3 composition API components' : ''}
${framework === 'svelte' ? 'Generate as Svelte components' : ''}

For ${type} layout, focus on:
${getLayoutFocusPoints(type)}

Return complete, production-ready code with proper structure and styling.`;

      layoutCode = await callGemini(prompt);
    } else {
      layoutCode = generateTemplateLayout(type, sections, complexity, framework);
    }

    // Clean up the generated code
    layoutCode = layoutCode.replace(/```[\w]*\n?/g, '').trim();

    return {
      content: [
        {
          type: 'text',
          text: `# ${type.charAt(0).toUpperCase() + type.slice(1)} Layout - ${complexity.charAt(0).toUpperCase() + complexity.slice(1)} Complexity

## Generated Layout
\`\`\`${framework === 'html' ? 'html' : framework}
${layoutCode}
\`\`\`

## Layout Features
- **Type**: ${type}
- **Complexity**: ${complexity}
- **Framework**: ${framework}
- **Sections**: ${sections.join(', ')}

## Responsive Breakpoints
- **Mobile**: Base styles (< 640px)
- **Tablet**: sm: prefix (≥ 640px)
- **Desktop**: md: prefix (≥ 768px)
- **Large**: lg: prefix (≥ 1024px)
- **Extra Large**: xl: prefix (≥ 1280px)

## Customization Tips
- Adjust color scheme by modifying color classes
- Change spacing with different padding/margin classes
- Modify typography with font size and weight classes
- Add animations with transition and transform classes
- Customize breakpoints for different responsive behavior

## Accessibility Features
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly content

## Performance Considerations
- Optimized class usage
- Minimal custom CSS required
- Efficient responsive design
- Fast rendering with Tailwind's utility-first approach`
        }
      ]
    };
  } catch (error) {
    console.error('Layout generation error:', error);
    throw new Error(`Failed to create layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getLayoutFocusPoints(type: string): string {
  switch (type) {
    case 'dashboard':
      return '- Data visualization areas\n- Navigation and filtering\n- Sidebar navigation\n- Content hierarchy\n- Action buttons and controls';
    case 'landing':
      return '- Hero section with compelling CTA\n- Feature highlights\n- Social proof elements\n- Clear value proposition\n- Conversion optimization';
    case 'blog':
      return '- Content readability\n- Article layout and typography\n- Navigation and categories\n- Author information\n- Related posts';
    case 'ecommerce':
      return '- Product showcase\n- Shopping cart integration\n- Search and filtering\n- Trust indicators\n- Purchase flow optimization';
    case 'portfolio':
      return '- Project showcases\n- About section\n- Contact information\n- Skills and experience\n- Visual appeal and creativity';
    case 'documentation':
      return '- Clear information hierarchy\n- Search functionality\n- Table of contents\n- Code examples\n- Easy navigation';
    default:
      return '- Clean, modern design\n- User-friendly navigation\n- Responsive layout\n- Accessible content';
  }
}

function generateTemplateLayout(
  type: string,
  sections: string[],
  complexity: string,
  framework: string
): string {
  const template = LAYOUT_TEMPLATES[type as keyof typeof LAYOUT_TEMPLATES];
  
  if (!template) {
    return generateGenericLayout(sections, framework);
  }

  const layoutConfig = template[complexity as keyof typeof template];
  
  if (framework === 'react') {
    return generateReactLayout(type, sections, layoutConfig);
  } else if (framework === 'vue') {
    return generateVueLayout(type, sections, layoutConfig);
  } else {
    return generateHTMLLayout(type, sections, layoutConfig);
  }
}

function generateHTMLLayout(type: string, sections: string[], config: any): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${type.charAt(0).toUpperCase() + type.slice(1)} Layout</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="min-h-screen grid ${config.gridTemplate}">`;

  sections.forEach(section => {
    switch (section) {
      case 'header':
        html += `
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4 col-span-full">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        <nav class="hidden md:flex space-x-6">
          <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
      </div>
    </header>`;
        break;
      case 'sidebar':
        html += `
    <aside class="bg-white border-r border-gray-200 p-6">
      <nav class="space-y-2">
        <a href="#" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Dashboard</a>
        <a href="#" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Analytics</a>
        <a href="#" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Settings</a>
      </nav>
    </aside>`;
        break;
      case 'main':
        html += `
    <main class="p-6 overflow-auto">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Main Content</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-2">Card 1</h3>
            <p class="text-gray-600">Content goes here...</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-2">Card 2</h3>
            <p class="text-gray-600">Content goes here...</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-2">Card 3</h3>
            <p class="text-gray-600">Content goes here...</p>
          </div>
        </div>
      </div>
    </main>`;
        break;
      case 'footer':
        html += `
    <footer class="bg-gray-800 text-white p-6 col-span-full">
      <div class="max-w-7xl mx-auto text-center">
        <p>&copy; 2024 ${type.charAt(0).toUpperCase() + type.slice(1)}. All rights reserved.</p>
      </div>
    </footer>`;
        break;
      default:
        html += `
    <section class="p-6">
      <h2 class="text-xl font-semibold mb-4">${section.charAt(0).toUpperCase() + section.slice(1)}</h2>
      <p class="text-gray-600">Content for ${section} section...</p>
    </section>`;
    }
  });

  html += `
  </div>
</body>
</html>`;

  return html;
}

function generateReactLayout(type: string, sections: string[], config: any): string {
  return `import React from 'react';

interface ${type.charAt(0).toUpperCase() + type.slice(1)}LayoutProps {
  children?: React.ReactNode;
}

export function ${type.charAt(0).toUpperCase() + type.slice(1)}Layout({ children }: ${type.charAt(0).toUpperCase() + type.slice(1)}LayoutProps) {
  return (
    <div className="min-h-screen grid ${config.gridTemplate}">
      ${sections.map(section => generateReactSection(section)).join('\n      ')}
    </div>
  );
}

export default ${type.charAt(0).toUpperCase() + type.slice(1)}Layout;`;
}

function generateReactSection(section: string): string {
  switch (section) {
    case 'header':
      return `<header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 col-span-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
          </nav>
        </div>
      </header>`;
    case 'main':
      return `<main className="p-6 overflow-auto">
        {children}
      </main>`;
    default:
      return `<section className="p-6">
        <h2 className="text-xl font-semibold mb-4">${section.charAt(0).toUpperCase() + section.slice(1)}</h2>
      </section>`;
  }
}

function generateVueLayout(type: string, sections: string[], config: any): string {
  return `<template>
  <div class="min-h-screen grid ${config.gridTemplate}">
    ${sections.map(section => `<${section.charAt(0).toUpperCase() + section.slice(1)}Section />`).join('\n    ')}
  </div>
</template>

<script setup lang="ts">
// Import section components here
</script>`;
}

function generateGenericLayout(sections: string[], framework: string): string {
  if (framework === 'react') {
    return `<div className="min-h-screen">
  ${sections.map(section => `<${section} />`).join('\n  ')}
</div>`;
  } else {
    return `<div class="min-h-screen">
  ${sections.map(section => `<section class="p-6">
    <h2 class="text-xl font-semibold mb-4">${section.charAt(0).toUpperCase() + section.slice(1)}</h2>
  </section>`).join('\n  ')}
</div>`;
  }
}
