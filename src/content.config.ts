import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { YEAR_MONTH, monthIndex } from './lib/duration';

const yearMonth = z.string().regex(YEAR_MONTH, 'Use YYYY-MM, e.g. "2025-06"');
const nonEmpty = z.string().min(1);

/** Text that must be translated: `{ en: "...", nl: "..." }`. */
const localized = z.strictObject({ en: nonEmpty, nl: nonEmpty });
/** Text that may be the same in every language (names, cities): a plain string or `{ en, nl }`. */
const text = z.union([nonEmpty, localized]);
/** Translated bullet lists; both languages must have the same number of items. */
const localizedList = z
  .strictObject({ en: z.array(nonEmpty), nl: z.array(nonEmpty) })
  .refine((list) => list.en.length === list.nl.length, {
    message: '"en" and "nl" must have the same number of items',
  });

const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: z
    .strictObject({
      role: text,
      company: nonEmpty,
      client: text.optional(),
      start: yearMonth,
      end: yearMonth.nullable(),
      location: text,
      workMode: z.enum(['On-site', 'Hybrid', 'Remote']).optional(),
      type: z.enum(['Full-time', 'Part-time', 'Freelance', 'Internship']),
      summary: localized,
      highlights: localizedList,
      skills: z.array(nonEmpty),
    })
    // Zod 4 runs this even when a date failed its regex; skip then, the regex reports it.
    .refine(
      ({ start, end }) =>
        end === null ||
        !YEAR_MONTH.test(start) ||
        !YEAR_MONTH.test(end) ||
        monthIndex(end) >= monthIndex(start),
      {
        message: '"end" must not be before "start"',
        path: ['end'],
      },
    ),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .strictObject({
        title: text,
        pitch: localized,
        highlights: localizedList.refine((list) => list.en.length >= 1 && list.en.length <= 5, {
          message: 'Use 1 to 5 highlights',
        }),
        tech: z.array(nonEmpty).min(1),
        repo: z.url().optional(),
        demo: z.url().optional(),
        private: z.boolean(),
        /** Short label shown instead of links, e.g. for a project with no public code. */
        badge: text.optional(),
        featured: z.boolean(),
        order: z.number().int(),
        image: image().optional(),
        imageAlt: localized.optional(),
      })
      .refine((p) => !(p.private && p.repo), {
        message: 'A private project must not link a repo',
        path: ['repo'],
      })
      .refine((p) => !p.image || p.imageAlt, {
        message: '"imageAlt" is required when "image" is set',
        path: ['imageAlt'],
      }),
});

export const collections = { experience, projects };
