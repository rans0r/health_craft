import './globals.css';
import type { ReactNode } from 'react';
import type { NextWebVitalsMetric } from 'next/app';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Providers from './providers';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

async function loadMessages(locale: Locale) {
  const messages = await import(`@/messages/${locale}.json`);
  return messages.default;
}

function resolveLocale(locale?: string | null): Locale {
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

export const metadata = {
  title: 'Health Craft',
  description: 'AI-powered recipe book and meal planner',
  manifest: '/manifest.json',
  themeColor: '#1e90ff',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const requestedLocale = headersList.get('X-NEXT-INTL-LOCALE');
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
