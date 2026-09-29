// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://florianvdab.com',
  build: {
    // Keep all CSS in external files so the CSP can stay `style-src 'self'`.
    inlineStylesheets: 'never',
  },
});
