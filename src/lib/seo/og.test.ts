import { describe, expect, test } from 'bun:test';
import { ROUTES } from '$lib/config/site';
import { ogCard, ogSlugs, renderOg, targetForSlug } from './og';
import { pngSize } from './png-size';

describe('og cards', () => {
  test('there is a card for every route slug and for 404', () => {
    expect(ogSlugs()).toEqual([...ROUTES.map((route) => route.slug), '404']);

    for (const slug of ogSlugs()) {
      expect(targetForSlug(slug)).toBeDefined();
    }

    expect(targetForSlug('nope')).toBeUndefined();
  });

  test('card text: home h1, product names, eyebrow with the product', () => {
    expect(ogCard('home').title).toBe('Your coding agent, upgraded.');
    expect(ogCard('desktop').title).toBe('Harness Desktop');
    expect(ogCard('desktop').eyebrow).toBe('harness useful / desktop');
    expect(ogCard('dashboard').gradient).toEqual(['#F59E0B', '#F472B6']);
    expect(ogCard('faq').gradient).toEqual(['#2DD4A8', '#5EB3FF']);
  });

  test.each(ogSlugs())('%s renders a 1200x630 PNG', async (slug) => {
    const png = await renderOg(targetForSlug(slug)!);

    expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
    expect(png.subarray(1, 4).toString('latin1')).toBe('PNG');
  });
});
