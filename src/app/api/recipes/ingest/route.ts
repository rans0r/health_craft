export async function POST(req: Request) {
  const { source, data } = await req.json();
  if (!source || !data) {
    return Response.json({ error: 'Missing source or data' }, { status: 400 });
  }
  return Response.json({ id: 'recipe_stub', source });
}
