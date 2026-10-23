// SEO audit of build/: per-page head, structure and JSON-LD checks, then the site-level files (sitemap, robots,
// llms.txt, Markdown twins, icons, manifest) and CSP hash coverage. Run through scripts/verify-build.ts or alone.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { absoluteUrl, PRODUCT_IDS, ROUTES, SITE_URL, type RouteEntry, type RouteId } from '../../src/lib/config/site';
import { FAMILY_FAQ } from '../../src/lib/content/faq';
import { PRODUCTS } from '../../src/lib/content/products';
import { AI_CRAWLERS } from '../../src/lib/seo/robots';
import { pngSize } from '../../src/lib/seo/png-size';
import { extractInlineScripts, hashScript } from '../gen-csp';
import { decodeEntities, findTags, jsonLdBlocks, normalizeText, readText, visibleText, withoutCode } from './html';

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;

type Failures = string[];

const htmlFileOf = (route: RouteEntry): string => (route.id === 'home' ? 'index.html' : `${route.slug}.html`);

interface Page {
  route: RouteEntry;
  file: string;
  html: string;
  title: string;
  description: string;
}

function metaContent(html: string, key: 'name' | 'property', value: string): string[] {
  return findTags(html, 'meta')
    .filter((attributes) => attributes[key] === value)
    .map((attributes) => attributes.content ?? '');
}

function loadPage(buildDir: string, route: RouteEntry): Page | undefined {
  const file = join(buildDir, htmlFileOf(route));

  if (!existsSync(file)) {
    return undefined;
  }

  const html = readText(file);
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '';

  return {
    route,
    file: htmlFileOf(route),
    html,
    title: normalizeText(decodeEntities(title)),
    description: metaContent(html, 'name', 'description')[0] ?? '',
  };
}

function checkHead(page: Page, buildDir: string, fail: (message: string) => void): void {
  const { html, route } = page;
  const canonical = absoluteUrl(route.path);

  if (page.title === '') fail('missing <title>');
  if (page.title.length > MAX_TITLE) fail(`title is ${page.title.length} characters (max ${MAX_TITLE})`);

  if (page.description === '') fail('missing meta description');
  if (page.description.length > MAX_DESCRIPTION) fail(`description is ${page.description.length} characters (max ${MAX_DESCRIPTION})`);

  const canonicals = findTags(html, 'link').filter((attributes) => attributes.rel === 'canonical');

  if (canonicals.length !== 1 || canonicals[0].href !== canonical) {
    fail(`canonical must be exactly one link to ${canonical} (found ${canonicals.map((link) => link.href).join(', ') || 'none'})`);
  }

  const expected: Record<string, string | undefined> = {
    'og:title': undefined,
    'og:description': undefined,
    'og:url': canonical,
    'og:type': 'website',
    'og:site_name': 'Harness Useful',
    'og:image': `${SITE_URL}/og/${route.slug}.png`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': undefined,
  };

  for (const [property, value] of Object.entries(expected)) {
    const found = metaContent(html, 'property', property);

    if (found.length !== 1 || found[0] === '') fail(`needs exactly one non-empty ${property} (found ${found.length})`);
    else if (value !== undefined && found[0] !== value) fail(`${property} is "${found[0]}", expected "${value}"`);
  }

  if (metaContent(html, 'name', 'twitter:card')[0] !== 'summary_large_image') fail('twitter:card must be summary_large_image');

  checkOgImage(route, buildDir, fail);
}

function checkOgImage(route: RouteEntry, buildDir: string, fail: (message: string) => void): void {
  const file = join(buildDir, 'og', `${route.slug}.png`);

  if (!existsSync(file)) {
    fail(`og image build/og/${route.slug}.png does not exist`);

    return;
  }

  const { width, height } = pngSize(readFileSync(file));

  if (width !== 1200 || height !== 630) fail(`og image is ${width}x${height}, expected 1200x630`);
}

