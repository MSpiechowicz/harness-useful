// Link audit: every internal href/src/srcset/poster and every #fragment in build/**/*.html must resolve to a file in
// build/ (pages are extensionless, so /x also matches x.html). Run through scripts/verify-build.ts or on its own.
import { existsSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { SITE_URL } from '../../src/lib/config/site';
import { collectIds, findHtmlFiles, parseAttributes, readText, withoutCode } from './html';

const URL_ATTRIBUTES = ['href', 'src', 'poster', 'data-src'] as const;
const SKIPPED_SCHEMES = /^(?:mailto:|tel:|data:|javascript:|blob:|about:)/i;
const ORIGIN = new URL(SITE_URL).origin;

// An `_app/` reached as `./_app/`, `../_app/` or a bare `_app/` is a relative asset URL. nginx serves 404.html at any missing
// nested URL, where those resolve against the wrong directory. Needs kit.paths.relative: false in svelte.config.js.
const RELATIVE_APP_URL = /(?:\.{1,2}\/|(?<![\w/.-]))_app\//;

interface Reference {
  attribute: string;
  value: string;
}

/** Every URL-bearing attribute value of the page, with srcset split into its candidates. */
export function collectReferences(html: string): Reference[] {
  const references: Reference[] = [];

  for (const match of withoutCode(html).matchAll(/<[a-z][^>]*>/gi)) {
    const attributes = parseAttributes(match[0].replace(/^<[a-z0-9-]+/i, ''));

    for (const attribute of URL_ATTRIBUTES) {
      if (attributes[attribute] !== undefined) {
        references.push({ attribute, value: attributes[attribute] });
      }
    }

    for (const name of ['srcset', 'imagesrcset']) {
      for (const candidate of (attributes[name] ?? '').split(',')) {
        const url = candidate.trim().split(/\s+/)[0];

        if (url) references.push({ attribute: name, value: url });
      }
    }
  }

  return references;
}

/** Public URL a built file is served at: index.html is '/', desktop.html is '/desktop'. */
export function servedPath(buildDir: string, file: string): string {
  const path = relative(buildDir, file).split('\\').join('/');

  if (path === 'index.html') return '/';
  if (path.endsWith('/index.html')) return `/${path.slice(0, -'/index.html'.length)}`;

  return `/${path.replace(/\.html$/, '')}`;
}

/** The file in build/ that serves a URL path, mirroring nginx's `try_files $uri $uri.html $uri/index.html`. */
export function resolveFile(buildDir: string, pathname: string): string | undefined {
  const decoded = decodeURIComponent(pathname).replace(/\/+$/, '') || '/';
  const base = join(buildDir, decoded);
  const candidates = decoded === '/' ? [join(buildDir, 'index.html')] : [base, `${base}.html`, join(base, 'index.html')];

  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

function isInternal(url: URL): boolean {
  return url.origin === ORIGIN;
}

export function auditLinks(buildDir: string): string[] {
  const failures: string[] = [];
  const files = findHtmlFiles(buildDir);
  const idCache = new Map<string, Set<string>>();

  const idsOf = (file: string): Set<string> => {
    let ids = idCache.get(file);

    if (!ids) {
      ids = collectIds(readText(file));
      idCache.set(file, ids);
    }

    return ids;
  };

  if (files.length === 0) {
    return [`links: no .html files found in ${buildDir}`];
  }

  for (const file of files) {
    const name = relative(buildDir, file);
    const base = new URL(servedPath(buildDir, file), `${ORIGIN}/`);

    const html = readText(file);

    if (RELATIVE_APP_URL.test(html)) {
      failures.push(`${name}: references _app/ with a relative URL; asset URLs must be root-absolute (/_app/...)`);
    }

    for (const { attribute, value } of collectReferences(html)) {
      const raw = value.trim();

      if (raw === '' || SKIPPED_SCHEMES.test(raw)) continue;

      let url: URL;

      try {
        url = new URL(raw, base);
      } catch {
        failures.push(`${name}: ${attribute}="${raw}" is not a valid URL`);
        continue;
      }

      if (!isInternal(url)) continue;

      const target = resolveFile(buildDir, url.pathname);

      if (!target) {
        failures.push(`${name}: ${attribute}="${raw}" does not resolve to a file in build/`);
        continue;
      }

      const fragment = decodeURIComponent(url.hash.slice(1));

      if (fragment !== '' && fragment !== 'top' && target.endsWith('.html') && !idsOf(target).has(fragment)) {
        failures.push(`${name}: ${attribute}="${raw}" points to #${fragment}, which does not exist in ${relative(buildDir, target)}`);
      }
    }
  }

  return failures;
}

if (import.meta.main) {
  const buildDir = resolve(import.meta.dir, '..', '..', 'build');
  const failures = auditLinks(buildDir);

  if (failures.length > 0) {
    console.error(`audit:links: ${failures.length} failure(s)\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
    process.exit(1);
  }

  console.log('audit:links: ok');
}
