import { scrape } from '@/lib/scrape';
import { openai } from '@/lib/openai';
import { uploadFile } from '@/lib/upload';
import { estimateNutrition } from '@/lib/nutrition';

interface ParsedRecipe {
  title: string;
  description?: string;
  yield?: string;
  ingredients: string[];
  steps: string[];
  images?: string[];
  nutrition?: any;
}

export async function POST(req: Request) {
  const { url, image } = await req.json();
  if (!url && !image) {
    return Response.json({ error: 'Provide a url or image' }, { status: 400 });
  }

  let recipe: ParsedRecipe | null = null;

  if (url) {
    const html = await scrape(url);
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `Extract a recipe as JSON with fields title, description, yield, ingredients (array), steps (array) from the following HTML. Return only JSON.\n\n${html}`,
    });
    const text = (response as any).output_text || (response as any).choices?.[0]?.message?.content || '{}';
    try {
      recipe = JSON.parse(text);
    } catch {
      return Response.json({ error: 'Failed to parse recipe' }, { status: 500 });
    }
    recipe.images = [url];
  } else if (image) {
    const buffer = Buffer.from(image, 'base64');
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const upload = await uploadFile(`uploads/${Date.now()}.png`, arrayBuffer);
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: 'Extract recipe information as JSON.' },
            { type: 'input_image', image_url: `data:image/png;base64,${image}` },
          ],
        },
      ],
    });
    const text = (response as any).output_text || (response as any).choices?.[0]?.message?.content || '{}';
    try {
      recipe = JSON.parse(text);
    } catch {
      return Response.json({ error: 'Failed to parse recipe' }, { status: 500 });
    }
    recipe.images = [upload.url];
  }

  if (!recipe) {
    return Response.json({ error: 'Unable to parse recipe' }, { status: 500 });
  }

  recipe.nutrition = await estimateNutrition(recipe.ingredients);

  return Response.json({ ok: true, parsed: recipe });
}
