import { llmsTxt } from '$lib/seo/llms';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
