import './globals.css';
import type { ReactNode } from 'react';
import type { NextWebVitalsMetric } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, setRequestLocale } from 'next-intl/server';
import Providers from './providers';
import { resolveLocale, loadMessages } from '@/i18n/server-utils';

export const metadata = {
  title: 'Health Craft',
  description: 'AI-powered recipe book and meal planner',
  manifest: '/manifest.json',
  themeColor: '#1e90ff',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestedLocale = await getLocale();
  const locale = resolveLocale(requestedLocale);
  setRequestLocale(locale);
  const messages = await loadMessages(locale);
  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e90ff" />
      </head>
      <body className="min-h-screen bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (['CLS', 'FCP', 'LCP', 'INP'].includes(metric.name)) {
    console.log(metric);
  }
}
