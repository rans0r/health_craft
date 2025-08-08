export async function POST(req: Request) {
  const { ingredients } = await req.json();
  if (!ingredients) {
    return Response.json({ error: 'Missing ingredients' }, { status: 400 });
  }
  return Response.json({ calories: 0, macros: { protein: 0, fat: 0, carbs: 0 } });
}
