import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface ThemeRequest {
  brandColor: string;
  style?: 'minimal' | 'modern' | 'classic' | 'bold' | 'elegant';
  colorCount?: number;
  includeConfig?: boolean;
  typography?: boolean;
  spacing?: boolean;
}

interface ColorShade {
  [key: string]: string;
}

interface ThemeConfig {
  colors: {
    primary: ColorShade;
    secondary?: ColorShade;
    accent?: ColorShade;
    neutral?: ColorShade;
  };
  typography?: {
    fontFamily: { [key: string]: string[] };
    fontSize: { [key: string]: [string, { lineHeight: string }] };
  };
  spacing?: { [key: string]: string };
  borderRadius?: { [key: string]: string };
  boxShadow?: { [key: string]: string };
}

export async function createTheme(args: ThemeRequest) {
  try {
    const {
      brandColor,
      style = 'modern',
      colorCount = 9,
      includeConfig = true,
      typography = true,
      spacing = true
    } = args;

    let themeConfig: ThemeConfig;
    let designSystemNotes = '';

    if (isGeminiAvailable()) {
      // Use AI to generate sophisticated theme
      const prompt = `Create a comprehensive Tailwind CSS theme based on the following specifications:

Brand Color: ${brandColor}
Design Style: ${style}
Color Shades: ${colorCount} (50, 100, 200, ..., 900)
Include Typography: ${typography}
Include Spacing: ${spacing}

Requirements:
1. Generate a complete color palette with ${colorCount} shades of the brand color
2. Create complementary secondary and accent colors that work well with the brand color
3. Include neutral colors (grays) that complement the theme
4. ${typography ? 'Design a typography scale with font families, sizes, and line heights' : ''}
5. ${spacing ? 'Create a custom spacing scale that fits the design style' : ''}
6. Include border radius, shadows, and other design tokens for the ${style} style
7. Ensure accessibility with proper contrast ratios
8. Provide design system notes and usage guidelines

Return a JSON response with:
{
  "themeConfig": {
    "colors": {
      "primary": { "50": "#...", "100": "#...", ... },
      "secondary": { "50": "#...", "100": "#...", ... },
      "accent": { "50": "#...", "100": "#...", ... },
      "neutral": { "50": "#...", "100": "#...", ... }
    },
    ${typography ? '"typography": { "fontFamily": {...}, "fontSize": {...} },' : ''}
    ${spacing ? '"spacing": {...},' : ''}
    "borderRadius": {...},
    "boxShadow": {...}
  },
  "designSystemNotes": "Comprehensive usage guidelines and design principles"
}`;

      const aiResponse = await callGemini(prompt);
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          themeConfig = parsedResponse.themeConfig;
          designSystemNotes = parsedResponse.designSystemNotes || '';
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        // Fallback to manual generation
        themeConfig = generateManualTheme(brandColor, style, colorCount, typography, spacing);
        designSystemNotes = `Generated ${style} theme based on ${brandColor}`;
      }
    } else {
      // Manual theme generation
      themeConfig = generateManualTheme(brandColor, style, colorCount, typography, spacing);
      designSystemNotes = `Generated ${style} theme based on ${brandColor}`;
    }

    // Generate Tailwind config if requested
    const tailwindConfig = includeConfig ? generateTailwindConfig(themeConfig) : '';

    return {
      content: [
        {
          type: 'text',
          text: `# Custom Tailwind Theme - ${style.charAt(0).toUpperCase() + style.slice(1)} Style

## Design System Overview
${designSystemNotes}

## Color Palette

### Primary Colors
${formatColorPalette(themeConfig.colors.primary)}

${themeConfig.colors.secondary ? `### Secondary Colors\n${formatColorPalette(themeConfig.colors.secondary)}` : ''}

${themeConfig.colors.accent ? `### Accent Colors\n${formatColorPalette(themeConfig.colors.accent)}` : ''}

${themeConfig.colors.neutral ? `### Neutral Colors\n${formatColorPalette(themeConfig.colors.neutral)}` : ''}

${themeConfig.typography ? `## Typography Scale\n${formatTypography(themeConfig.typography)}` : ''}

${themeConfig.spacing ? `## Spacing Scale\n${formatSpacing(themeConfig.spacing)}` : ''}

${includeConfig ? `## Tailwind Configuration\n\`\`\`javascript\n${tailwindConfig}\n\`\`\`` : ''}

## Usage Examples

### Primary Button
\`\`\`html
<button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-colors">
  Primary Action
</button>
\`\`\`

### Card Component
\`\`\`html
<div class="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
  <h3 class="text-xl font-semibold text-neutral-900 mb-2">Card Title</h3>
  <p class="text-neutral-600">Card content goes here...</p>
</div>
\`\`\`

### Accent Elements
\`\`\`html
<div class="bg-accent-50 border-l-4 border-accent-400 p-4">
  <p class="text-accent-700">Highlighted information</p>
</div>
\`\`\``
        }
      ]
    };
  } catch (error) {
    console.error('Theme creation error:', error);
    throw new Error(`Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateManualTheme(
  brandColor: string,
  style: string,
  colorCount: number,
  typography: boolean,
  spacing: boolean
): ThemeConfig {
  // Convert brand color to RGB for calculations
  const primaryColors = generateColorShades(brandColor, colorCount);
  
  const config: ThemeConfig = {
    colors: {
      primary: primaryColors,
      neutral: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827'
      }
    }
  };

  // Add typography if requested
  if (typography) {
    config.typography = {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times', 'serif'],
        mono: ['Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
      }
    };
  }

  // Add spacing if requested
  if (spacing) {
    config.spacing = {
      'xs': '0.5rem',
      'sm': '0.75rem',
      'md': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    };
  }

  return config;
}

function generateColorShades(baseColor: string, count: number): ColorShade {
  // This is a simplified color generation - in a real implementation,
  // you'd want to use a proper color manipulation library
  const shades: ColorShade = {};
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  levels.slice(0, count).forEach((level, index) => {
    // Simple approximation - in reality you'd use HSL/Lab color space
    const intensity = 1 - (index / (count - 1));
    shades[level.toString()] = adjustColorBrightness(baseColor, intensity);
  });
  
  return shades;
}

function adjustColorBrightness(color: string, factor: number): string {
  // Simplified color adjustment - this should be replaced with proper color library
  if (color.startsWith('#')) {
    return color; // Return as-is for now
  }
  return color;
}

function generateTailwindConfig(themeConfig: ThemeConfig): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(themeConfig.colors, null, 6)},
      ${themeConfig.typography ? `fontFamily: ${JSON.stringify(themeConfig.typography.fontFamily, null, 6)},
      fontSize: ${JSON.stringify(themeConfig.typography.fontSize, null, 6)},` : ''}
      ${themeConfig.spacing ? `spacing: ${JSON.stringify(themeConfig.spacing, null, 6)},` : ''}
    },
  },
  plugins: [],
}`;
}

function formatColorPalette(colors: ColorShade): string {
  return Object.entries(colors)
    .map(([shade, color]) => `- **${shade}**: \`${color}\``)
    .join('\n');
}

function formatTypography(typography: any): string {
  let output = '### Font Families\n';
  Object.entries(typography.fontFamily).forEach(([name, fonts]) => {
    output += `- **${name}**: ${(fonts as string[]).join(', ')}\n`;
  });
  
  output += '\n### Font Sizes\n';
  Object.entries(typography.fontSize).forEach(([name, config]) => {
    const [size, props] = config as [string, { lineHeight: string }];
    output += `- **${name}**: ${size} (line-height: ${props.lineHeight})\n`;
  });
  
  return output;
}

function formatSpacing(spacing: { [key: string]: string }): string {
  return Object.entries(spacing)
    .map(([name, value]) => `- **${name}**: \`${value}\``)
    .join('\n');
}
