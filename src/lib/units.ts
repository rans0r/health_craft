export type Unit = 'g' | 'oz' | 'ml' | 'cup';

const GRAMS_PER_OUNCE = 28.3495;
const ML_PER_CUP = 240;

export function convert(value: number, from: Unit, to: Unit): number {
  if (from === to) return value;
  if (from === 'g' && to === 'oz') return value / GRAMS_PER_OUNCE;
  if (from === 'oz' && to === 'g') return value * GRAMS_PER_OUNCE;
  if (from === 'ml' && to === 'cup') return value / ML_PER_CUP;
  if (from === 'cup' && to === 'ml') return value * ML_PER_CUP;
  return value;
}

export function formatUnit(value: number, unit: Unit, locale: string) {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} ${unit}`;
}
