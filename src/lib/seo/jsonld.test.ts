import { describe, expect, test } from 'bun:test';
import { absoluteUrl, PRODUCT_IDS, REPOS, ROUTES, SITE_URL } from '$lib/config/site';
import { FAMILY_FAQ } from '$lib/content/faq';
import { PRODUCTS } from '$lib/content/products';
import { organization, pageGraph, serialize, website, type JsonLd } from './jsonld';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = Record<string, any>;

/** Every node of the graph, including nodes nested in other nodes' properties. */
function allNodes(value: unknown, found: Node[] = []): Node[] {
  if (Array.isArray(value)) {
    value.forEach((item) => allNodes(item, found));
  } else if (value && typeof value === 'object') {
    found.push(value as Node);
    Object.values(value).forEach((item) => allNodes(item, found));
  }

  return found;
}

const ofType = (graph: JsonLd, type: string): Node[] => allNodes(graph).filter((node) => node['@type'] === type);

const topLevel = (graph: JsonLd): Node[] => graph['@graph'] as Node[];

describe('serialize', () => {
  test('escapes < so a script tag can never be closed from inside the data', () => {
    const output = serialize({ text: '</script><script>alert(1)</script>' });

    expect(output).not.toContain('<');
    expect(output).toContain('\\u003c/script>');
    expect(JSON.parse(output).text).toBe('</script><script>alert(1)</script>');
  });

  test('round-trips ordinary data', () => {
    const data = { a: [1, 'two', { three: true }] };

    expect(JSON.parse(serialize(data))).toEqual(data);
  });
});

describe('organization and website', () => {
  test('the organization names the family, its logo and every repository', () => {
    const org = organization() as Node;

    expect(org.name).toBe('Harness Useful');
    expect(org.url).toBe(SITE_URL);
    expect(org.logo.url).toBe(`${SITE_URL}/icons/icon-512.png`);
    expect(org.founder).toMatchObject({ '@type': 'Person', name: 'Maciej Spiechowicz' });

    for (const id of PRODUCT_IDS) {
      expect(org.sameAs).toContain(REPOS[id]);
    }
  });

  test('the website is English and refers to the publisher by @id', () => {
    const site = website() as Node;

    expect(site.inLanguage).toBe('en');
    expect(site.publisher).toEqual({ '@id': organization()['@id'] });
  });
});

describe('pageGraph', () => {
  const graphs = ROUTES.map((route) => ({ route, graph: pageGraph(route.id) }));

  test('every page is one @graph with schema.org context and a unique @id per node', () => {
    for (const { graph } of graphs) {
      expect(graph['@context']).toBe('https://schema.org');

      const ids = topLevel(graph).map((node) => node['@id']);

      expect(ids.every((id) => typeof id === 'string')).toBe(true);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  test('every page has Organization, WebSite, WebPage and BreadcrumbList', () => {
    for (const { route, graph } of graphs) {
      const types = topLevel(graph).map((node) => node['@type']);

      expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'WebPage', 'BreadcrumbList']));

      const page = topLevel(graph).find((node) => node['@type'] === 'WebPage') as Node;
      const canonical = absoluteUrl(route.path);

      expect(page['@id']).toBe(`${canonical}#webpage`);
      expect(page.url).toBe(canonical);
      expect(page.inLanguage).toBe('en');
      expect(page.isPartOf).toEqual({ '@id': `${SITE_URL}/#website` });
      expect(page.primaryImageOfPage.url).toBe(`${SITE_URL}/og/${route.slug}.png`);
    }
  });

  test('@ids are stable between calls', () => {
    for (const route of ROUTES) {
      const first = topLevel(pageGraph(route.id)).map((node) => node['@id']);
      const second = topLevel(pageGraph(route.id)).map((node) => node['@id']);

      expect(second).toEqual(first);
    }
  });

  test('breadcrumbs start at the home page and end at the page itself', () => {
    for (const { route, graph } of graphs) {
      const crumbs = ofType(graph, 'BreadcrumbList')[0].itemListElement as Node[];

      expect(crumbs[0].item).toBe(`${SITE_URL}/`);
      expect(crumbs[crumbs.length - 1].item).toBe(absoluteUrl(route.path));
      expect(crumbs.map((crumb) => crumb.position)).toEqual(crumbs.map((_, index) => index + 1));
    }
  });

  test('the home page lists the four software applications and the three tours', () => {
    const graph = pageGraph('home');
    const list = ofType(graph, 'ItemList')[0];

    expect(list.itemListElement).toHaveLength(4);
    expect(ofType(graph, 'SoftwareApplication').map((app) => app.name)).toEqual(PRODUCT_IDS.map((id) => PRODUCTS[id].name));
    expect(ofType(graph, 'VideoObject')).toHaveLength(3);
    expect(ofType(graph, 'FAQPage')).toHaveLength(0);
  });

  test('the faq page has one FAQPage with every family question', () => {
    const pages = ofType(pageGraph('faq'), 'FAQPage');

    expect(pages).toHaveLength(1);
    expect(pages[0].mainEntity.map((question: Node) => question.name)).toEqual(FAMILY_FAQ.map((faq) => faq.q));
  });
});

