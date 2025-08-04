import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface SuggestionsRequest {
  html: string;
  context?: string;
  targetAudience?: string;
  focusAreas?: ('accessibility' | 'performance' | 'ux' | 'aesthetics' | 'responsiveness')[];
}

export async function suggestImprovements(args: SuggestionsRequest) {
  try {
    const {
      html,
      context = '',
      targetAudience = '',
      focusAreas = ['accessibility', 'performance', 'ux', 'aesthetics', 'responsiveness']
    } = args;

    if (isGeminiAvailable()) {
      const prompt = `Analyze this HTML code and provide intelligent design improvement suggestions:

HTML Code:
${html}

${context ? `Context: ${context}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Focus Areas: ${focusAreas.join(', ')}

Please provide detailed, actionable suggestions for improvement in the following areas:

${focusAreas.includes('accessibility') ? '**Accessibility**: WCAG compliance, screen reader support, keyboard navigation, color contrast, semantic HTML' : ''}
${focusAreas.includes('performance') ? '**Performance**: CSS optimization, bundle size, render performance, Core Web Vitals' : ''}
${focusAreas.includes('ux') ? '**User Experience**: Usability, interaction patterns, user flow, intuitive design' : ''}
${focusAreas.includes('aesthetics') ? '**Visual Design**: Typography, color harmony, spacing, visual hierarchy, modern design trends' : ''}
${focusAreas.includes('responsiveness') ? '**Responsive Design**: Mobile-first approach, breakpoint strategy, cross-device compatibility' : ''}

For each suggestion, provide:
1. Current issue or opportunity
2. Specific recommendation
3. Implementation details with Tailwind classes
4. Expected impact/benefit
5. Priority level (High/Medium/Low)

Format as structured markdown with clear sections and actionable code examples.`;

      const suggestions = await callGemini(prompt);

      return {
        content: [
          {
            type: 'text',
            text: `# AI-Powered Design Improvement Suggestions\n\n${suggestions}`
          }
        ]
      };
    } else {
      // Fallback manual suggestions
      const manualSuggestions = generateManualSuggestions(html, focusAreas);
      
      return {
        content: [
          {
            type: 'text',
            text: manualSuggestions
          }
        ]
      };
    }
  } catch (error) {
    console.error('Suggestions error:', error);
    throw new Error(`Failed to generate suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateManualSuggestions(html: string, focusAreas: string[]): string {
  let suggestions = '# Design Improvement Suggestions\n\n';

  if (focusAreas.includes('accessibility')) {
    suggestions += '## Accessibility Improvements\n\n';
    
    // Check for common accessibility issues
    if (!/<main/.test(html)) {
      suggestions += '### Add Main Landmark\n';
      suggestions += '**Issue**: No main landmark found\n';
      suggestions += '**Recommendation**: Wrap main content in `<main>` element\n';
      suggestions += '**Priority**: High\n\n';
      suggestions += '```html\n<main class="...">\n  <!-- Main content -->\n</main>\n```\n\n';
    }
    
    if (/<img/.test(html) && !/alt=/.test(html)) {
      suggestions += '### Add Image Alt Text\n';
      suggestions += '**Issue**: Images without alt text found\n';
      suggestions += '**Recommendation**: Add descriptive alt attributes\n';
      suggestions += '**Priority**: High\n\n';
      suggestions += '```html\n<img src="..." alt="Descriptive text" class="...">\n```\n\n';
    }
    
    if (!(/aria-/.test(html))) {
      suggestions += '### Enhance ARIA Support\n';
      suggestions += '**Issue**: Limited ARIA attributes\n';
      suggestions += '**Recommendation**: Add ARIA labels and roles where appropriate\n';
      suggestions += '**Priority**: Medium\n\n';
    }
  }

  if (focusAreas.includes('responsiveness')) {
    suggestions += '## Responsive Design Improvements\n\n';
    
    if (!(/(sm:|md:|lg:|xl:)/.test(html))) {
      suggestions += '### Add Responsive Breakpoints\n';
      suggestions += '**Issue**: No responsive classes detected\n';
      suggestions += '**Recommendation**: Add breakpoint-specific classes\n';
      suggestions += '**Priority**: High\n\n';
      suggestions += '```html\n<!-- Example: -->\n<div class="text-sm md:text-base lg:text-lg">\n  Responsive text\n</div>\n```\n\n';
    }
    
    if (!/flex|grid/.test(html)) {
      suggestions += '### Implement Flexible Layouts\n';
      suggestions += '**Issue**: Static layout detected\n';
      suggestions += '**Recommendation**: Use Flexbox or Grid for flexible layouts\n';
      suggestions += '**Priority**: Medium\n\n';
      suggestions += '```html\n<div class="flex flex-col md:flex-row gap-4">\n  <!-- Flexible layout -->\n</div>\n```\n\n';
    }
  }

  if (focusAreas.includes('performance')) {
    suggestions += '## Performance Optimizations\n\n';
    
    const classCount = (html.match(/class="[^"]*"/g) || []).reduce((total, match) => {
      return total + match.split(' ').length;
    }, 0);
    
    if (classCount > 30) {
      suggestions += '### Optimize Class Usage\n';
      suggestions += `**Issue**: High class count detected (${classCount} classes)\n`;
      suggestions += '**Recommendation**: Extract common patterns into components\n';
      suggestions += '**Priority**: Medium\n\n';
      suggestions += '```javascript\n// Create reusable component\nconst Button = ({ children, variant = "primary" }) => {\n  const baseClasses = "px-4 py-2 rounded transition-colors";\n  const variantClasses = variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200";\n  return <button className={`${baseClasses} ${variantClasses}`}>{children}</button>;\n};\n```\n\n';
    }
  }

  if (focusAreas.includes('aesthetics')) {
    suggestions += '## Visual Design Enhancements\n\n';
    
    if (!(/shadow/.test(html))) {
      suggestions += '### Add Visual Depth\n';
      suggestions += '**Issue**: No shadows or depth indicators\n';
      suggestions += '**Recommendation**: Add subtle shadows for visual hierarchy\n';
      suggestions += '**Priority**: Low\n\n';
      suggestions += '```html\n<div class="shadow-sm hover:shadow-md transition-shadow">\n  <!-- Card with subtle shadow -->\n</div>\n```\n\n';
    }
    
    if (!(/transition/.test(html))) {
      suggestions += '### Add Smooth Interactions\n';
      suggestions += '**Issue**: No transitions detected\n';
      suggestions += '**Recommendation**: Add transitions for better user experience\n';
      suggestions += '**Priority**: Medium\n\n';
      suggestions += '```html\n<button class="bg-blue-500 hover:bg-blue-600 transition-colors duration-200">\n  Interactive button\n</button>\n```\n\n';
    }
  }

  if (focusAreas.includes('ux')) {
    suggestions += '## User Experience Improvements\n\n';
    
    if (/<button/.test(html) && !(/hover:/.test(html))) {
      suggestions += '### Enhance Interactive States\n';
      suggestions += '**Issue**: Buttons without hover states\n';
      suggestions += '**Recommendation**: Add hover and focus states\n';
      suggestions += '**Priority**: Medium\n\n';
      suggestions += '```html\n<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none">\n  Accessible button\n</button>\n```\n\n';
    }
    
    if (!(/focus:/.test(html))) {
      suggestions += '### Improve Keyboard Navigation\n';
      suggestions += '**Issue**: Limited focus states\n';
      suggestions += '**Recommendation**: Add visible focus indicators\n';
      suggestions += '**Priority**: High\n\n';
      suggestions += '```html\n<a href="#" class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">\n  Accessible link\n</a>\n```\n\n';
    }
  }

  suggestions += '## Implementation Priority\n\n';
  suggestions += '1. **High Priority**: Accessibility and core functionality issues\n';
  suggestions += '2. **Medium Priority**: User experience and responsive design\n';
  suggestions += '3. **Low Priority**: Visual enhancements and performance optimizations\n\n';
  
  suggestions += '## Next Steps\n\n';
  suggestions += '- Implement high-priority suggestions first\n';
  suggestions += '- Test changes across different devices and browsers\n';
  suggestions += '- Run accessibility audits using tools like axe or Lighthouse\n';
  suggestions += '- Consider user testing for UX improvements\n';

  return suggestions;
}
