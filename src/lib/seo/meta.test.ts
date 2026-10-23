import { describe, expect, test } from 'bun:test';
import { ROUTES, SITE_URL } from '$lib/config/site';
import { NOT_FOUND_PAGE } from '$lib/content/pages';
import { buildMeta, OG_HEIGHT, OG_WIDTH, ROBOTS_NOINDEX } from './meta';

const metas = ROUTES.map((route) => ({ route, meta: buildMeta(route.id) }));

describe('buildMeta', () => {
  test('titles are unique and at most 60 characters', () => {
    const titles = metas.map(({ meta }) => meta.title);

    expect(new Set(titles).size).toBe(titles.length);

    for (const title of titles) {
      expect(title.length).toBeGreaterThan(0);
      expect(title.length).toBeLessThanOrEqual(60);
    }
  });

  test('descriptions are unique and at most 160 characters', () => {
    const descriptions = metas.map(({ meta }) => meta.description);

    expect(new Set(descriptions).size).toBe(descriptions.length);

    for (const description of descriptions) {
      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });

  test('canonicals are absolute with no trailing slash except the root', () => {
    for (const { route, meta } of metas) {
      const expected = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;

      expect(meta.canonical).toBe(expected);
      expect(meta.og.url).toBe(expected);

      if (route.path !== '/') {
        expect(meta.canonical.endsWith('/')).toBe(false);
      }
    }
  });

  test('Open Graph and Twitter tags describe a 1200x630 absolute image', () => {
    for (const { route, meta } of metas) {
      expect(meta.og.image).toBe(`${SITE_URL}/og/${route.slug}.png`);
      expect(meta.og.imageWidth).toBe(OG_WIDTH);
      expect(meta.og.imageHeight).toBe(OG_HEIGHT);
      expect(meta.og.imageAlt.length).toBeGreaterThan(0);
      expect(meta.og.type).toBe('website');
      expect(meta.og.siteName).toBe('Harness Useful');
      expect(meta.og.locale).toBe('en_US');
      expect(meta.twitter.card).toBe('summary_large_image');
      expect(meta.twitter.image).toBe(meta.og.image);
    }
  });

  test('every route has a Markdown twin and is indexable', () => {
    for (const { route, meta } of metas) {
      expect(meta.markdown).toBe(`${SITE_URL}/${route.slug}.md`);
      expect(meta.robots).toContain('index,follow');
      expect(meta.robots).toContain('max-image-preview:large');
    }
  });

  test('the 404 page is noindex, has its own card and no Markdown twin', () => {
    const meta = buildMeta(NOT_FOUND_PAGE);

    expect(meta.robots).toBe(ROBOTS_NOINDEX);
    expect(meta.markdown).toBeUndefined();
    expect(meta.og.image).toBe(`${SITE_URL}/og/404.png`);
  });
});
