import { openai } from '@/lib/openai';
import { estimateNutrition } from '@/lib/nutrition';
import { autoTagRecipe } from '@/lib/tags';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!prompt) {
    return Response.json({ error: 'Missing prompt' }, { status: 400 });
  }

  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: `Generate a recipe in JSON format with fields title, description, yield, ingredients (array), steps (array) based on the following description. Return only JSON.\n\n${prompt}`,
  });
  const text = (response as any).output_text || (response as any).choices?.[0]?.message?.content || '{}';
  let recipe: any;
  try {
    recipe = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }

  recipe.nutrition = await estimateNutrition(recipe.ingredients || []);
  recipe.tags = autoTagRecipe(recipe);

  return Response.json({ recipe });
}
