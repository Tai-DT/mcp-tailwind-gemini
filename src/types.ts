// Shared type definitions for MCP Tailwind Gemini Server

// Component Generator Types
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

// Class Optimizer Types  
export interface ClassOptimizationOptions {
  classes: string;
  context?: 'component' | 'layout' | 'utility' | 'responsive';
  removeRedundant?: boolean;
  sortClasses?: boolean;
  suggestAlternatives?: boolean;
  checkConflicts?: boolean;
  framework?: 'tailwind' | 'unocss' | 'windicss';
}

// Theme Creator Types
export interface ThemeCreationOptions {
  name: string;
  style: 'modern' | 'classic' | 'minimal' | 'vibrant' | 'dark' | 'corporate' | 'creative' | 'custom';
  primaryColor?: string;
  accentColor?: string;
  baseColors?: 'neutral' | 'warm' | 'cool' | 'custom';
  typography?: 'sans' | 'serif' | 'mono' | 'custom';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadows?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  generateVariants?: boolean;
  includeDarkMode?: boolean;
  accessibility?: boolean;
  framework?: 'tailwind' | 'css-variables' | 'scss' | 'both';
}

// Design Analyzer Types
export interface DesignAnalysisOptions {
  html: string;
  context?: 'landing-page' | 'dashboard' | 'component' | 'form' | 'navigation' | 'layout' | 'general';
  checkAccessibility?: boolean;
  checkResponsive?: boolean;
  checkPerformance?: boolean;
  checkUsability?: boolean;
  checkBrandConsistency?: boolean;
  framework?: 'react' | 'vue' | 'svelte' | 'html';
  designSystem?: string;
}

// Preview Generator Types
export interface PreviewOptions {
  html: string;
  css?: string;
  devices?: ('mobile' | 'tablet' | 'desktop' | 'wide')[];
  theme?: 'light' | 'dark' | 'auto';
  interactive?: boolean;
  showCode?: boolean;
  format?: 'html' | 'image' | 'pdf';
  quality?: 'low' | 'medium' | 'high';
}

// CSS Converter Types
export interface ConversionOptions {
  css: string;
  source?: 'css' | 'scss' | 'less' | 'stylus';
  target?: 'tailwind' | 'utility-first';
  framework?: 'tailwind' | 'unocss' | 'windicss';
  optimization?: 'none' | 'basic' | 'aggressive';
  preserveComments?: boolean;
  generateVariables?: boolean;
}

// AI Suggestions Types
export interface SuggestionOptions {
  html: string;
  context?: 'landing-page' | 'dashboard' | 'component' | 'form' | 'navigation';
  focus?: 'accessibility' | 'performance' | 'design' | 'ux' | 'seo' | 'all';
  priority?: 'critical' | 'important' | 'nice-to-have' | 'all';
  framework?: 'react' | 'vue' | 'svelte' | 'html';
  targetAudience?: string;
  businessGoals?: string[];
}

// Layout Generator Types
export interface LayoutOptions {
  type: 'landing' | 'dashboard' | 'blog' | 'ecommerce' | 'portfolio' | 'admin' | 'custom';
  framework: 'html' | 'react' | 'vue' | 'svelte';
  components?: string[];
  sections?: string[];
  responsive?: boolean;
  darkMode?: boolean;
  accessibility?: boolean;
  animations?: boolean;
}

// shadcn Integration Types
export interface ShadcnComponentRequest {
  componentName: string;
  framework?: 'react' | 'svelte';
  variant?: string;
  includeDemo?: boolean;
  customization?: Record<string, any>;
}

// Project Generator Types
export interface ProjectGenerationOptions {
  projectName: string;
  framework: 'react' | 'vue' | 'svelte' | 'next' | 'nuxt' | 'vite';
  template?: 'basic' | 'dashboard' | 'landing' | 'blog' | 'ecommerce' | 'portfolio';
  components?: string[];
  features?: string[];
  styling?: 'tailwind' | 'scss' | 'css-modules';
  typescript?: boolean;
  testing?: boolean;
  linting?: boolean;
}
