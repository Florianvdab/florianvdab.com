export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** A piece of text in every locale. Content schemas require all of them. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Path of the home page for a locale: `/` for English, `/nl/` for Dutch. */
export function homePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

export const htmlLang: Record<Locale, string> = { en: 'en', nl: 'nl-BE' };
export const ogLocale: Record<Locale, string> = { en: 'en_GB', nl: 'nl_BE' };
