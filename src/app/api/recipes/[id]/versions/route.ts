import { prisma } from '@/lib/prisma';

// Retrieve version history for a recipe
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const versions = await prisma.recipeVersion.findMany({
    where: { recipeId: params.id },
    orderBy: { version: 'desc' },
  });
  return Response.json({ versions });
}
