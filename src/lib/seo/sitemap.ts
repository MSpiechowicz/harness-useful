// sitemap.xml: every ROUTE with its absolute canonical URL. The 404 page is never listed.
import { absoluteUrl, ROUTES } from '$lib/config/site';

const escapeXml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Today's date as YYYY-MM-DD (UTC): the build date, used as lastmod. */
export function buildDate(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Canonical URLs listed in the sitemap, in navigation order. */
export function sitemapUrls(): string[] {
  return ROUTES.map((route) => absoluteUrl(route.path));
}

export function sitemapXml(lastmod: string = buildDate()): string {
  const entries = sitemapUrls().map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}
