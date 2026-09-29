// Language-neutral site constants. Translatable text lives in src/i18n/ui.ts,
// jobs and projects in src/content/.
import { statSync } from 'node:fs';

const CV_FILE = 'CV-Florian.pdf';
/** Read at build time so the "(PDF, 151 KB)" label never goes stale. Build runs from the repo root. */
const cvKilobytes = Math.round(statSync(`public/${CV_FILE}`).size / 1024);

export const site = {
  name: 'Florian Vandenabeele',
  handle: 'Florianvdab',
  url: 'https://florianvdab.com',
  email: 'Florian.vdab@outlook.com',
  cv: { href: `/${CV_FILE}`, size: `${cvKilobytes} KB` },
  social: {
    github: 'https://github.com/Florianvdab',
    linkedin: 'https://www.linkedin.com/in/florianvdab/',
  },
} as const;
