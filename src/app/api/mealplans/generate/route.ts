import { trackEvent } from '@/lib/telemetry';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: Request) {
  try {
    const { week } = await req.json();
    if (!week) {
      return Response.json({ error: 'Missing week' }, { status: 400 });
    }
    const mealPlan = { week, days: [] };
    trackEvent('plan_generate', { week });
    return Response.json({ mealPlan });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
