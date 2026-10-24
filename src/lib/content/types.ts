// Shared content shapes. Data lives in sibling files; keep these generic.
import type { ProductId } from '$lib/config/site';

export interface Breadcrumb {
  name: string;
  path: string;
}

/** Per-page SEO metadata. `path` is the site path, `slug` the artifact slug ('index' for home). */
export interface PageMeta {
  title: string;
  description: string;
  path: string;
  slug: string;
  ogTitle?: string;
  ogDescription?: string;
  breadcrumbs: Breadcrumb[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface InstallStep {
  /** 'macos-linux', 'windows' or any other platform key. */
  platform: 'macos-linux' | 'windows' | (string & {});
  label: string;
  command: string;
}

/** One harness or tool row of a product page. `support` is the plain sentence (Markdown twin, SEO); the optional
 *  fields let the page show it as a card with a status badge, the working features as tags and a short note. */
export interface HarnessEntry {
  name: string;
  support: string;
  status?: 'Supported' | 'Partly supported';
  works?: string[];
  note?: string;
}

export interface ProductVideo {
  src: string;
  poster: string;
  title: string;
  description: string;
  /** ISO 8601 date. */
  uploadDate: string;
  /** ISO 8601 duration, e.g. PT1M30S. */
  duration?: string;
}

export interface Product {
  id: ProductId;
  name: string;
  tagline: string;
  /** One-sentence definition (answer-first lead). */
  definition: string;
  features: { title: string; text: string }[];
  harnesses: HarnessEntry[];
  platforms: string[];
  install: InstallStep[];
  privacy: string[];
  /** Overrides the default "Is it private? Where does my data live?" heading when the privacy copy covers something else. */
  privacyHeading?: string;
  /** SPDX license identifier. */
  license: string;
  repo: string;
  releases: string;
  video?: ProductVideo;
  faq: Faq[];
  /** Accent color (hex). */
  color: string;
}

/** One hop of the "life of a prompt" list. */
export interface Hop {
  link: number;
  t: string;
  s: string;
  title: string;
  body: string;
  benefit: string;
}

/** A captioned screenshot. */
export interface Shot {
  img: string;
  cap: string;
  alt: string;
}

/** One before/after row of the "git diff --stat your-workflow" section. */
export interface DiffRow {
  before: string;
  after: string;
  tool: ProductId;
  color: string;
}

/** A homepage product block (text parts only; demos live in components). */
export interface ProductBlock {
  id: Exclude<ProductId, 'dashboard'>;
  tag: string;
  color: string;
  /** CSS gradient of the block's vertical accent bar. */
  grad: string;
  href: string;
  note: string;
  title: string;
  lead: string;
  bullets: { h: string; p: string }[];
  shots: Shot[];
}

/** One tab of the dashboard showcase: either a screenshot or the looping network video. */
export interface DashboardTab {
  label: string;
  sub: string;
  img?: string;
  alt: string;
  video?: { src: string; poster: string };
}

/** A node of the "life of a prompt" network. */
export interface NetNode {
  key: 'you' | 'desktop' | 'cli' | 'skills' | 'memory' | 'dashboard';
  name: string;
  sub: string;
}

/** A card in the "Where your data lives" section. */
export interface DataCard {
  tool: ProductId | 'cli';
  name: string;
  path: string;
  text: string;
}

/** An outbound connection in the "Where your data lives" section. */
export interface DataConnection {
  name: string;
  text: string;
}

export interface Tour {
  id: Exclude<ProductId, 'memory'>;
  caption: string;
}

/** One row of the "Which tool do I need?" comparison table. */
export interface CompareRow {
  id: ProductId;
  name: string;
  what: string;
  runsAs: string;
  platforms: string;
  worksWith: string;
  dataLives: string;
  license: string;
}
