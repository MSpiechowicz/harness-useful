import { describe, expect, test } from 'bun:test';
import { AI_CRAWLERS, robotsTxt } from './robots';

describe('robotsTxt', () => {
  const txt = robotsTxt();

  test('allows all crawlers', () => {
    expect(txt).toContain('User-agent: *\nAllow: /');
    expect(txt).not.toMatch(/^Disallow: ./m);
  });

  test('gives every listed AI crawler an explicit Allow group', () => {
    expect(AI_CRAWLERS.length).toBe(17);

    for (const agent of AI_CRAWLERS) {
      expect(txt).toContain(`User-agent: ${agent}\nAllow: /`);
    }
  });

  test('names the sitemap with an absolute URL', () => {
    expect(txt).toContain('Sitemap: https://harness-useful.com/sitemap.xml');
  });
});
