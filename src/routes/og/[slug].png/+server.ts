import { error } from '@sveltejs/kit';
import { ogSlugs, renderOg, targetForSlug } from '$lib/seo/og';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => ogSlugs().map((slug) => ({ slug }));

export const GET: RequestHandler = async ({ params }) => {
  const target = targetForSlug(params.slug);

  if (!target) {
    error(404, 'Not found');
  }

  const png = await renderOg(target);

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
