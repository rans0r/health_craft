import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { source, data, ownerId } = await req.json();
  if (!source || !data || !ownerId) {
    return Response.json({ error: 'Missing source, data, or ownerId' }, { status: 400 });
  }

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
      tags: data.tags || [],
      nutrition: data.nutrition,
      images: data.images || [],
      source: { type: source, url: data.sourceUrl },
    },
  });

  return Response.json({ id: recipe.id, source });
}
