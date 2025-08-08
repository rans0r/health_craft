import { prisma } from '@/lib/prisma';

// Toggle favorite status for a recipe
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId, favorite } = await req.json();
  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 });
  }

  if (favorite) {
    await prisma.recipeFavorite.upsert({
      where: { userId_recipeId: { userId, recipeId: params.id } },
      update: {},
      create: { userId, recipeId: params.id },
    });
  } else {
    await prisma.recipeFavorite.deleteMany({
      where: { userId, recipeId: params.id },
    });
  }

  return Response.json({ ok: true });
}