describe.each(PRODUCT_IDS)('product page: %s', (id: (typeof PRODUCT_IDS)[number]) => {
  const product = PRODUCTS[id];
  const graph = pageGraph(id);
  const canonical = absoluteUrl(`/${id}`);

  test('SoftwareApplication is free, licensed by SPDX URL and links the release and the page', () => {
    const [app] = ofType(graph, 'SoftwareApplication');

    expect(app['@id']).toBe(`${canonical}#software`);
    expect(app.name).toBe(product.name);
    expect(app.description).toBe(product.definition);
    expect(app.applicationCategory).toBe('DeveloperApplication');
    expect(app.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'USD' });
    expect(app.isAccessibleForFree).toBe(true);
    expect(app.license).toBe(`https://spdx.org/licenses/${product.license}.html`);
    expect(app.url).toBe(canonical);
    expect(app.downloadUrl).toBe(product.releases);
    expect(app.operatingSystem).toBe(product.platforms.join(', '));
    expect(app.featureList).toEqual(product.features.map((feature) => feature.title));
    expect(app.author.name).toBe('Maciej Spiechowicz');
    expect(app.publisher).toEqual({ '@id': `${SITE_URL}/#organization` });
    expect(app.image).toBe(`${SITE_URL}/og/${id}.png`);
  });

  test('SoftwareSourceCode points at the repository', () => {
    const [code] = ofType(graph, 'SoftwareSourceCode');

    expect(code.codeRepository).toBe(REPOS[id]);
    expect(code.license).toBe(`https://spdx.org/licenses/${product.license}.html`);
  });

  test('HowTo has one step per install command, with the command as text', () => {
    const [howTo] = ofType(graph, 'HowTo');

    expect(howTo.name).toBe(`How to install ${product.name}`);
    expect(howTo.step.map((step: Node) => step.text)).toEqual(product.install.map((step) => step.command));
  });

  test('FAQPage carries exactly the product FAQ', () => {
    const pages = ofType(graph, 'FAQPage');

    expect(pages).toHaveLength(1);
    expect(pages[0].mainEntity).toHaveLength(product.faq.length);
    expect(pages[0].mainEntity[0].acceptedAnswer.text).toBe(product.faq[0].a);
  });

  test('VideoObject appears exactly when the product has a tour', () => {
    const videos = ofType(graph, 'VideoObject');

    if (!product.video) {
      expect(videos).toHaveLength(0);

      return;
    }

    expect(videos).toHaveLength(1);
    expect(videos[0].contentUrl).toBe(`${SITE_URL}${product.video.src}`);
    expect(videos[0].thumbnailUrl).toBe(`${SITE_URL}${product.video.poster}`);
    expect(videos[0].uploadDate).toBe(product.video.uploadDate);
  });

  test('serialized graph survives parsing and contains no raw "<"', () => {
    const output = serialize(graph);

    expect(output).not.toContain('<');
    expect(JSON.parse(output)['@graph']).toHaveLength(topLevel(graph).length);
  });
});
