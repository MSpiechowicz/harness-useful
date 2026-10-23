// robots.txt: everything is crawlable, and each AI crawler gets an explicit Allow group so the intent is unambiguous.
import { SITE_URL } from '$lib/config/site';

/** AI search, assistant and training crawlers that are explicitly welcome. */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'meta-externalagent',
  'DuckAssistBot',
  'cohere-ai',
  'MistralAI-User',
] as const;

export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

export function robotsTxt(): string {
  const groups = ['*', ...AI_CRAWLERS].map((agent) => `User-agent: ${agent}\nAllow: /`);

  return `${groups.join('\n\n')}\n\nSitemap: ${SITEMAP_URL}\n`;
}
