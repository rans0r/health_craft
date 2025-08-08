export async function POST(req: Request) {
  const { url, image } = await req.json();
  if (!url && !image) {
    return Response.json({ error: 'Provide a url or image' }, { status: 400 });
  }
  return Response.json({ ok: true, parsed: { title: 'Example Recipe' } });
}
