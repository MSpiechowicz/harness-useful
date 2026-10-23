// JSON-LD builders. Pure functions; every page gets one @graph with stable @ids from pageGraph().
import { absoluteUrl, AUTHOR, ORG, PRODUCT_IDS, REPOS, ROUTES, SITE_NAME, SITE_URL, type RouteId } from '$lib/config/site';
import { FAMILY_FAQ } from '$lib/content/faq';
import { PAGES } from '$lib/content/pages';
import { PRODUCTS } from '$lib/content/products';
import type { Faq, Product } from '$lib/content/types';
import { OG_HEIGHT, OG_WIDTH, ogImageUrl } from './meta';

export type JsonLd = Record<string, unknown>;

/** Serializes JSON-LD for an inline script: `<` is escaped so `</script>` can never close the tag. */
export function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const ICON_512 = `${SITE_URL}/icons/icon-512.png`;

const idOf = (path: string, fragment: string): string => `${absoluteUrl(path)}#${fragment}`;

function routePath(id: RouteId): string {
  const route = ROUTES.find((entry) => entry.id === id);

  if (!route) {
    throw new Error(`Unknown route: ${id}`);
  }

  return route.path;
}

const person = (): JsonLd => ({ '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url });

const publisherRef = (): JsonLd => ({ '@id': ORGANIZATION_ID });

const absoluteAsset = (path: string): string => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

const spdxUrl = (license: string): string => `https://spdx.org/licenses/${license}.html`;

export function organization(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORG.name,
    url: ORG.url,
    logo: { '@type': 'ImageObject', url: ICON_512, width: 512, height: 512 },
    sameAs: [ORG.github, ...PRODUCT_IDS.map((id) => REPOS[id])],
    founder: person(),
  };
}

export function website(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: 'en',
    publisher: publisherRef(),
  };
}

export function breadcrumbList(id: RouteId): JsonLd {
  const page = PAGES[id];

  return {
    '@type': 'BreadcrumbList',
    '@id': idOf(page.path, 'breadcrumb'),
    itemListElement: page.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** The entity a page is about: the product for product pages, the FAQPage for /faq, nothing for home. */
function mainEntityOf(id: RouteId): JsonLd | undefined {
  if (id === 'home') {
    return undefined;
  }

  return { '@id': idOf(routePath(id), id === 'faq' ? 'faq' : 'software') };
}

export function webPage(id: RouteId): JsonLd {
  const page = PAGES[id];
  const mainEntity = mainEntityOf(id);

  return {
    '@type': 'WebPage',
    '@id': idOf(page.path, 'webpage'),
    url: absoluteUrl(page.path),
    name: page.title,
    description: page.description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    breadcrumb: { '@id': idOf(page.path, 'breadcrumb') },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl(page.slug), width: OG_WIDTH, height: OG_HEIGHT },
    ...(mainEntity ? { mainEntity } : {}),
  };
}

export function softwareApplication(product: Product): JsonLd {
  const path = routePath(product.id);
  const page = PAGES[product.id];

  return {
    '@type': 'SoftwareApplication',
    '@id': idOf(path, 'software'),
    name: product.name,
    description: product.definition,
    url: absoluteUrl(path),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: product.platforms.join(', '),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
    license: spdxUrl(product.license),
    downloadUrl: product.releases,
    softwareHelp: { '@type': 'CreativeWork', url: `${product.repo}#readme` },
    featureList: product.features.map((feature) => feature.title),
    image: ogImageUrl(page.slug),
    author: person(),
    publisher: publisherRef(),
    ...(product.video ? { video: { '@id': idOf(path, 'video') } } : {}),
  };
}

export function softwareSourceCode(product: Product): JsonLd {
  const path = routePath(product.id);

  return {
    '@type': 'SoftwareSourceCode',
    '@id': idOf(path, 'sourcecode'),
    name: `${product.name} source code`,
    codeRepository: product.repo,
    license: spdxUrl(product.license),
    author: person(),
    about: { '@id': idOf(path, 'software') },
  };
}

export function howTo(product: Product): JsonLd {
  const path = routePath(product.id);

  return {
    '@type': 'HowTo',
    '@id': idOf(path, 'howto'),
    name: `How to install ${product.name}`,
    step: product.install.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.label,
      text: step.command,
    })),
  };
}

export function faqPage(faqs: Faq[], path: string): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': idOf(path, 'faq'),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function itemList(products: Product[]): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': idOf('/', 'products'),
    name: 'Harness Useful products',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: softwareApplication(product),
    })),
  };
}

/** VideoObject of a product's tour; null when the product has no video. */
export function videoObject(product: Product): JsonLd | null {
  const video = product.video;

  if (!video) {
    return null;
  }

  return {
    '@type': 'VideoObject',
    '@id': idOf(routePath(product.id), 'video'),
    name: video.title,
    description: video.description,
    thumbnailUrl: absoluteAsset(video.poster),
    contentUrl: absoluteAsset(video.src),
    uploadDate: video.uploadDate,
    ...(video.duration ? { duration: video.duration } : {}),
  };
}

function withoutNulls(nodes: (JsonLd | null)[]): JsonLd[] {
  return nodes.filter((node): node is JsonLd => node !== null);
}

/** The full JSON-LD document (one @graph) for a route. */
export function pageGraph(id: RouteId): JsonLd {
  const nodes: (JsonLd | null)[] = [organization(), website(), webPage(id), breadcrumbList(id)];

  if (id === 'home') {
    const products = PRODUCT_IDS.map((productId) => PRODUCTS[productId]);

    nodes.push(itemList(products), ...products.map(videoObject));
  } else if (id === 'faq') {
    nodes.push(faqPage(FAMILY_FAQ, PAGES.faq.path));
  } else {
    const product = PRODUCTS[id];

    nodes.push(
      softwareApplication(product),
      softwareSourceCode(product),
      howTo(product),
      faqPage(product.faq, PAGES[id].path),
      videoObject(product),
    );
  }

  return { '@context': 'https://schema.org', '@graph': withoutNulls(nodes) };
}
