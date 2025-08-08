import { openai } from './openai';

export interface NutritionEstimate {
  calories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

/**
 * Use OpenAI to estimate nutrition information for an ingredient list.
 * Falls back to zero values if the model response can't be parsed.
 */
export async function estimateNutrition(ingredients: string[]): Promise<NutritionEstimate> {
  const prompt = `Estimate total calories and macronutrients (protein, fat, carbs in grams) for the following ingredients: ${ingredients.join(
    ', '
  )}. Respond with JSON {"calories":number,"macros":{"protein":number,"fat":number,"carbs":number}}`;

  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
  });

  const text = (response as any).output_text || (response as any).choices?.[0]?.message?.content || '{}';

  try {
    return JSON.parse(text);
  } catch {
    return { calories: 0, macros: { protein: 0, fat: 0, carbs: 0 } };
  }
}
