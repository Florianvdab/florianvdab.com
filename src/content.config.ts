import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { YEAR_MONTH, monthIndex } from './lib/duration';

const yearMonth = z.string().regex(YEAR_MONTH, 'Use YYYY-MM, e.g. "2025-06"');

const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: z
    .strictObject({
      role: z.string().min(1),
      company: z.string().min(1),
      client: z.string().min(1).optional(),
      start: yearMonth,
      end: yearMonth.nullable(),
      location: z.string().min(1),
      type: z.enum(['Full-time', 'Part-time', 'Freelance', 'Internship']),
      summary: z.string().min(1),
      highlights: z.array(z.string().min(1)),
      skills: z.array(z.string().min(1)),
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
        title: z.string().min(1),
        pitch: z.string().min(1),
        highlights: z.array(z.string().min(1)).min(1).max(5),
        tech: z.array(z.string().min(1)).min(1),
        repo: z.url().optional(),
        demo: z.url().optional(),
        private: z.boolean(),
        featured: z.boolean(),
        order: z.number().int(),
        image: image().optional(),
        imageAlt: z.string().optional(),
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
