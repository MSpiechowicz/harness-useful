import { describe, expect, test } from 'bun:test';
import { absoluteUrl, ROUTES } from '$lib/config/site';
import { buildDate, sitemapXml } from './sitemap';

const locs = (xml: string): string[] => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

describe('sitemapXml', () => {
  test('lists exactly the routes as absolute canonical URLs', () => {
    const xml = sitemapXml('2026-10-23');

    expect(locs(xml)).toEqual(ROUTES.map((route) => absoluteUrl(route.path)));
  });

  test('never lists the 404 page', () => {
    expect(sitemapXml()).not.toContain('404');
  });

  test('uses the given build date as lastmod for every entry', () => {
    const xml = sitemapXml('2026-10-23');

    expect(xml.match(/<lastmod>2026-10-23<\/lastmod>/g)?.length).toBe(ROUTES.length);
  });

  test('is a well-formed urlset document', () => {
    const xml = sitemapXml();

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });
});

describe('buildDate', () => {
  test('formats a date as an ISO day', () => {
    expect(buildDate(new Date('2026-10-23T22:15:00Z'))).toBe('2026-10-23');
  });
});
