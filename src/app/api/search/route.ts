export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return Response.json({ results: [] });
  }
  return Response.json({ query: q, results: [] });
}
