import { robotsTxt } from '$lib/seo/robots';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
