// Page metadata for <head>: title, description, canonical, Open Graph and Twitter tags.
import { absoluteUrl, SITE_NAME, SITE_URL, ROUTES, type RouteId } from '$lib/config/site';
import { PAGES } from '$lib/content/pages';
import type { PageMeta } from '$lib/content/types';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const ROBOTS_INDEX = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
export const ROBOTS_NOINDEX = 'noindex,follow';

export interface MetaTags {
  title: string;
  description: string;
  /** Absolute canonical URL; no trailing slash except for the root. */
  canonical: string;
  /** Absolute URL of the page's Markdown twin; absent for the 404 page. */
  markdown?: string;
  robots: string;
  og: {
    title: string;
    description: string;
    url: string;
    type: 'website';
    siteName: string;
    locale: 'en_US';
    image: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
}

/** Absolute URL of the Open Graph image of a page slug ('index' for home). */
export function ogImageUrl(slug: string): string {
  return `${SITE_URL}/og/${slug}.png`;
}

/** Absolute URL of the Markdown twin of a page slug. */
export function markdownUrl(slug: string): string {
  return `${SITE_URL}/${slug}.md`;
}

/** Builds the head metadata for a route id or an explicit PageMeta (e.g. the 404 page). */
export function buildMeta(page: RouteId | PageMeta): MetaTags {
  const meta = typeof page === 'string' ? PAGES[page] : page;
  const canonical = absoluteUrl(meta.path);
  const image = ogImageUrl(meta.slug);
  const ogTitle = meta.ogTitle ?? meta.title;
  const imageAlt = `Preview card: ${ogTitle}`;
  const ogDescription = meta.ogDescription ?? meta.description;
  const isIndexable = ROUTES.some((route) => route.slug === meta.slug);

  return {
    title: meta.title,
    description: meta.description,
    canonical,
    markdown: isIndexable ? markdownUrl(meta.slug) : undefined,
    robots: isIndexable ? ROBOTS_INDEX : ROBOTS_NOINDEX,
    og: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      image,
      imageWidth: OG_WIDTH,
      imageHeight: OG_HEIGHT,
      imageAlt,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      image,
      imageAlt,
    },
  };
}
