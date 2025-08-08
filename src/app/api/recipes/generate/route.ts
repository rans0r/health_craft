export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!prompt) {
    return Response.json({ error: 'Missing prompt' }, { status: 400 });
  }
  return Response.json({ recipe: { title: 'Generated Recipe', prompt } });
}
