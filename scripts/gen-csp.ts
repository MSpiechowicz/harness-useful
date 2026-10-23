// Generates .generated/csp.conf: an nginx include with the Content-Security-Policy header.
// Every inline <script> in build/**/*.html (except JSON-LD data blocks) is allowed by its sha256 hash,
// so the policy needs no 'unsafe-inline' for scripts. Idempotent: rerunning rewrites the same file.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const SCRIPT_PATTERN = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const SRC_ATTRIBUTE = /(?:^|\s)src(?:\s*=|\s|$)/i;
const TYPE_ATTRIBUTE = /(?:^|\s)type\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;

/** Text of every executable inline script: no src attribute, not a JSON-LD block, not empty. */
export function extractInlineScripts(html: string): string[] {
  const scripts: string[] = [];

  for (const match of html.matchAll(SCRIPT_PATTERN)) {
    const attributes = match[1] ?? '';
    const content = match[2] ?? '';

    if (SRC_ATTRIBUTE.test(attributes)) continue;

    const typeMatch = TYPE_ATTRIBUTE.exec(attributes);
    const type = (typeMatch?.[1] ?? typeMatch?.[2] ?? typeMatch?.[3] ?? '').trim().toLowerCase();
    if (type === 'application/ld+json') continue;

    if (content.trim() === '') continue;

    scripts.push(content);
  }

  return scripts;
}

/** CSP source expression for a script body, e.g. 'sha256-<base64>'. */
export function hashScript(content: string): string {
  return `'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`;
}

/** Full policy; hashes are de-duplicated and sorted so the output is deterministic. */
export function buildPolicy(hashes: string[]): string {
  const scriptSources = ["'self'", ...[...new Set(hashes)].sort()].join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "media-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export function buildConfig(policy: string): string {
  return `add_header Content-Security-Policy "${policy}" always;\n`;
}

function findHtmlFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter((entry) => entry.endsWith('.html'))
    .sort()
    .map((entry) => join(directory, entry));
}

function main(): void {
  const root = resolve(import.meta.dir, '..');
  const buildDir = join(root, 'build');
  const outputFile = join(root, '.generated', 'csp.conf');

  if (!existsSync(buildDir)) {
    console.error(`gen-csp: ${buildDir} not found; run the build first.`);
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(buildDir);
  if (htmlFiles.length === 0) {
    console.error(`gen-csp: no .html files under ${buildDir}.`);
    process.exit(1);
  }

  const hashes = htmlFiles.flatMap((file) => extractInlineScripts(readFileSync(file, 'utf8')).map(hashScript));
  const policy = buildPolicy(hashes);

  mkdirSync(dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, buildConfig(policy));

  console.log(`gen-csp: ${new Set(hashes).size} unique inline script hash(es) from ${htmlFiles.length} page(s) -> ${outputFile}`);
}

if (import.meta.main) main();
