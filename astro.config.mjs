// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://florianvdab.com',
  // Dutch at /nl/, English at /en/; nginx redirects / per visitor. Keep in sync with src/i18n/locales.ts.
  i18n: {
    locales: ['en', 'nl'],
    defaultLocale: 'nl',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // `/` is only a redirect, so list just the two real pages.
      filter: (page) => page !== 'https://florianvdab.com/',
      i18n: { defaultLocale: 'nl', locales: { nl: 'nl-BE', en: 'en' } },
    }),
  ],
  build: {
    // Keep all CSS in external files so the CSP can stay `style-src 'self'`.
    inlineStylesheets: 'never',
  },
});
