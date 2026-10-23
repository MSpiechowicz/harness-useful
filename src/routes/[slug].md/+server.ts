import { error } from '@sveltejs/kit';
import { markdownSlugs, pageMarkdown, routeForSlug } from '$lib/seo/markdown';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => markdownSlugs().map((slug) => ({ slug }));

export const GET: RequestHandler = ({ params }) => {
  const route = routeForSlug(params.slug);

  if (!route) {
    error(404, 'Not found');
  }

  return new Response(pageMarkdown(route), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
