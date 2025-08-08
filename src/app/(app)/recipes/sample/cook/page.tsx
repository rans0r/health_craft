"use client";

import { CookingMode } from '@/components/cooking-mode';
import { useTranslations, useLocale } from 'next-intl';
import { convert, formatUnit } from '@/lib/units';

const steps = [
  'Gather ingredients.',
  'Preheat the oven to 180°C.',
  'Mix ingredients.',
  'Bake for 20 minutes.'
];

export default function SampleCookPage() {
  const t = useTranslations('cook');
  const locale = useLocale();
  const amount =
    locale === 'en'
      ? formatUnit(1, 'cup', locale)
      : formatUnit(convert(1, 'cup', 'ml'), 'ml', locale);
  return (
    <main className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-4 text-sm text-gray-600">{t('unitExample', { amount })}</p>
      <CookingMode steps={steps} />
    </main>
  );
}
