// Per-page SEO metadata. Paths and slugs come from ROUTES so they cannot drift.
import { ROUTES, type RouteId } from '$lib/config/site';
import type { Breadcrumb, PageMeta } from './types';

const HOME_CRUMB: Breadcrumb = { name: 'Home', path: '/' };

type PageText = Pick<PageMeta, 'title' | 'description' | 'ogTitle' | 'ogDescription'> & { crumb: string };

const TEXT: Record<RouteId, PageText> = {
  home: {
    title: 'Harness Useful – tools for coding-agent harnesses',
    description:
      'Harness Useful is a family of four open-source, local tools for coding-agent CLIs: a desktop window, a workflow, shared memory and a usage meter.',
    ogTitle: 'Harness Useful: local tools for your coding agent',
    ogDescription: 'Desktop, skills, memory, dashboard. Four open-source local tools around the coding-agent CLI you already run.',
    crumb: 'Home',
  },
  desktop: {
    title: 'Harness Desktop – a desktop app for your coding-agent CLI',
    description:
      'Harness Desktop is a native app that runs on the coding-agent CLI you already have: chat, sessions, diff review comments and config. No telemetry.',
    crumb: 'Harness Desktop',
  },
  skills: {
    title: 'Harness Skills – workflow skills for coding agents',
    description:
      'Harness Skills are us-* skills for Oh My Pi, Claude Code, OpenCode and Codex that take a request to reviewed, verified work. Open source.',
    crumb: 'Harness Skills',
  },
  memory: {
    title: 'Harness Memory – a local MCP server for agent memory',
    description:
      'Harness Memory is a local MCP server that gives Claude Code, Codex, OMP, PI and OpenCode one shared project memory. SQLite, per repository.',
    crumb: 'Harness Memory',
  },
  dashboard: {
    title: 'Harness Dashboard – token usage and cost of AI coding',
    description:
      'Harness Dashboard is a local app that reads the sessions of 13 AI coding tools and shows where your tokens and money go. Never uploaded.',
    crumb: 'Harness Dashboard',
  },
  faq: {
    title: 'Harness Useful FAQ – install, privacy, harnesses',
    description:
      'Answers about Harness Useful: what the tools are, where to start, which coding agents they support, how to install them and where your data lives.',
    crumb: 'FAQ',
  },
};

function buildPage(id: RouteId): PageMeta {
  const route = ROUTES.find((entry) => entry.id === id);

  if (!route) {
    throw new Error(`Unknown route: ${id}`);
  }

  const { crumb, ...text } = TEXT[id];
  const breadcrumbs = id === 'home' ? [HOME_CRUMB] : [HOME_CRUMB, { name: crumb, path: route.path }];

  return { ...text, path: route.path, slug: route.slug, breadcrumbs };
}

export const PAGES: Record<RouteId, PageMeta> = {
  home: buildPage('home'),
  desktop: buildPage('desktop'),
  skills: buildPage('skills'),
  memory: buildPage('memory'),
  dashboard: buildPage('dashboard'),
  faq: buildPage('faq'),
};

/** Metadata of the 404 page (noindex; not part of ROUTES or the sitemap). */
export const NOT_FOUND_PAGE: PageMeta = {
  title: 'Page not found – Harness Useful',
  description:
    'This page does not exist. Go back to the Harness Useful home page to find the desktop app, skills, memory server and usage dashboard.',
  path: '/404',
  slug: '404',
  breadcrumbs: [HOME_CRUMB, { name: 'Page not found', path: '/404' }],
};
