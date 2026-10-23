import { error } from '@sveltejs/kit';
import { ICON_NAMES, isIconName, renderNamedIcon } from '$lib/seo/icons';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => ICON_NAMES.map((name) => ({ name }));

export const GET: RequestHandler = async ({ params }) => {
  if (!isIconName(params.name)) {
    error(404, 'Not found');
  }

  const png = await renderNamedIcon(params.name);

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
