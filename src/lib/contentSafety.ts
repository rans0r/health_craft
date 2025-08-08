import { openai } from './openai';

export async function isContentSafe(text: string): Promise<boolean> {
  try {
    const res = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: text,
    });
    return !(res.results?.[0]?.flagged ?? false);
  } catch {
    return false;
  }
}
