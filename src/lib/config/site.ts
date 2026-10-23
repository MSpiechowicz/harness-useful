// Single source of truth for site-wide constants. Every route list, sitemap, nav and JSON-LD derives from here.

export const SITE_URL = 'https://harness-useful.com';
export const SITE_NAME = 'Harness Useful';

/** Publisher organization (JSON-LD). */
export const ORG = {
  name: 'Harness Useful',
  url: SITE_URL,
  github: 'https://github.com/MSpiechowicz',
} as const;

/** Content author (JSON-LD). */
export const AUTHOR = {
  name: 'Maciej Spiechowicz',
  url: 'https://github.com/MSpiechowicz',
} as const;

export type RouteId = 'home' | 'desktop' | 'skills' | 'memory' | 'dashboard' | 'faq';

export interface RouteEntry {
  id: RouteId;
  /** URL path: '/' for home, otherwise '/<id>' (no trailing slash). */
  path: string;
  /** File slug for generated artifacts (<slug>.md, og/<slug>.png): 'index' for home. */
  slug: string;
}

/** Every page of the site, in navigation order. */
export const ROUTES: readonly RouteEntry[] = [
  { id: 'home', path: '/', slug: 'index' },
  { id: 'desktop', path: '/desktop', slug: 'desktop' },
  { id: 'skills', path: '/skills', slug: 'skills' },
  { id: 'memory', path: '/memory', slug: 'memory' },
  { id: 'dashboard', path: '/dashboard', slug: 'dashboard' },
  { id: 'faq', path: '/faq', slug: 'faq' },
];

/** Canonical absolute URL for a site path; no trailing slash except for the root. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const trimmed = clean.length > 1 ? clean.replace(/\/+$/, '') : clean;

  return trimmed === '/' ? `${SITE_URL}/` : `${SITE_URL}${trimmed}`;
}

export const PRODUCT_IDS = ['desktop', 'skills', 'memory', 'dashboard'] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const SITE_REPO = 'https://github.com/MSpiechowicz/harness-useful';

/** GitHub repository per product. */
export const REPOS: Record<ProductId, string> = {
  desktop: 'https://github.com/MSpiechowicz/harness-useful-desktop',
  skills: 'https://github.com/MSpiechowicz/harness-useful-skills',
  memory: 'https://github.com/MSpiechowicz/harness-useful-memory',
  dashboard: 'https://github.com/MSpiechowicz/harness-useful-dashboard',
};

/** Brand gradients [from, to], from ../harness-useful-logo/projects.json; `family` is the shared brand. */
export const GRADIENTS: Record<ProductId | 'family', [string, string]> = {
  family: ['#2DD4A8', '#5EB3FF'],
  desktop: ['#38BDF8', '#818CF8'],
  skills: ['#A3E635', '#22C55E'],
  memory: ['#D946EF', '#FB923C'],
  dashboard: ['#F59E0B', '#F472B6'],
};

/** UI accent colors from the approved homepage board (`C` const in TerminalStory.dc.html). */
export const COLORS = {
  you: '#F2F7F5',
  desktop: '#7DD3FC',
  skills: '#A3E635',
  memory: '#E879F9',
  dashboard: '#FBBF24',
  /** CLI / agent output. */
  agent: '#5EEAC4',
  /** Muted disk / secondary text. */
  disk: '#93A39F',
} as const;
