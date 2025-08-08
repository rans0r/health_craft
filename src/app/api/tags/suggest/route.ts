export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text) {
    return Response.json({ error: 'Missing text' }, { status: 400 });
  }
  return Response.json({ tags: ['example', 'tags'] });
}
