import type { Recipe } from '@prisma/client';

// Naive tag generator based on recipe content. In a real application
// this would use an AI model or more advanced NLP.
export function autoTagRecipe(recipe: {
  title?: string;
  ingredients?: any[];
  steps?: any[];
}): string[] {
  const text = `${recipe.title ?? ''} ` +
    `${(recipe.ingredients || []).map(i => i.name || '').join(' ')} ` +
    `${(recipe.steps || []).join(' ')}`.toLowerCase();

  const tags = new Set<string>();

  const cuisines: Record<string, RegExp> = {
    mexican: /taco|quesadilla|enchilada|salsa/, 
    italian: /pasta|risotto|spaghetti|lasagna/, 
    indian: /curry|masala|paneer|tikka/, 
    chinese: /noodle|dumpling|szechuan|fried rice/,
  };

  for (const [tag, regex] of Object.entries(cuisines)) {
    if (regex.test(text)) tags.add(tag);
  }

  if (/salad|lettuce|spinach|kale/.test(text)) tags.add('salad');
  if (/cake|cookie|dessert|brownie|pie/.test(text)) tags.add('dessert');
  if (/chicken|beef|pork|fish|shrimp/.test(text)) tags.add('protein');
  if (!/(beef|pork|chicken|fish|shrimp)/.test(text)) tags.add('vegetarian');

  return Array.from(tags);
}
