// Small, dependency-free HTML helpers shared by the build audits. The input is SvelteKit's prerendered output,
// which is regular enough for attribute and tag scanning without a full parser.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Attributes = Record<string, string>;

const ATTRIBUTE_PATTERN = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  rsquo: '’',
  lsquo: '‘',
  rarr: '→',
  larr: '←',
  middot: '·',
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith('#')) {
      return String.fromCodePoint(parseInt(entity.slice(1), 10));
    }

    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/** Parses the attribute text of an opening tag (everything after the tag name). */
export function parseAttributes(source: string): Attributes {
  const attributes: Attributes = {};

  for (const match of source.matchAll(ATTRIBUTE_PATTERN)) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';

    attributes[name] = decodeEntities(value);
  }

  return attributes;
}

/** Attributes of every opening tag with the given name. */
export function findTags(html: string, tagName: string): Attributes[] {
  const pattern = new RegExp(`<${tagName}(?=[\\s/>])([^>]*)>`, 'gi');

  return [...html.matchAll(pattern)].map((match) => parseAttributes(match[1]));
}

/** HTML with comments and the bodies of script and style elements removed (opening tags are kept). */
export function withoutCode(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, '$1')
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style\s*>/gi, '$1');
}

/** Visible text of a page: tags, scripts and styles removed, entities decoded, whitespace collapsed. */
export function visibleText(html: string): string {
  const text = withoutCode(html)
    .replace(/<script\b[^>]*>|<style\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  return normalizeText(decodeEntities(text));
}

export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Bodies of every `<script type="application/ld+json">` block. */
export function jsonLdBlocks(html: string): string[] {
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  const blocks: string[] = [];

  for (const match of html.matchAll(pattern)) {
    if (parseAttributes(match[1]).type?.toLowerCase() === 'application/ld+json') {
      blocks.push(match[2]);
    }
  }

  return blocks;
}

/** Every `id` and `name` attribute value in a document. */
export function collectIds(html: string): Set<string> {
  const ids = new Set<string>();

  for (const match of withoutCode(html).matchAll(/<[a-z][^>]*>/gi)) {
    const attributes = parseAttributes(match[0].replace(/^<[a-z0-9-]+/i, ''));

    if (attributes.id) ids.add(attributes.id);
    if (attributes.name) ids.add(attributes.name);
  }

  return ids;
}

/** Absolute paths of every .html file under a directory, sorted. */
export function findHtmlFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter((entry) => entry.endsWith('.html'))
    .sort()
    .map((entry) => join(directory, entry));
}

export const readText = (path: string): string => readFileSync(path, 'utf8');
