export async function POST(req: Request) {
  const { week } = await req.json();
  if (!week) {
    return Response.json({ error: 'Missing week' }, { status: 400 });
  }
  return Response.json({ mealPlan: { week, days: [] } });
}
