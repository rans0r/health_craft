'use server';

import { prisma } from '@/lib/prisma';

export async function saveRecipe(title: string, description?: string) {
  return prisma.recipe.create({ data: { title, description } });
}
