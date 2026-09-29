import type { Localized, Locale } from './locales';

/** Returns the text for `locale`. Plain strings are the same in every language. */
export function tr<T>(value: T | Localized<T>, locale: Locale): T {
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && 'en' in value) {
    return (value as Localized<T>)[locale];
  }
  return value as T;
}

/**
 * All interface text. Every key must exist in every locale (enforced by the `satisfies` below),
 * so a missing translation is a type error, not a blank on the page.
 */
const en = {
  meta: {
    title: 'Florian Vandenabeele: full-stack developer',
    description:
      'Full-stack developer (Java/Spring, Vue/Nuxt, Flutter) in West Flanders, Belgium. Also builds fast, affordable static websites.',
    jobTitle: 'Full-stack developer',
  },
  location: 'West Flanders, Belgium',
  tagline:
    'Full-stack developer (Java/Spring, Vue/Nuxt, Flutter) building reliable software for government, payments and ERP.',
  skipLink: 'Skip to content',
  nav: {
    label: 'Main',
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    freelance: 'Freelance',
    contact: 'Contact',
  },
  switchTo: { label: 'NL', title: 'Nederlandse versie' },
  darkMode: 'Dark mode',
  hero: {
    greeting: "Hi, I'm Florian.",
    seeWork: 'See my work',
    hire: 'Hire me for a website',
    downloadCv: 'Download CV',
    portraitAlt: 'Portrait of Florian Vandenabeele',
  },
  about: {
    title: 'About',
    paragraphs: [
      "I'm a full-stack developer from West Flanders. Since 2021 I've worked on a cloud-based ERP, payment terminals and an EV-charging backend, and today I help modernise Belgian federal government applications.",
      "Most of my work is Java and Spring on the backend with Vue/Nuxt on the front, plus Flutter and Android when there's a mobile side to it.",
    ],
    outside: 'Outside of work',
    hobbies: {
      reading: 'Reading',
      gaming: 'Gaming',
      server: 'Tinkering with my home server (it serves this site)',
    },
  },
  experience: {
    title: 'Experience',
    present: 'Present',
    for: 'for',
    skills: 'Skills',
    type: {
      'Full-time': 'Full-time',
      'Part-time': 'Part-time',
      Freelance: 'Freelance',
      Internship: 'Internship',
    },
    workMode: { 'On-site': 'On-site', Hybrid: 'Hybrid', Remote: 'Remote' },
  },
  skills: { title: 'Skills' },
  projects: {
    title: 'Projects',
    sourceCode: 'Source code',
    liveDemo: 'Live demo',
    privateRepo: 'Private repo',
    demoOnRequest: 'Demo on request',
    demoSubject: 'Demo request',
    techUsed: 'Tech used in',
    for: 'for',
    of: 'of',
  },
  freelance: {
    title: 'Need a website?',
    intro:
      'In my free time I build fast, affordable static websites for small businesses, portfolios and event or landing pages.',
    points: {
      fast: {
        title: 'Fast & SEO-friendly',
        text: 'Static pages load almost instantly and are easy for search engines to read.',
      },
      cheap: {
        title: 'Cheap to host',
        text: 'No server-side code or database to run, so hosting costs little or nothing.',
      },
      yours: {
        title: 'You own everything',
        text: 'The code, the content and the domain are yours. No lock-in to a site builder.',
      },
    },
    cta: 'Tell me about your project',
    mailSubject: 'Website project',
  },
  contact: {
    title: 'Get in touch',
    intro: "The quickest way to reach me is email. I'm also on GitHub and LinkedIn.",
    downloadCv: 'Download my CV',
  },
  footer: { builtWith: 'Built with', servedFrom: 'served from a home server' },
};

type Dictionary = typeof en;

/** Same shape as `Dictionary`, but with any string values (TS would otherwise demand the English literals). */
type Shape<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : Shape<T[K]>;
};

