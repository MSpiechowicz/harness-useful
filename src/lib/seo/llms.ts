// llms.txt (llmstxt.org) and llms-full.txt: a curated index and the full text for language models.
import { absoluteUrl, PRODUCT_IDS, REPOS, ROUTES, SITE_NAME, SITE_REPO } from '$lib/config/site';
import { PAGES } from '$lib/content/pages';
import { PRODUCTS } from '$lib/content/products';
import { pageMarkdown } from './markdown';

const SUMMARY =
  'Harness Useful is a family of four open-source, local tools for coding-agent harnesses such as Oh My Pi, PI, OpenCode, Claude Code and Codex: Harness Desktop (a desktop window), Harness Skills (a workflow), Harness Memory (shared project memory) and Harness Dashboard (a token usage and cost meter). Everything runs on your machine, with no telemetry and no accounts.';

const CONTEXT =
  'Each tool works on its own, and Harness Desktop can install the others with one recommended setup. All four are free under the GNU General Public License version 3. Every page of this site has a Markdown twin at the same path with a .md extension (the home page is index.md).';

const markdownLink = (label: string, slug: string, note: string): string => `- [${label}](${absoluteUrl(`/${slug}.md`)}): ${note}`;

export function llmsTxt(): string {
  const products = PRODUCT_IDS.map((id) => {
    const product = PRODUCTS[id];

    return markdownLink(product.name, id, product.definition);
  });

  const docs = [
    markdownLink('FAQ', 'faq', PAGES.faq.description),
    markdownLink('Harness Useful overview', 'index', PAGES.home.description),
  ];

  const source = [
    `- [Harness Useful website source](${SITE_REPO}): the source of this website`,
    ...PRODUCT_IDS.map((id) => `- [${PRODUCTS[id].name} on GitHub](${REPOS[id]}): source, releases and README`),
  ];

  const optional = [
    `- [Full text of every page](${absoluteUrl('/llms-full.txt')}): all pages above concatenated as Markdown`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')}): every page of the site`,
  ];

  return (
    [
      `# ${SITE_NAME}`,
      `> ${SUMMARY}`,
      CONTEXT,
      `## Products\n\n${products.join('\n')}`,
      `## Docs\n\n${docs.join('\n')}`,
      `## Source\n\n${source.join('\n')}`,
      `## Optional\n\n${optional.join('\n')}`,
    ].join('\n\n') + '\n'
  );
}

/** Every page's Markdown, one after another, each introduced by its canonical URL. */
export function llmsFullTxt(): string {
  const sections = ROUTES.map((route) => `Source: ${absoluteUrl(route.path)}\n\n${pageMarkdown(route.id).trimEnd()}`);

  return `${sections.join('\n\n---\n\n')}\n`;
}
