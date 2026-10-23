import { describe, expect, test } from 'bun:test';
import { ROUTES, SITE_URL } from '$lib/config/site';
import { FAMILY_FAQ } from '$lib/content/faq';
import { NET_HOPS } from '$lib/content/home';
import { PRODUCTS } from '$lib/content/products';
import { markdownSlugs, pageMarkdown, routeForSlug } from './markdown';

/** Link targets of every Markdown link in a text. */
const linkTargets = (markdown: string): string[] => [...markdown.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);

describe('pageMarkdown', () => {
  test.each(ROUTES.map((route) => route.id))('%s is non-empty Markdown without front matter', (id) => {
    const markdown = pageMarkdown(id);

    expect(markdown.length).toBeGreaterThan(500);
    expect(markdown.startsWith('# ')).toBe(true);
    expect(markdown.startsWith('---')).toBe(false);
  });

  test.each(ROUTES.map((route) => route.id))('%s uses only absolute links', (id) => {
    for (const target of linkTargets(pageMarkdown(id))) {
      expect(target).toMatch(/^https?:\/\//);
    }
  });

  test('product pages keep install commands in fenced blocks and list every FAQ question', () => {
    for (const product of Object.values(PRODUCTS)) {
      const markdown = pageMarkdown(product.id);

      expect(markdown).toContain(`# ${product.name}`);
      expect(markdown).toContain(product.definition);

      for (const step of product.install) {
        expect(markdown).toContain(`\`\`\`${step.platform === 'windows' ? 'powershell' : 'sh'}\n${step.command}\n\`\`\``);
      }

      for (const faq of product.faq) {
        expect(markdown).toContain(`### ${faq.q}\n\n${faq.a}`);
      }
    }
  });

  test('product privacy headings use the product override or the default question', () => {
    expect(pageMarkdown('skills')).toContain('## Is it safe? What stays under your control?');
    expect(pageMarkdown('desktop')).toContain('## Is Harness Desktop private? Where does my data live?');
  });

  test('the home page numbers the nine hops and has the comparison table', () => {
    const markdown = pageMarkdown('home');

    expect(NET_HOPS).toHaveLength(9);

    NET_HOPS.forEach((hop, index) => {
      expect(markdown).toContain(`${index + 1}. **${hop.title}**`);
    });

    expect(markdown).toContain('## Which tool do I need?');
    expect(markdown).toMatch(/\| Tool \| What it does \|/);
    expect(markdown).toContain(`[Harness Desktop](${SITE_URL}/desktop)`);
  });

  test('the faq page contains every family question and answer', () => {
    const markdown = pageMarkdown('faq');

    for (const faq of FAMILY_FAQ) {
      expect(markdown).toContain(`### ${faq.q}\n\n${faq.a}`);
    }
  });
});

describe('slugs', () => {
  test('every route slug maps back to its route; unknown slugs do not', () => {
    expect(markdownSlugs()).toEqual(ROUTES.map((route) => route.slug));

    for (const route of ROUTES) {
      expect(routeForSlug(route.slug)).toBe(route.id);
    }

    expect(routeForSlug('404')).toBeUndefined();
    expect(routeForSlug('nope')).toBeUndefined();
  });
});
