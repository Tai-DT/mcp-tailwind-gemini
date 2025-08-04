import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface AnalyzeRequest {
  html: string;
  css?: string;
  context?: string;
  checkAccessibility?: boolean;
  checkResponsive?: boolean;
  checkPerformance?: boolean;
}

export async function analyzeDesign(args: AnalyzeRequest) {
  try {
    const {
      html,
      css = '',
      context = '',
      checkAccessibility = true,
      checkResponsive = true,
      checkPerformance = true
    } = args;

    if (isGeminiAvailable()) {
      const prompt = `Analyze this HTML/CSS code for design quality, best practices, and improvements:

HTML:
${html}

${css ? `CSS:\n${css}` : ''}

${context ? `Context: ${context}` : ''}

Please provide a comprehensive analysis covering:

${checkAccessibility ? '1. **Accessibility**: Check for ARIA labels, semantic HTML, color contrast, keyboard navigation, screen reader compatibility' : ''}
${checkResponsive ? '2. **Responsive Design**: Evaluate mobile-first approach, breakpoints, flexible layouts' : ''}
${checkPerformance ? '3. **Performance**: Analyze CSS efficiency, bundle size implications, render performance' : ''}
4. **Design Quality**: Visual hierarchy, spacing consistency, typography, color usage
5. **Code Quality**: Tailwind best practices, maintainability, reusability
6. **UX Considerations**: Usability, interaction patterns, user flow

For each area, provide:
- Current state assessment (Good/Needs Improvement/Poor)
- Specific issues found
- Actionable recommendations
- Code examples for improvements

Format as structured markdown with clear sections.`;

      const analysis = await callGemini(prompt);

      return {
        content: [
          {
            type: 'text',
            text: `# Design Analysis Report\n\n${analysis}`
          }
        ]
      };
    } else {
      // Fallback manual analysis
      const manualAnalysis = performManualAnalysis(html, css, checkAccessibility, checkResponsive, checkPerformance);
      
      return {
        content: [
          {
            type: 'text',
            text: manualAnalysis
          }
        ]
      };
    }
  } catch (error) {
    console.error('Design analysis error:', error);
    throw new Error(`Failed to analyze design: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function performManualAnalysis(
  html: string,
  css: string,
  checkAccessibility: boolean,
  checkResponsive: boolean,
  checkPerformance: boolean
): string {
  let analysis = '# Design Analysis Report\n\n';

  // Basic HTML structure analysis
  const hasSemanticElements = /(<main|<header|<nav|<section|<article|<aside|<footer)/.test(html);
  const hasHeadings = /<h[1-6]/.test(html);
  const hasImages = /<img/.test(html);
  const hasButtons = /<button/.test(html);
  const hasLinks = /<a/.test(html);

  analysis += '## Structure Analysis\n\n';
  analysis += `- **Semantic HTML**: ${hasSemanticElements ? '✅ Good' : '❌ Missing semantic elements'}\n`;
  analysis += `- **Heading Structure**: ${hasHeadings ? '✅ Present' : '❌ No headings found'}\n`;
  analysis += `- **Interactive Elements**: ${hasButtons || hasLinks ? '✅ Present' : '❌ No interactive elements'}\n\n`;

  if (checkAccessibility) {
    analysis += '## Accessibility Analysis\n\n';
    
    const hasAltText = hasImages ? /alt=/.test(html) : true;
    const hasAriaLabels = /aria-label/.test(html);
    const hasRoles = /role=/.test(html);
    
    analysis += `- **Image Alt Text**: ${hasAltText ? '✅ Present' : '❌ Missing alt attributes'}\n`;
    analysis += `- **ARIA Labels**: ${hasAriaLabels ? '✅ Present' : '⚠️ Consider adding ARIA labels'}\n`;
    analysis += `- **Semantic Roles**: ${hasRoles ? '✅ Present' : '⚠️ Consider adding ARIA roles'}\n\n`;
    
    if (!hasAltText) {
      analysis += '**Recommendation**: Add descriptive alt text to all images for screen readers.\n\n';
    }
  }

  if (checkResponsive) {
    analysis += '## Responsive Design Analysis\n\n';
    
    const hasResponsiveClasses = /(sm:|md:|lg:|xl:)/.test(html);
    const hasFlexGrid = /(flex|grid)/.test(html);
    const hasResponsiveSpacing = /(sm:p-|md:p-|lg:p-|sm:m-|md:m-|lg:m-)/.test(html);
    
    analysis += `- **Responsive Classes**: ${hasResponsiveClasses ? '✅ Present' : '❌ No responsive breakpoints found'}\n`;
    analysis += `- **Flexible Layouts**: ${hasFlexGrid ? '✅ Using Flexbox/Grid' : '⚠️ Consider flexible layouts'}\n`;
    analysis += `- **Responsive Spacing**: ${hasResponsiveSpacing ? '✅ Present' : '⚠️ Consider responsive spacing'}\n\n`;
    
    if (!hasResponsiveClasses) {
      analysis += '**Recommendation**: Add responsive breakpoint classes (sm:, md:, lg:, xl:) for better mobile experience.\n\n';
    }
  }

  if (checkPerformance) {
    analysis += '## Performance Analysis\n\n';
    
    const classCount = (html.match(/class="[^"]*"/g) || []).reduce((total, match) => {
      return total + match.split(' ').length;
    }, 0);
    
    const hasLargeClasses = classCount > 50;
    const hasDuplicateClasses = /(\w+-\w+).*\1/.test(html.replace(/\s+/g, ' '));
    
    analysis += `- **Class Count**: ${classCount} classes total ${hasLargeClasses ? '⚠️ Consider optimization' : '✅ Reasonable'}\n`;
    analysis += `- **Duplicate Classes**: ${hasDuplicateClasses ? '❌ Found duplicates' : '✅ No obvious duplicates'}\n\n`;
    
    if (hasLargeClasses) {
      analysis += '**Recommendation**: Consider extracting common class patterns into reusable components.\n\n';
    }
  }

  analysis += '## General Recommendations\n\n';
  analysis += '- Use semantic HTML elements for better structure and accessibility\n';
  analysis += '- Implement a consistent design system with defined spacing and colors\n';
  analysis += '- Test on multiple devices and screen sizes\n';
  analysis += '- Consider component extraction for reusable patterns\n';
  analysis += '- Validate HTML and run accessibility audits\n';

  return analysis;
}
