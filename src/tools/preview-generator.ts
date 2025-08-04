import puppeteer from 'puppeteer';
import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface PreviewRequest {
  html: string;
  width?: number;
  height?: number;
  darkMode?: boolean;
  responsive?: boolean;
}

export async function generatePreview(args: PreviewRequest) {
  try {
    const {
      html,
      width = 800,
      height = 600,
      darkMode = false,
      responsive = false
    } = args;

    // Create full HTML document
    const fullHtml = `
<!DOCTYPE html>
<html lang="en" ${darkMode ? 'class="dark"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${darkMode ? '<script>tailwind.config = { darkMode: "class" }</script>' : ''}
</head>
<body class="${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-white'}">
  ${html}
</body>
</html>`;

    let result = '# Component Preview\n\n';
    
    try {
      // Launch headless browser for screenshot
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setViewport({ width, height });
      await page.setContent(fullHtml);
      
      // Take screenshot
      const screenshot = await page.screenshot({ 
        encoding: 'base64',
        fullPage: false 
      });
      
      await browser.close();
      
      result += `**Preview Generated**: ${width}x${height}px ${darkMode ? '(Dark Mode)' : '(Light Mode)'}\n\n`;
      result += `![Component Preview](data:image/png;base64,${screenshot})\n\n`;
      
    } catch (screenshotError) {
      console.error('Screenshot error:', screenshotError);
      result += '**Note**: Preview screenshot could not be generated. Here\'s the rendered HTML:\n\n';
    }

    result += '## HTML Code\n```html\n' + html + '\n```\n\n';
    
    if (responsive) {
      result += '## Responsive Breakpoints\n\n';
      result += '- **Mobile**: 375px width\n';
      result += '- **Tablet**: 768px width\n';
      result += '- **Desktop**: 1024px width\n';
      result += '- **Large**: 1280px width\n\n';
      result += '*Note: Test your component at different screen sizes to ensure responsive behavior.*\n';
    }

    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    };
  } catch (error) {
    console.error('Preview generation error:', error);
    throw new Error(`Failed to generate preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
