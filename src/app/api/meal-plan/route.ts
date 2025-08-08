import { generateMealPlan } from '@/lib/mealPlan';

export async function POST(req: Request) {
  const { constraints } = await req.json();
  if (typeof constraints !== 'string') {
    return Response.json({ error: 'Missing constraints' }, { status: 400 });
  }
  const plan = await generateMealPlan(constraints);
  return Response.json({ plan });
}
