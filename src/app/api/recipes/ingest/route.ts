import { prisma } from '@/lib/prisma';
import { autoTagRecipe } from '@/lib/tags';
import { embedRecipe } from '@/lib/embedding';

export async function POST(req: Request) {
  const { source, data, ownerId } = await req.json();
  if (!source || !data || !ownerId) {
    return Response.json({ error: 'Missing source, data, or ownerId' }, { status: 400 });
  }

  const tags = data.tags && data.tags.length ? data.tags : autoTagRecipe(data);
  const embedding = await embedRecipe({ ...data, tags });

  const recipe = await prisma.recipe.create({
    data: {
      ownerId,
      title: data.title,
      description: data.description,
      yield: data.yield,
      prepMinutes: data.prepMinutes,
      cookMinutes: data.cookMinutes,
      totalMinutes: data.totalMinutes,
      ingredients: data.ingredients,
      steps: data.steps,
      equipment: data.equipment || [],
      tags,
      nutrition: data.nutrition,
      images: data.images || [],
      source: { type: source, url: data.sourceUrl },
      embedding: embedding ?? undefined,
    },
  });

  return Response.json({ id: recipe.id, source });
}
