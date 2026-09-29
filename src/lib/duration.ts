import type { Locale } from '../i18n/locales';

/** A `YYYY-MM` string, as used by the experience collection. */
export const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Months since year 0, so two values can be subtracted. */
export function monthIndex(value: string): number {
  if (!YEAR_MONTH.test(value)) throw new Error(`Expected YYYY-MM, got "${value}"`);
  const [year, month] = value.split('-').map(Number);
  return year! * 12 + (month! - 1);
}

/** The current month as `YYYY-MM` (UTC), used for roles without an end date. */
export function currentYearMonth(now: Date = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

const units: Record<Locale, { yr: [string, string]; mo: [string, string] }> = {
  en: { yr: ['yr', 'yrs'], mo: ['mo', 'mos'] },
  nl: { yr: ['jaar', 'jaar'], mo: ['maand', 'maanden'] },
};

/**
 * Human-readable length of a role, e.g. "1 yr 4 mos" / "1 jaar 4 maanden".
 * Counts both the start and end month (LinkedIn convention), so 2023-09 → 2023-09 is "1 mo".
 * A `null` end means the role is ongoing and runs until `now`.
 */
export function formatDuration(
  start: string,
  end: string | null,
  now: Date = new Date(),
  locale: Locale = 'en',
): string {
  const months = monthIndex(end ?? currentYearMonth(now)) - monthIndex(start) + 1;
  if (months < 1) throw new Error(`End (${end}) is before start (${start})`);

  const years = Math.floor(months / 12);
  const rest = months % 12;
  const { yr, mo } = units[locale];
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? yr[0] : yr[1]}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? mo[0] : mo[1]}`);
  return parts.join(' ');
}

const monthNames: Record<Locale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
};

/** "2025-06" → "Jun 2025" (en) / "jun 2025" (nl). */
export function formatYearMonth(value: string, locale: Locale = 'en'): string {
  const index = monthIndex(value);
  return `${monthNames[locale][index % 12]} ${Math.floor(index / 12)}`;
}
