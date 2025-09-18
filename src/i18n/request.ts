import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './config';

type SupportedLocale = (typeof locales)[number];

async function loadMessages(locale: SupportedLocale) {
  const messages = await import(`../messages/${locale}.json`);
  return messages.default;
}

function resolveLocale(locale?: string): SupportedLocale {
  if (locale && locales.includes(locale as SupportedLocale)) {
    return locale as SupportedLocale;
  }
  return defaultLocale;
}

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = resolveLocale(locale);
  const messages = await loadMessages(resolvedLocale);

  return {
    locale: resolvedLocale,
    messages,
  };
});
