import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface ConvertRequest {
  code: string;
  format: 'css' | 'scss' | 'html';
  preserveCustom?: boolean;
  optimize?: boolean;
}

// CSS property to Tailwind class mapping
const CSS_TO_TAILWIND: Record<string, (value: string) => string | null> = {
  'display': (value) => {
    const map: Record<string, string> = {
      'block': 'block',
      'inline-block': 'inline-block',
      'inline': 'inline',
      'flex': 'flex',
      'inline-flex': 'inline-flex',
      'grid': 'grid',
      'inline-grid': 'inline-grid',
      'none': 'hidden'
    };
    return map[value] || null;
  },
  'padding': (value) => {
    const rem = parseFloat(value) / 16;
    if (rem === 0.25) return 'p-1';
    if (rem === 0.5) return 'p-2';
    if (rem === 0.75) return 'p-3';
    if (rem === 1) return 'p-4';
    if (rem === 1.25) return 'p-5';
    if (rem === 1.5) return 'p-6';
    if (rem === 2) return 'p-8';
    return null;
  },
  'margin': (value) => {
    const rem = parseFloat(value) / 16;
    if (rem === 0.25) return 'm-1';
    if (rem === 0.5) return 'm-2';
    if (rem === 0.75) return 'm-3';
    if (rem === 1) return 'm-4';
    if (rem === 1.25) return 'm-5';
    if (rem === 1.5) return 'm-6';
    if (rem === 2) return 'm-8';
    return null;
  },
  'color': (value) => {
    const colorMap: Record<string, string> = {
      '#000000': 'text-black',
      '#ffffff': 'text-white',
      '#ef4444': 'text-red-500',
      '#3b82f6': 'text-blue-500',
      '#10b981': 'text-green-500',
      '#f59e0b': 'text-yellow-500'
    };
    return colorMap[value.toLowerCase()] || null;
  },
  'background-color': (value) => {
    const colorMap: Record<string, string> = {
      '#000000': 'bg-black',
      '#ffffff': 'bg-white',
      '#ef4444': 'bg-red-500',
      '#3b82f6': 'bg-blue-500',
      '#10b981': 'bg-green-500',
      '#f59e0b': 'bg-yellow-500'
    };
    return colorMap[value.toLowerCase()] || null;
  },
  'font-weight': (value) => {
    const weightMap: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black'
    };
    return weightMap[value] || null;
  }
};

