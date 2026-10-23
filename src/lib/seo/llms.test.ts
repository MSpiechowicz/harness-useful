import { describe, expect, test } from 'bun:test';
import { PRODUCT_IDS, REPOS, ROUTES, SITE_URL } from '$lib/config/site';
import { PRODUCTS } from '$lib/content/products';
import { llmsFullTxt, llmsTxt } from './llms';
import { pageMarkdown } from './markdown';

describe('llmsTxt', () => {
  const txt = llmsTxt();

  test('follows the llms.txt layout: H1, blockquote summary, then link sections', () => {
    const lines = txt.split('\n');

    expect(lines[0]).toBe('# Harness Useful');
    expect(lines[2].startsWith('> ')).toBe(true);

    for (const section of ['## Products', '## Docs', '## Source', '## Optional']) {
      expect(txt).toContain(`\n${section}\n`);
    }
  });

  test('links every route as an absolute Markdown URL, and every link is absolute', () => {
    for (const route of ROUTES) {
      expect(txt).toContain(`](${SITE_URL}/${route.slug}.md)`);
    }

    for (const match of txt.matchAll(/\]\(([^)]+)\)/g)) {
      expect(match[1]).toMatch(/^https:\/\//);
    }
  });

  test('describes each product by its definition and links the repositories and full text', () => {
    for (const id of PRODUCT_IDS) {
      expect(txt).toContain(`- [${PRODUCTS[id].name}](${SITE_URL}/${id}.md): ${PRODUCTS[id].definition}`);
      expect(txt).toContain(REPOS[id]);
    }

    expect(txt).toContain(`(${SITE_URL}/llms-full.txt)`);
  });
});

describe('llmsFullTxt', () => {
  test('contains the Markdown of every page, introduced by its canonical URL', () => {
    const full = llmsFullTxt();

    for (const route of ROUTES) {
      expect(full).toContain(pageMarkdown(route.id).trimEnd());
    }

    expect(full).toContain(`Source: ${SITE_URL}/\n`);
    expect(full).toContain(`Source: ${SITE_URL}/desktop\n`);
    expect(full.split('\n---\n').length).toBe(ROUTES.length);
  });
});
