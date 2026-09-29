// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://florianvdab.com',
  // English at /, Dutch at /nl/. Keep in sync with src/i18n/locales.ts.
  i18n: {
    locales: ['en', 'nl'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', nl: 'nl-BE' } },
    }),
  ],
  build: {
    // Keep all CSS in external files so the CSP can stay `style-src 'self'`.
    inlineStylesheets: 'never',
  },
});
