import { estimateNutrition } from '@/lib/nutrition';

export async function POST(req: Request) {
  const { ingredients } = await req.json();
  if (!ingredients || !Array.isArray(ingredients)) {
    return Response.json({ error: 'Missing ingredients' }, { status: 400 });
  }

  const nutrition = await estimateNutrition(ingredients);
  return Response.json(nutrition);
}
