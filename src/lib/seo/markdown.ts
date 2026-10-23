// Markdown twins of the pages (served as /<slug>.md and concatenated into llms-full.txt).
// Built from the content modules, so the Markdown can never drift from the page content.
import { absoluteUrl, PRODUCT_IDS, ROUTES, type RouteId } from '$lib/config/site';
import { FAMILY_FAQ } from '$lib/content/faq';
import { COMPARISON, DIFFS, HERO, INSTALL, NET_HOPS, SECTIONS } from '$lib/content/home';
import { PAGES } from '$lib/content/pages';
import { PRODUCTS } from '$lib/content/products';
import type { Faq, InstallStep, Product } from '$lib/content/types';

const cell = (text: string): string => text.replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');

function table(header: string[], rows: string[][]): string {
  const head = `| ${header.join(' | ')} |`;
  const divider = `| ${header.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map(cell).join(' | ')} |`);

  return [head, divider, ...body].join('\n');
}

function fenced(command: string, platform: string): string {
  const language = platform === 'windows' ? 'powershell' : 'sh';

  return `\`\`\`${language}\n${command}\n\`\`\``;
}

function faqSection(faqs: Faq[], heading = '## Frequently asked questions'): string {
  const entries = faqs.map((faq) => `### ${faq.q}\n\n${faq.a}`);

  return [heading, ...entries].join('\n\n');
}

function installSection(steps: InstallStep[]): string {
  const blocks = steps.map((step) => `### ${step.label}\n\n${fenced(step.command, step.platform)}`);

  return blocks.join('\n\n');
}

function productLink(product: Product): string {
  return `[${product.name}](${absoluteUrl(`/${product.id}`)})`;
}

function homeMarkdown(): string {
  const products = PRODUCT_IDS.map((id) => PRODUCTS[id]);
  const stats = HERO.stats.map((stat) => `${stat.value} ${stat.label}`).join(' · ');

  const productSection = products
    .map((product) => {
      const links = `${productLink(product)} · [Markdown](${absoluteUrl(`/${product.id}.md`)}) · [GitHub](${product.repo})`;

      return `### ${product.name}\n\n${product.tagline} ${product.definition}\n\n${links}`;
    })
    .join('\n\n');

  const hops = NET_HOPS.map((hop, index) => `${index + 1}. **${hop.title}** (${hop.t}). ${hop.body} ${hop.benefit}`).join('\n');

  const diffRows = DIFFS.map((row) => [row.before, row.after, PRODUCTS[row.tool].name]);

  const comparisonRows = COMPARISON.map((row) => [
    `[${row.name}](${absoluteUrl(`/${row.id}`)})`,
    row.what,
    row.runsAs,
    row.platforms,
    row.worksWith,
    row.dataLives,
    row.license,
  ]);

  const installBlocks = INSTALL.commands.map((entry) => {
    const platform = entry.prompt === '>' ? 'windows' : 'macos-linux';
    const label = entry.label.replace(/^#\s*/, '');

    return `### ${label}\n\n${fenced(entry.command, platform)}`;
  });

  return [
    '# Harness Useful',
    `> ${HERO.h1.join(' ')}`,
    HERO.lead,
    `By the numbers: ${stats}.`,
    `## What is Harness Useful?\n\n${FAMILY_FAQ[0].a}`,
    `## ${SECTIONS.flow.title}\n\n${SECTIONS.flow.lead}\n\n${hops}`,
    `## ${SECTIONS.diff.lead.replace(/\.$/, '')}\n\n${table(['Before', 'With the family', 'Tool'], diffRows)}`,
    `## Which tool do I need?\n\n${table(['Tool', 'What it does', 'Runs as', 'Platforms', 'Works with', 'Where data lives', 'License'], comparisonRows)}`,
    `## The four tools\n\n${productSection}`,
    `## ${INSTALL.title}\n\n${INSTALL.lead}\n\n${installBlocks.join('\n\n')}`,
    faqSection(FAMILY_FAQ),
    `## Links\n\n- Website: ${absoluteUrl('/')}\n- FAQ: ${absoluteUrl('/faq')}`,
  ].join('\n\n');
}

function productMarkdown(product: Product): string {
  const harnessRows = product.harnesses.map((entry) => [entry.name, entry.support]);

  const links = [
    `- Page: ${absoluteUrl(`/${product.id}`)}`,
    `- GitHub: ${product.repo}`,
    `- Releases: ${product.releases}`,
    `- License: ${product.license}`,
    `- Harness Useful home: ${absoluteUrl('/')}`,
    `- FAQ: ${absoluteUrl('/faq')}`,
  ];

  return [
    `# ${product.name}`,
    `> ${product.tagline}`,
    product.definition,
    `## What does ${product.name} do?\n\n${product.features.map((feature) => `- **${feature.title}.** ${feature.text}`).join('\n')}`,
    `## Which harnesses and tools does ${product.name} support?\n\n${table(['Harness', 'Support'], harnessRows)}`,
    `## Which platforms does ${product.name} run on?\n\n${product.platforms.map((platform) => `- ${platform}`).join('\n')}`,
    `## How do I install ${product.name}?\n\n${installSection(product.install)}`,
    `## ${product.privacyHeading ?? `Is ${product.name} private? Where does my data live?`}\n\n${product.privacy.map((line) => `- ${line}`).join('\n')}`,
    faqSection(product.faq),
    `## Links\n\n${links.join('\n')}`,
  ].join('\n\n');
}

function faqMarkdown(): string {
  const links = [`- Harness Useful home: ${absoluteUrl('/')}`, ...PRODUCT_IDS.map((id) => `- ${productLink(PRODUCTS[id])}`)];

  return [
    '# Harness Useful FAQ',
    `> ${PAGES.faq.description}`,
    faqSection(FAMILY_FAQ, '## Questions and answers'),
    `## Links\n\n${links.join('\n')}`,
  ].join('\n\n');
}

/** Clean Markdown of a page, without front matter. Links are absolute. */
export function pageMarkdown(id: RouteId): string {
  if (id === 'home') {
    return `${homeMarkdown()}\n`;
  }

  if (id === 'faq') {
    return `${faqMarkdown()}\n`;
  }

  return `${productMarkdown(PRODUCTS[id])}\n`;
}

export function markdownSlugs(): string[] {
  return ROUTES.map((route) => route.slug);
}

/** Route id for a Markdown slug ('index' is the home page); undefined when unknown. */
export function routeForSlug(slug: string): RouteId | undefined {
  return ROUTES.find((route) => route.slug === slug)?.id;
}
