import { prisma } from '@/lib/prisma';

// Set or update a user's rating for a recipe
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId, rating } = await req.json();
  if (!userId || typeof rating !== 'number') {
    return Response.json({ error: 'Missing userId or rating' }, { status: 400 });
  }

  await prisma.recipeRating.upsert({
    where: { userId_recipeId: { userId, recipeId: params.id } },
    update: { rating },
    create: { userId, recipeId: params.id, rating },
  });

  const aggregate = await prisma.recipeRating.aggregate({
    where: { recipeId: params.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return Response.json({
    ok: true,
    average: aggregate._avg.rating,
    count: aggregate._count.rating,
  });
}
