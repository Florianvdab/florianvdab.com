// Site-wide constants and skill groups. Jobs and projects live in src/content/.
export const site = {
  name: 'Florian Vandenabeele',
  handle: 'Florianvdab',
  url: 'https://florianvdab.com',
  title: 'Florian Vandenabeele: full-stack developer',
  description:
    'Full-stack developer (Java/Spring, Vue/Nuxt, Flutter) in West Flanders, Belgium. Also builds fast, affordable static websites.',
  email: 'Florian.vdab@outlook.com',
  location: 'West Flanders, Belgium',
  social: {
    github: 'https://github.com/Florianvdab',
    linkedin: 'https://www.linkedin.com/in/florianvdab/',
  },
} as const;

export interface SkillGroup {
  name: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: 'Backend',
    skills: ['Java', 'Spring Boot', 'Spring Security', 'JPA/Hibernate', 'REST', 'Microservices'],
  },
  { name: 'Frontend', skills: ['Vue', 'Nuxt', 'React', 'TypeScript'] },
  { name: 'Mobile', skills: ['Flutter', 'Android'] },
  {
    name: 'Data & Ops',
    skills: ['PostgreSQL', 'Flyway', 'Docker', 'GitHub Actions', 'Linux/home server'],
  },
  { name: 'Other', skills: ['.NET/C#', 'OCPI'] },
];
