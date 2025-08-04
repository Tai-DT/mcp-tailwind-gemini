import { callGemini, isGeminiAvailable } from '../utils/gemini.js';

interface OptimizeRequest {
  html: string;
  removeRedundant?: boolean;
  mergeConflicts?: boolean;
  suggestAlternatives?: boolean;
}

interface OptimizationResult {
  optimizedHtml: string;
  removedClasses: string[];
  conflictsResolved: string[];
  suggestions: string[];
  improvements: string[];
}

// Tailwind class conflict mapping
const CONFLICTING_CLASSES = {
  margin: ['m-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-'],
  padding: ['p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-'],
  width: ['w-'],
  height: ['h-'],
  display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden'],
  position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
  textAlign: ['text-left', 'text-center', 'text-right', 'text-justify'],
  fontSize: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'],
  fontWeight: ['font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'],
  borderRadius: ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full']
};

export async function optimizeClasses(args: OptimizeRequest) {
  try {
    const {
      html,
      removeRedundant = true,
      mergeConflicts = true,
      suggestAlternatives = true
    } = args;

    let result: OptimizationResult;

    if (isGeminiAvailable()) {
      // Use AI for advanced optimization
      const prompt = `Analyze and optimize the following HTML with Tailwind CSS classes:

${html}

Please perform the following optimizations:
1. ${removeRedundant ? 'Remove redundant and duplicate classes' : ''}
2. ${mergeConflicts ? 'Resolve conflicting classes (keep the most specific)' : ''}
3. ${suggestAlternatives ? 'Suggest better class alternatives for improved performance and maintainability' : ''}

Return a JSON response with the following structure:
{
  "optimizedHtml": "optimized HTML code",
  "removedClasses": ["list of removed classes"],
  "conflictsResolved": ["list of conflicts that were resolved"],
  "suggestions": ["list of improvement suggestions"],
  "improvements": ["list of specific improvements made"]
}

Focus on:
- Removing redundant spacing classes (e.g., p-4 px-4 py-4 → p-4)
- Resolving display conflicts (e.g., flex flex-row → flex)
- Suggesting utility combinations (e.g., multiple border classes → single class)
- Performance optimizations
- Accessibility improvements`;

      const aiResponse = await callGemini(prompt);
      
      try {
        // Extract JSON from AI response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        // Fallback to manual optimization if AI response parsing fails
        result = performManualOptimization(html, removeRedundant, mergeConflicts, suggestAlternatives);
      }
    } else {
      // Manual optimization
      result = performManualOptimization(html, removeRedundant, mergeConflicts, suggestAlternatives);
    }

    return {
      content: [
        {
          type: 'text',
          text: `# Tailwind CSS Class Optimization Results

## Optimized HTML
\`\`\`html
${result.optimizedHtml}
\`\`\`

## Changes Made

### Removed Classes
${result.removedClasses.length > 0 ? result.removedClasses.map(cls => `- \`${cls}\``).join('\n') : 'No redundant classes found'}

### Conflicts Resolved
${result.conflictsResolved.length > 0 ? result.conflictsResolved.map(conflict => `- ${conflict}`).join('\n') : 'No conflicts found'}

### Improvements Made
${result.improvements.length > 0 ? result.improvements.map(improvement => `- ${improvement}`).join('\n') : 'No specific improvements applied'}

### Suggestions
${result.suggestions.length > 0 ? result.suggestions.map(suggestion => `- ${suggestion}`).join('\n') : 'No additional suggestions'}`
        }
      ]
    };
  } catch (error) {
    console.error('Class optimization error:', error);
    throw new Error(`Failed to optimize classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function performManualOptimization(
  html: string,
  removeRedundant: boolean,
  mergeConflicts: boolean,
  suggestAlternatives: boolean
): OptimizationResult {
  const result: OptimizationResult = {
    optimizedHtml: html,
    removedClasses: [],
    conflictsResolved: [],
    suggestions: [],
    improvements: []
  };

  // Extract all class attributes
  const classMatches = html.match(/class="([^"]*)"/g) || [];
  
  classMatches.forEach(classAttr => {
    const classContent = classAttr.match(/class="([^"]*)"/)?.[1] || '';
    const classes = classContent.split(/\s+/).filter(Boolean);
    
    let optimizedClasses = [...classes];

    if (removeRedundant) {
      // Remove duplicates
      const uniqueClasses = [...new Set(optimizedClasses)];
      const duplicates = optimizedClasses.filter(cls => optimizedClasses.indexOf(cls) !== optimizedClasses.lastIndexOf(cls));
      result.removedClasses.push(...duplicates);
      optimizedClasses = uniqueClasses;

      // Remove redundant spacing classes
      const redundantRemoved = removeRedundantSpacing(optimizedClasses);
      result.removedClasses.push(...redundantRemoved.removed);
      optimizedClasses = redundantRemoved.classes;
    }

    if (mergeConflicts) {
      const conflictResolution = resolveConflicts(optimizedClasses);
      result.conflictsResolved.push(...conflictResolution.conflicts);
      optimizedClasses = conflictResolution.classes;
    }

    if (suggestAlternatives) {
      result.suggestions.push(...generateSuggestions(optimizedClasses));
    }

    // Replace in HTML
    const optimizedClassAttr = `class="${optimizedClasses.join(' ')}"`;
    result.optimizedHtml = result.optimizedHtml.replace(classAttr, optimizedClassAttr);
  });

  return result;
}

function removeRedundantSpacing(classes: string[]): { classes: string[], removed: string[] } {
  const removed: string[] = [];
  let optimized = [...classes];

  // Check for redundant padding/margin combinations
  const paddingClasses = classes.filter(cls => cls.startsWith('p-') || cls.startsWith('px-') || cls.startsWith('py-') || cls.startsWith('pt-') || cls.startsWith('pr-') || cls.startsWith('pb-') || cls.startsWith('pl-'));
  
  if (paddingClasses.length > 1) {
    // If we have p-X and px-X/py-X, remove the specific ones
    const generalPadding = paddingClasses.find(cls => cls.match(/^p-\d+$/));
    if (generalPadding) {
      const specificToRemove = paddingClasses.filter(cls => cls.startsWith('px-') || cls.startsWith('py-'));
      removed.push(...specificToRemove);
      optimized = optimized.filter(cls => !specificToRemove.includes(cls));
    }
  }

  return { classes: optimized, removed };
}

function resolveConflicts(classes: string[]): { classes: string[], conflicts: string[] } {
  const conflicts: string[] = [];
  let optimized = [...classes];

  Object.entries(CONFLICTING_CLASSES).forEach(([category, prefixes]) => {
    const matchingClasses = classes.filter(cls => 
      prefixes.some(prefix => cls.startsWith(prefix) || prefixes.includes(cls))
    );

    if (matchingClasses.length > 1) {
      // Keep the last one (most specific or last declared)
      const toRemove = matchingClasses.slice(0, -1);
      conflicts.push(`${category}: resolved conflict between ${matchingClasses.join(', ')} - kept ${matchingClasses[matchingClasses.length - 1]}`);
      optimized = optimized.filter(cls => !toRemove.includes(cls));
    }
  });

  return { classes: optimized, conflicts };
}

function generateSuggestions(classes: string[]): string[] {
  const suggestions: string[] = [];

  // Check for common optimization opportunities
  if (classes.includes('flex') && classes.includes('flex-row')) {
    suggestions.push('Remove `flex-row` as it\'s the default for flex containers');
  }

  if (classes.some(cls => cls.startsWith('border-')) && classes.filter(cls => cls.startsWith('border-')).length > 3) {
    suggestions.push('Consider using fewer border utilities or a custom border class');
  }

  if (classes.filter(cls => cls.startsWith('text-')).length > 2) {
    suggestions.push('Consider consolidating text utilities into a custom text class');
  }

  return suggestions;
}
