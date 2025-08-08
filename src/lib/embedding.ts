import { openai } from './openai';

// Create an embedding buffer from text using OpenAI embeddings API.
export async function createEmbedding(text: string): Promise<Buffer | null> {
  try {
    const res = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    const array = new Float32Array(res.data[0].embedding);
    return Buffer.from(array.buffer);
  } catch (err) {
    console.error('embedding error', err);
    return null;
  }
}

export function recipeToEmbeddingText(recipe: {
  title?: string;
  description?: string;
  ingredients?: any[];
  tags?: string[];
}): string {
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((i) => i.name || '').join(' ')
    : '';
  return `${recipe.title ?? ''}\n${recipe.description ?? ''}\n${(recipe.tags || []).join(' ')}\n${ingredients}`;
}

export async function embedRecipe(recipe: {
  title?: string;
  description?: string;
  ingredients?: any[];
  tags?: string[];
}): Promise<Buffer | null> {
  const text = recipeToEmbeddingText(recipe);
  return createEmbedding(text);
}
