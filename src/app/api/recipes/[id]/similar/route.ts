import { prisma } from '@/lib/prisma';

// Return recipes semantically similar to the given recipe using pgvector.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
    select: { embedding: true },
  });
  if (!recipe || !recipe.embedding) {
    return Response.json({ recipes: [] });
  }

  const similar = await prisma.$queryRaw`
    SELECT id, title, description, tags
    FROM "Recipe"
    WHERE id <> ${params.id}
    ORDER BY embedding <-> ${recipe.embedding}
    LIMIT 10
  `;

  return Response.json({ recipes: similar });
}