const nl = {
  meta: {
    title: 'Florian Vandenabeele: full-stack developer',
    description:
      'Full-stack developer (Java/Spring, Vue/Nuxt, Flutter) uit West-Vlaanderen. Bouwt ook snelle, betaalbare statische websites.',
    jobTitle: 'Full-stack developer',
  },
  location: 'West-Vlaanderen, België',
  tagline:
    'Full-stack developer (Java/Spring, Vue/Nuxt, Flutter) die betrouwbare software bouwt voor overheid, betalingen en ERP.',
  skipLink: 'Naar de inhoud',
  nav: {
    label: 'Hoofdmenu',
    about: 'Over mij',
    experience: 'Ervaring',
    projects: 'Projecten',
    freelance: 'Freelance',
    contact: 'Contact',
  },
  switchTo: { label: 'EN', title: 'English version' },
  darkMode: 'Donkere modus',
  hero: {
    greeting: 'Hoi, ik ben Florian.',
    seeWork: 'Bekijk mijn werk',
    hire: 'Laat een website maken',
    downloadCv: 'Download cv',
    portraitAlt: 'Portret van Florian Vandenabeele',
  },
  about: {
    title: 'Over mij',
    paragraphs: [
      'Ik ben een full-stack developer uit West-Vlaanderen. Sinds 2021 werkte ik aan een cloudgebaseerd ERP, betaalterminals en een backend voor het laden van elektrische voertuigen. Vandaag help ik om applicaties van de Belgische overheid te moderniseren.',
      'Meestal werk ik met Java en Spring in de backend en Vue/Nuxt in de frontend, aangevuld met Flutter en Android als er een mobiele kant aan zit.',
    ],
    outside: 'Naast het werk',
    hobbies: {
      reading: 'Lezen',
      gaming: 'Gamen',
      server: 'Prutsen aan mijn homelab (die deze site host)',
    },
  },
  experience: {
    title: 'Ervaring',
    present: 'Heden',
    for: 'voor',
    skills: 'Vaardigheden',
    type: {
      'Full-time': 'Voltijds',
      'Part-time': 'Deeltijds',
      Freelance: 'Freelance',
      Internship: 'Stage',
    },
    workMode: { 'On-site': 'Op locatie', Hybrid: 'Hybride', Remote: 'Op afstand' },
  },
  skills: { title: 'Vaardigheden' },
  projects: {
    title: 'Projecten',
    sourceCode: 'Broncode',
    liveDemo: 'Live demo',
    privateRepo: 'Private repo',
    demoOnRequest: 'Demo op aanvraag',
    demoSubject: 'Demo-aanvraag',
    techUsed: 'Gebruikte technologie in',
    for: 'voor',
    of: 'van',
  },
  freelance: {
    title: 'Een website nodig?',
    intro:
      "In mijn vrije tijd bouw ik snelle, betaalbare statische websites voor kleine ondernemingen, portfolio's en event- of landingspagina's.",
    points: {
      fast: {
        title: 'Snel & SEO-vriendelijk',
        text: "Statische pagina's laden bijna meteen en zijn makkelijk te lezen voor zoekmachines.",
      },
      cheap: {
        title: 'Goedkoop te hosten',
        text: 'Geen servercode of database die moet draaien, dus hosting kost weinig of niets.',
      },
      yours: {
        title: 'Alles is van jou',
        text: 'De code, de inhoud en het domein zijn van jou. Je zit niet vast aan een websitebouwer.',
      },
    },
    cta: 'Vertel me over je project',
    mailSubject: 'Websiteproject',
  },
  contact: {
    title: 'Contact',
    intro: 'Mailen is de snelste manier om me te bereiken. Je vindt me ook op GitHub en LinkedIn.',
    downloadCv: 'Download mijn cv',
  },
  footer: { builtWith: 'Gemaakt met', servedFrom: 'gehost op een homelab' },
} satisfies Shape<Dictionary>;

const dictionaries: Record<Locale, Shape<Dictionary>> = { en, nl };

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

/** Skill groups. A plain string is the same in every language. */
export const skillGroups: { name: Localized; skills: (string | Localized)[] }[] = [
  {
    name: { en: 'Backend', nl: 'Backend' },
    skills: ['Java', 'Spring Boot', 'Spring Security', 'JPA/Hibernate', 'REST', 'Microservices'],
  },
  { name: { en: 'Frontend', nl: 'Frontend' }, skills: ['Vue', 'Nuxt', 'React', 'TypeScript'] },
  { name: { en: 'Mobile', nl: 'Mobiel' }, skills: ['Flutter', 'Android'] },
  {
    name: { en: 'Data & Ops', nl: 'Data & Ops' },
    skills: [
      'PostgreSQL',
      'Flyway',
      'Docker',
      'GitHub Actions',
      { en: 'Linux/home server', nl: 'Linux/homelab' },
    ],
  },
  { name: { en: 'Other', nl: 'Overig' }, skills: ['.NET/C#', 'OCPI'] },
];