export async function convertToTailwind(args: ConvertRequest) {
  try {
    const {
      code,
      format,
      preserveCustom = false,
      optimize = true
    } = args;

    let convertedCode = '';
    let conversionNotes: string[] = [];
    let unconvertedStyles: string[] = [];

    if (isGeminiAvailable()) {
      // Use AI for advanced conversion
      const prompt = `Convert the following ${format.toUpperCase()} code to Tailwind CSS classes:

${code}

Requirements:
1. Convert all possible CSS properties to equivalent Tailwind classes
2. ${preserveCustom ? 'Preserve custom properties that cannot be converted as CSS custom properties' : 'Note any styles that cannot be converted to Tailwind'}
3. ${optimize ? 'Optimize the resulting classes for performance and readability' : ''}
4. Maintain the visual appearance exactly
5. Use modern Tailwind practices and utilities

Return a JSON response with:
{
  "convertedCode": "HTML/CSS with Tailwind classes",
  "conversionNotes": ["List of conversion notes and decisions made"],
  "unconvertedStyles": ["List of styles that couldn't be converted"],
  "suggestions": ["List of optimization suggestions"]
}

Focus on:
- Accurate class mapping
- Responsive design patterns
- Accessibility considerations
- Performance optimization
- Maintainable code structure`;

      const aiResponse = await callGemini(prompt);
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          convertedCode = result.convertedCode;
          conversionNotes = result.conversionNotes || [];
          unconvertedStyles = result.unconvertedStyles || [];
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        // Fallback to manual conversion
        const manualResult = performManualConversion(code, format);
        convertedCode = manualResult.code;
        conversionNotes = manualResult.notes;
        unconvertedStyles = manualResult.unconverted;
      }
    } else {
      // Manual conversion
      const manualResult = performManualConversion(code, format);
      convertedCode = manualResult.code;
      conversionNotes = manualResult.notes;
      unconvertedStyles = manualResult.unconverted;
    }

    return {
      content: [
        {
          type: 'text',
          text: `# CSS to Tailwind Conversion

## Converted Code
\`\`\`${format === 'html' ? 'html' : 'css'}
${convertedCode}
\`\`\`

## Conversion Summary
${conversionNotes.length > 0 ? conversionNotes.map(note => `- ${note}`).join('\n') : 'No specific conversion notes.'}

${unconvertedStyles.length > 0 ? `## Unconverted Styles
The following styles could not be converted to Tailwind classes:
${unconvertedStyles.map(style => `- \`${style}\``).join('\n')}

Consider using CSS custom properties or Tailwind plugins for these styles.` : ''}

## Usage Tips
- Test the converted code to ensure visual consistency
- Consider extracting repeated class patterns into components
- Use Tailwind's JIT mode for optimal performance
- Add responsive variants as needed (sm:, md:, lg:, xl:)`
        }
      ]
    };
  } catch (error) {
    console.error('CSS conversion error:', error);
    throw new Error(`Failed to convert CSS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function performManualConversion(code: string, format: string): {
  code: string;
  notes: string[];
  unconverted: string[];
} {
  const notes: string[] = [];
  const unconverted: string[] = [];
  let convertedCode = code;

  if (format === 'css') {
    // Extract CSS rules
    const ruleMatches = code.match(/([^{]+)\s*\{([^}]+)\}/g) || [];
    
    ruleMatches.forEach(rule => {
      const [, selector, properties] = rule.match(/([^{]+)\s*\{([^}]+)\}/) || [];
      
      if (selector && properties) {
        const tailwindClasses: string[] = [];
        const propertyLines = properties.split(';').filter(Boolean);
        
        propertyLines.forEach(prop => {
          const [property, value] = prop.split(':').map(s => s.trim());
          
          if (property && value) {
            const converter = CSS_TO_TAILWIND[property];
            if (converter) {
              const tailwindClass = converter(value);
              if (tailwindClass) {
                tailwindClasses.push(tailwindClass);
                notes.push(`Converted ${property}: ${value} → ${tailwindClass}`);
              } else {
                unconverted.push(`${property}: ${value}`);
              }
            } else {
              unconverted.push(`${property}: ${value}`);
            }
          }
        });
        
        if (tailwindClasses.length > 0) {
          const classString = tailwindClasses.join(' ');
          convertedCode = convertedCode.replace(rule, `/* ${selector.trim()} */\n/* Use these Tailwind classes: ${classString} */`);
        }
      }
    });
  } else if (format === 'html') {
    // Extract inline styles
    const styleMatches = code.match(/style="([^"]*)"/g) || [];
    
    styleMatches.forEach(styleAttr => {
      const styleContent = styleAttr.match(/style="([^"]*)"/)?.[1] || '';
      const tailwindClasses: string[] = [];
      
      const styles = styleContent.split(';').filter(Boolean);
      styles.forEach(style => {
        const [property, value] = style.split(':').map(s => s.trim());
        
        if (property && value) {
          const converter = CSS_TO_TAILWIND[property];
          if (converter) {
            const tailwindClass = converter(value);
            if (tailwindClass) {
              tailwindClasses.push(tailwindClass);
            } else {
              unconverted.push(`${property}: ${value}`);
            }
          } else {
            unconverted.push(`${property}: ${value}`);
          }
        }
      });
      
      if (tailwindClasses.length > 0) {
        const classString = tailwindClasses.join(' ');
        convertedCode = convertedCode.replace(styleAttr, `class="${classString}"`);
        notes.push(`Converted inline styles to: ${classString}`);
      }
    });
  }

  return { code: convertedCode, notes, unconverted };
}
