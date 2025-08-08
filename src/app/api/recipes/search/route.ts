import { prisma } from '@/lib/prisma';
import { createEmbedding } from '@/lib/embedding';

// Simple full-text and semantic search endpoint for recipes.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const tags = searchParams.getAll('tag');
  const semantic = searchParams.get('semantic');

  const where: any = {};
  if (q && !semantic) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (tags.length) {
    where.tags = { hasEvery: tags };
  }

  if (semantic && q) {
    const embedding = await createEmbedding(q);
    if (!embedding) {
      return Response.json({ recipes: [] });
    }
    const recipes = await prisma.$queryRawUnsafe(
      `SELECT id, title, description, tags FROM "Recipe" ORDER BY embedding <-> $1 LIMIT 20`,
      embedding,
    );
    return Response.json({ recipes });
  }

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, title: true, description: true, tags: true },
  });
  return Response.json({ recipes });
}
