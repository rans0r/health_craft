import { PostHog } from 'posthog-node';

const client = process.env.POSTHOG_API_KEY
  ? new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST,
    })
  : null;

export function trackEvent(event: string, properties?: Record<string, any>) {
  client?.capture({
    distinctId: properties?.distinctId || 'server',
    event,
    properties,
  });
}
