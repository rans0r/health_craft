'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
      });
    }
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </PostHogProvider>
  );
}