function checkStructure(page: Page, fail: (message: string) => void): void {
  const body = withoutCode(page.html);

  if (!/<html\b[^>]*\blang=["']?en["']?[\s>]/i.test(body)) fail('<html> needs lang="en"');

  const h1Count = (body.match(/<h1[\s>]/gi) ?? []).length;

  if (h1Count !== 1) fail(`needs exactly one <h1> (found ${h1Count})`);

  for (const landmark of ['header', 'nav', 'main', 'footer']) {
    if (!new RegExp(`<${landmark}[\\s>]`, 'i').test(body)) fail(`missing <${landmark}> landmark`);
  }

  const skipLink = findTags(body, 'a').some((attributes) => attributes.href === '#main');
  const hasMainId = findTags(body, 'main').some((attributes) => attributes.id === 'main');

  if (!skipLink) fail('missing skip link to #main');
  if (!hasMainId) fail('<main> needs id="main" as the skip link target');
}

type JsonNode = Record<string, unknown>;

function collectNodes(value: unknown, found: JsonNode[] = []): JsonNode[] {
  if (Array.isArray(value)) {
    value.forEach((item) => collectNodes(item, found));
  } else if (value && typeof value === 'object') {
    found.push(value as JsonNode);
    Object.values(value).forEach((item) => collectNodes(item, found));
  }

  return found;
}

function requiredTypes(id: RouteId): string[] {
  const common = ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList'];

  if (id === 'home') return [...common, 'ItemList', 'SoftwareApplication', 'VideoObject'];
  if (id === 'faq') return [...common, 'FAQPage'];

  return [...common, 'SoftwareApplication', 'SoftwareSourceCode', 'HowTo', 'FAQPage'];
}

function checkJsonLd(page: Page, fail: (message: string) => void): void {
  const nodes: JsonNode[] = [];

  for (const block of jsonLdBlocks(page.html)) {
    try {
      nodes.push(...collectNodes(JSON.parse(block)));
    } catch (error) {
      fail(`JSON-LD does not parse: ${(error as Error).message}`);
    }
  }

  const types = new Set(nodes.map((node) => node['@type']));

  for (const type of requiredTypes(page.route.id)) {
    if (!types.has(type)) fail(`JSON-LD is missing ${type}`);
  }

  if (page.route.id === 'home') {
    const apps = nodes.filter((node) => node['@type'] === 'SoftwareApplication').length;

    if (apps !== PRODUCT_IDS.length) fail(`home JSON-LD needs ${PRODUCT_IDS.length} SoftwareApplication nodes (found ${apps})`);
  }

  const text = visibleText(page.html);

  for (const faqPage of nodes.filter((node) => node['@type'] === 'FAQPage')) {
    const questions = (faqPage.mainEntity as { name?: string }[] | undefined) ?? [];

    for (const question of questions) {
      if (!question.name || !text.includes(normalizeText(question.name))) {
        fail(`FAQPage question is not visible on the page: "${question.name}"`);
      }
    }
  }

  const expectedFaq = page.route.id === 'faq' ? FAMILY_FAQ.length : page.route.id === 'home' ? 0 : PRODUCTS[page.route.id].faq.length;
  const faqNode = nodes.find((node) => node['@type'] === 'FAQPage');
  const questionCount = ((faqNode?.mainEntity as unknown[] | undefined) ?? []).length;

  if (expectedFaq > 0 && questionCount !== expectedFaq) fail(`FAQPage has ${questionCount} questions, expected ${expectedFaq}`);
}

function checkUnique(pages: Page[], failures: Failures): void {
  for (const field of ['title', 'description'] as const) {
    const seen = new Map<string, string>();

    for (const page of pages) {
      const previous = seen.get(page[field]);

      if (previous && page[field] !== '') failures.push(`${page.file}: ${field} duplicates ${previous}`);
      seen.set(page[field], page.file);
    }
  }
}

function checkSiteFiles(buildDir: string, failures: Failures): void {
  const fail = (message: string) => failures.push(message);
  const read = (name: string): string | undefined => (existsSync(join(buildDir, name)) ? readText(join(buildDir, name)) : undefined);

  const sitemap = read('sitemap.xml');

  if (sitemap === undefined) {
    fail('sitemap.xml is missing');
  } else {
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expected = ROUTES.map((route) => absoluteUrl(route.path));

    if (JSON.stringify(locs) !== JSON.stringify(expected)) fail(`sitemap.xml lists ${locs.join(', ')}; expected ${expected.join(', ')}`);
  }

  const robots = read('robots.txt');

  if (robots === undefined) {
    fail('robots.txt is missing');
  } else {
    if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail('robots.txt has no Sitemap line');

    for (const agent of ['*', ...AI_CRAWLERS]) {
      if (!robots.includes(`User-agent: ${agent}\n`)) fail(`robots.txt does not list User-agent: ${agent}`);
    }
  }

  const llms = read('llms.txt');

  if (llms === undefined) fail('llms.txt is missing');
  if (read('llms-full.txt') === undefined) fail('llms-full.txt is missing');

  for (const route of ROUTES) {
    const markdown = read(`${route.slug}.md`);

    if (markdown === undefined || markdown.trim() === '') fail(`${route.slug}.md is missing or empty`);
    if (llms !== undefined && !llms.includes(`${SITE_URL}/${route.slug}.md`) && route.id !== 'home')
      fail(`llms.txt does not link ${route.slug}.md`);
  }

  checkStaticAssets(buildDir, fail);
}

function checkStaticAssets(buildDir: string, fail: (message: string) => void): void {
  for (const name of ['favicon.svg', 'site.webmanifest']) {
    if (!existsSync(join(buildDir, name))) fail(`${name} is missing`);
  }

  const sizes: Record<string, number> = { 'apple-touch-icon': 180, 'icon-192': 192, 'icon-512': 512 };

  for (const [name, size] of Object.entries(sizes)) {
    const file = join(buildDir, 'icons', `${name}.png`);

    if (!existsSync(file)) {
      fail(`icons/${name}.png is missing`);
      continue;
    }

    const actual = pngSize(readFileSync(file));

    if (actual.width !== size || actual.height !== size)
      fail(`icons/${name}.png is ${actual.width}x${actual.height}, expected ${size}x${size}`);
  }

  const manifestFile = join(buildDir, 'site.webmanifest');

  if (existsSync(manifestFile)) {
    try {
      const manifest = JSON.parse(readText(manifestFile)) as { icons?: { src: string }[] };

      for (const icon of manifest.icons ?? []) {
        if (!existsSync(join(buildDir, icon.src))) fail(`site.webmanifest icon ${icon.src} does not exist in build/`);
      }
    } catch (error) {
      fail(`site.webmanifest does not parse: ${(error as Error).message}`);
    }
  }
}

function checkCsp(root: string, buildDir: string, failures: Failures): void {
  const cspFile = join(root, '.generated', 'csp.conf');

  if (!existsSync(cspFile)) {
    failures.push('.generated/csp.conf is missing (run bun scripts/gen-csp.ts)');

    return;
  }

  const csp = readText(cspFile);

  for (const route of [...ROUTES.map(htmlFileOf), '404.html']) {
    const file = join(buildDir, route);

    if (!existsSync(file) || !statSync(file).isFile()) continue;

    for (const script of extractInlineScripts(readText(file))) {
      if (!csp.includes(hashScript(script))) failures.push(`${route}: inline script ${hashScript(script)} is not in .generated/csp.conf`);
    }
  }
}

export function auditSeo(root: string): Failures {
  const buildDir = join(root, 'build');
  const failures: Failures = [];
  const pages: Page[] = [];

  for (const route of ROUTES) {
    const page = loadPage(buildDir, route);

    if (!page) {
      failures.push(`${htmlFileOf(route)} is missing from build/`);
      continue;
    }

    const fail = (message: string) => failures.push(`${page.file}: ${message}`);

    pages.push(page);
    checkHead(page, buildDir, fail);
    checkStructure(page, fail);
    checkJsonLd(page, fail);
  }

  checkUnique(pages, failures);
  checkSiteFiles(buildDir, failures);
  checkCsp(root, buildDir, failures);

  return failures;
}

if (import.meta.main) {
  const failures = auditSeo(resolve(import.meta.dir, '..', '..'));

  if (failures.length > 0) {
    console.error(`audit:seo: ${failures.length} failure(s)\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
    process.exit(1);
  }

  console.log('audit:seo: ok');
}
