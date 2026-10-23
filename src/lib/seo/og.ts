// Open Graph cards: 1200x630 PNG in the site look, rendered with satori (layout to SVG) and resvg-wasm (SVG to PNG).
// satori cannot read woff2, so the card uses static TTF instances of Inter and JetBrains Mono kept in ./fonts
// (instanced and latin-subset from @fontsource-variable/inter and @fontsource-variable/jetbrains-mono, SIL OFL 1.1).
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { COLORS, GRADIENTS, ROUTES, SITE_URL, type ProductId, type RouteId } from '$lib/config/site';
import { HERO } from '$lib/content/home';
import { PRODUCTS } from '$lib/content/products';
import { markSvg } from './mark';
import { OG_HEIGHT, OG_WIDTH } from './meta';
import { svgToPng } from './png';
import type { GradientPair } from './types';

export type OgTarget = RouteId | '404';

interface OgCard {
  eyebrow: string;
  title: string;
  description: string;
  gradient: GradientPair;
}

const PRODUCT_IDS_SET = new Set<string>(['desktop', 'skills', 'memory', 'dashboard']);

const isProduct = (target: OgTarget): target is ProductId => PRODUCT_IDS_SET.has(target);

/** The text and gradient printed on the card of a page. */
export function ogCard(target: OgTarget): OgCard {
  if (target === 'home') {
    return {
      eyebrow: 'harness useful',
      title: HERO.h1[0],
      description: HERO.h1[1],
      gradient: GRADIENTS.family,
    };
  }

  if (target === 'faq') {
    return {
      eyebrow: 'harness useful / faq',
      title: 'Harness Useful FAQ',
      description: 'Install, privacy and supported coding agents.',
      gradient: GRADIENTS.family,
    };
  }

  if (target === '404') {
    return {
      eyebrow: 'harness useful / 404',
      title: 'Page not found',
      description: 'Back to the desktop app, skills, memory and usage dashboard.',
      gradient: GRADIENTS.family,
    };
  }

  if (isProduct(target)) {
    const product = PRODUCTS[target];

    return {
      eyebrow: `harness useful / ${target}`,
      title: product.name,
      description: product.tagline,
      gradient: GRADIENTS[target],
    };
  }

  throw new Error(`No Open Graph card for ${target}`);
}

/** Slugs that have a card: every route slug plus '404'. */
export function ogSlugs(): string[] {
  return [...ROUTES.map((route) => route.slug), '404'];
}

/** Maps a card slug ('index' for home) to its target; undefined when no card exists. */
export function targetForSlug(slug: string): OgTarget | undefined {
  if (slug === '404') {
    return '404';
  }

  return ROUTES.find((route) => route.slug === slug)?.id;
}

const FONT_DIR = join(process.cwd(), 'src', 'lib', 'seo', 'fonts');

type SatoriFont = { name: string; data: Buffer; weight: 400 | 500 | 700; style: 'normal' };

let fonts: Promise<SatoriFont[]> | undefined;

function loadFonts(): Promise<SatoriFont[]> {
  if (!fonts) {
    fonts = Promise.all([
      readFile(join(FONT_DIR, 'Inter-400.ttf')),
      readFile(join(FONT_DIR, 'Inter-700.ttf')),
      readFile(join(FONT_DIR, 'JetBrainsMono-500.ttf')),
    ]).then(([regular, bold, mono]) => [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
    ]);
  }

  return fonts;
}

type Style = Record<string, string | number>;
type Node = { type: string; props: { style?: Style; children?: unknown; [key: string]: unknown } };

function el(type: string, style: Style, children?: unknown, extra: Record<string, unknown> = {}): Node {
  return { type, props: { ...extra, style, children } };
}

const MARK_WIDTH = 104;

function markImage(gradient: GradientPair): Node {
  const svg = markSvg(gradient, MARK_WIDTH);
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return el('img', { width: MARK_WIDTH, height: Math.round(MARK_WIDTH * 0.86) }, undefined, {
    src,
    width: MARK_WIDTH,
    height: Math.round(MARK_WIDTH * 0.86),
  });
}

const DOT_TILE = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="1.3" fill="#93A39F" fill-opacity="0.28"/></svg>',
).toString('base64')}`;

/** Subtle dot grid layered over the whole card. */
function dotGrid(): Node {
  return el('div', {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    backgroundImage: `url("${DOT_TILE}")`,
    backgroundSize: '36px 36px',
    backgroundRepeat: 'repeat',
  });
}

function cardTree(card: OgCard): Node {
  const [from, to] = card.gradient;

  const header = el('div', { display: 'flex', alignItems: 'center' }, [
    markImage(card.gradient),
    el(
      'div',
      { display: 'flex', marginLeft: 28, fontFamily: 'JetBrains Mono', fontSize: 30, color: from, letterSpacing: 0.5 },
      card.eyebrow,
    ),
  ]);

  const body = el('div', { display: 'flex', flexDirection: 'column' }, [
    el(
      'div',
      { display: 'flex', fontFamily: 'Inter', fontWeight: 700, fontSize: 88, lineHeight: 1.05, letterSpacing: -2, color: COLORS.you },
      card.title,
    ),
    el('div', { display: 'flex', marginTop: 28, fontFamily: 'Inter', fontSize: 34, lineHeight: 1.3, color: COLORS.disk }, card.description),
  ]);

  const footer = el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
    el('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 28, color: COLORS.disk }, SITE_URL.replace('https://', '')),
    el('div', {
      display: 'flex',
      width: 220,
      height: 6,
      borderRadius: 3,
      backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
    }),
  ]);

  return el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: '64px 72px',
      backgroundColor: '#07090A',
      backgroundImage: `radial-gradient(circle at 92% 6%, ${from}33, transparent 46%)`,
    },
    [dotGrid(), header, body, footer],
  );
}

/** Renders the 1200x630 Open Graph PNG of a page. */
export async function renderOg(target: OgTarget): Promise<Buffer> {
  const svg = await satori(cardTree(ogCard(target)) as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });

  return svgToPng(svg, OG_WIDTH);
}
