// Shared navigation labels for Header, Footer and the error page. Paths come from ROUTES (single source of truth).
import { ROUTES, type RouteEntry, type RouteId } from '$lib/config/site';

const LABELS: Record<RouteId, string> = {
  home: 'Home',
  desktop: 'Desktop',
  skills: 'Skills',
  memory: 'Memory',
  dashboard: 'Dashboard',
  faq: 'FAQ',
};

export interface NavLink {
  href: string;
  label: string;
}

function toLink(route: RouteEntry): NavLink {
  return { href: route.path, label: LABELS[route.id] };
}

/** Every page except the home page, in navigation order. */
export const PAGE_LINKS: NavLink[] = ROUTES.filter((route) => route.id !== 'home').map(toLink);

/** Every page including the home page. */
export const ALL_LINKS: NavLink[] = ROUTES.map(toLink);
