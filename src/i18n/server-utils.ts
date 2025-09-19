import { defaultLocale, locales, type Locale } from './config';

export async function loadMessages(locale: Locale) {
  const messages = await import(`@/messages/${locale}.json`);
  return messages.default;
}

export function resolveLocale(locale?: string | null): Locale {
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return defaultLocale;
}
