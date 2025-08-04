import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export class GeminiHelper {
  private model: any;
  private genAI!: GoogleGenerativeAI; // Using definite assignment assertion
  
  constructor(config: GeminiConfig = {}) {
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found. AI features will be limited.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.model || 'gemini-pro',
      generationConfig: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxOutputTokens || 2048,
      }
    });
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.model) {
      return 'AI features require GEMINI_API_KEY environment variable.';
    }

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return `Error generating AI content: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  async analyzeDesign(html: string, options: {
    checkAccessibility?: boolean;
    checkPerformance?: boolean;
    checkResponsive?: boolean;
  } = {}): Promise<{
    overallScore: number;
    suggestions: string[];
    accessibilityScore: number;
    accessibilityIssues: string[];
    performanceScore: number;
    performanceOptimizations: string[];
    responsiveScore: number;
    responsiveIssues: string[];
  }> {
    const prompt = `Analyze this HTML design and provide detailed scores:

${html}

Analyze for:
- Accessibility: ${options.checkAccessibility !== false}
- Performance: ${options.checkPerformance !== false}
- Responsive: ${options.checkResponsive !== false}

Return JSON format:
{
  "overallScore": 85,
  "suggestions": ["improvement 1", "improvement 2"],
  "accessibilityScore": 90,
  "accessibilityIssues": ["issue 1", "issue 2"],
  "performanceScore": 80,
  "performanceOptimizations": ["optimization 1", "optimization 2"],
  "responsiveScore": 85,
  "responsiveIssues": ["issue 1", "issue 2"]
}`;

    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Return default values if parsing fails
      return {
        overallScore: 75,
        suggestions: ['Unable to analyze design'],
        accessibilityScore: 80,
        accessibilityIssues: [],
        performanceScore: 70,
        performanceOptimizations: [],
        responsiveScore: 85,
        responsiveIssues: []
      };
    }
  }

  async optimizeClasses(html: string): Promise<{
    optimized: string;
    suggestions: string[];
    removed: string[];
  }> {
    const prompt = `Analyze and optimize these Tailwind CSS classes:

HTML: ${html}

Please provide:
1. Optimized HTML with redundant classes removed
2. List of suggestions for better class usage
3. List of removed redundant classes
4. Alternative approaches using modern Tailwind features

Return in JSON format:
{
  "optimized": "optimized HTML",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "removed": ["removed class 1", "removed class 2"]
}`;

    try {
      const result = await this.generateContent(prompt);
      return JSON.parse(result);
    } catch (error) {
      return {
        optimized: html,
        suggestions: ['Error analyzing classes'],
        removed: []
      };
    }
  }

  async generateColorPalette(brandColor: string, style: string): Promise<{
    colors: Record<string, string>;
    css: string;
    tailwindConfig: string;
  }> {
    const prompt = `Generate a comprehensive color palette based on:

Brand Color: ${brandColor}
Style: ${style}

Create a palette with:
- Primary color variations (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
- Complementary secondary colors
- Neutral grays
- Success, warning, error colors
- Background and foreground colors suitable for dark/light themes

Return in JSON format:
{
  "colors": {
    "primary-50": "#...",
    "primary-100": "#...",
    // ... more colors
  },
  "css": "CSS custom properties for the colors",
  "tailwindConfig": "Tailwind config colors object"
}`;

    try {
      const result = await this.generateContent(prompt);
      return JSON.parse(result);
    } catch (error) {
      return {
        colors: { primary: brandColor },
        css: `:root { --primary: ${brandColor}; }`,
        tailwindConfig: `{ primary: "${brandColor}" }`
      };
    }
  }

  async convertCssToTailwind(css: string): Promise<{
    tailwind: string;
    notes: string[];
    unconverted: string[];
  }> {
    const prompt = `Convert this CSS to Tailwind CSS classes:

CSS: ${css}

Provide:
1. Equivalent Tailwind classes
2. Notes about the conversion
3. Properties that couldn't be converted

Return in JSON format:
{
  "tailwind": "converted tailwind classes",
  "notes": ["conversion note 1", "note 2"],
  "unconverted": ["property that couldn't be converted"]
}`;

    try {
      const result = await this.generateContent(prompt);
      return JSON.parse(result);
    } catch (error) {
      return {
        tailwind: '',
        notes: ['Error converting CSS'],
        unconverted: []
      };
    }
  }

  async suggestComponentImprovements(html: string, context: string): Promise<{
    improvements: string[];
    alternatives: string[];
    modernPatterns: string[];
  }> {
    const prompt = `Analyze this component and suggest improvements:

HTML: ${html}
Context: ${context}

Provide:
1. Specific improvements for better UX/accessibility
2. Alternative design approaches
3. Modern UI patterns that could be applied

Return in JSON format:
{
  "improvements": ["improvement 1", "improvement 2"],
  "alternatives": ["alternative approach 1", "approach 2"],
  "modernPatterns": ["pattern 1", "pattern 2"]
}`;

    try {
      const result = await this.generateContent(prompt);
      return JSON.parse(result);
    } catch (error) {
      return {
        improvements: ['Error analyzing component'],
        alternatives: [],
        modernPatterns: []
      };
    }
  }
}

export const geminiHelper = new GeminiHelper();
