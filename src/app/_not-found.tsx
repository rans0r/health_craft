import { NextIntlClientProvider } from 'next-intl';
import { getLocale, setRequestLocale } from 'next-intl/server';

import Providers from './providers';
import { resolveLocale, loadMessages } from '@/i18n/server-utils';

export default async function NotFoundPage() {
  const requestedLocale = await getLocale();
  const locale = resolveLocale(requestedLocale);
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
