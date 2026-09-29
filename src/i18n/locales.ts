export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];
/** Used when a visitor's browser states no preference (nginx redirects `/` by Accept-Language). */
export const defaultLocale: Locale = 'nl';

/** A piece of text in every locale. Content schemas require all of them. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Path of the home page for a locale: `/en/` or `/nl/`. `/` itself redirects per visitor. */
export function homePath(locale: Locale): string {
  return `/${locale}/`;
}

export const htmlLang: Record<Locale, string> = { en: 'en', nl: 'nl-BE' };
export const ogLocale: Record<Locale, string> = { en: 'en_GB', nl: 'nl_BE' };
