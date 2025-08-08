import { prisma } from '@/lib/prisma';
import { autoTagRecipe } from '@/lib/tags';
import { embedRecipe } from '@/lib/embedding';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
  if (!recipe) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json({ recipe });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const data = await req.json();
  const existing = await prisma.recipe.findUnique({ where: { id: params.id } });
  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.recipeVersion.create({
    data: {
      recipeId: existing.id,
      version: existing.version,
      data: existing,
    },
  });

  const merged = { ...existing, ...data };
  const tags = merged.tags && merged.tags.length ? merged.tags : autoTagRecipe(merged);
  const embedding = await embedRecipe({ ...merged, tags });

  const updated = await prisma.recipe.update({
    where: { id: params.id },
    data: { ...data, tags, embedding: embedding ?? undefined, version: existing.version + 1 },
  });
  return Response.json({ recipe: updated });
}
