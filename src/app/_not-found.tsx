import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import Providers from './providers';
import { resolveLocale, loadMessages } from '@/i18n/server-utils';
import type { Locale } from '@/i18n/config';

async function getLocaleFromHeaders(): Promise<Locale> {
  const headerList = await headers();
  const requestedLocale = headerList.get('X-NEXT-INTL-LOCALE');

  return resolveLocale(requestedLocale);
}

export default async function NotFoundPage() {
  const locale = await getLocaleFromHeaders();
  setRequestLocale(locale);
  const messages = await loadMessages(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
              <h1 className="text-3xl font-semibold">Page not found</h1>
              <p className="max-w-md text-muted-foreground">
                The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
              </p>
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
