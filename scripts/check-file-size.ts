// Guard: every authored code file must stay within MAX_LINES lines.
// Run with `bun scripts/check-file-size.ts` (part of `bun run guard`).
import { extensionOf, failWith, listFiles, matchesAny, readText } from './git-files';

const MAX_LINES = 500;

const CODE_EXTENSIONS = new Set(['.ts', '.js', '.mjs', '.cjs', '.svelte', '.css', '.html', '.sh', '.yml', '.yaml', '.conf', '.json']);

// Lockfiles, changelog, vendored assets and static files are not authored code.
const EXCLUDED = [
  'bun.lock',
  'CHANGELOG.md',
  // Optimised image sources and public static files are not authored code.
  'src/lib/assets/**',
  'static/**',
];

function countLines(text: string): number {
  if (text === '') {
    return 0;
  }

  const newlines = text.split('\n').length - 1;
  return text.endsWith('\n') ? newlines : newlines + 1;
}

const offenders: string[] = [];

for (const path of listFiles()) {
  if (!CODE_EXTENSIONS.has(extensionOf(path)) || matchesAny(path, EXCLUDED)) {
    continue;
  }

  const lines = countLines(readText(path));
  if (lines > MAX_LINES) {
    offenders.push(`${path}: ${lines} lines`);
  }
}

if (offenders.length > 0) {
  failWith(`check-file-size: ${offenders.length} file(s) exceed ${MAX_LINES} lines`, offenders);
}

console.log(`check-file-size: ok (limit ${MAX_LINES} lines)`);
