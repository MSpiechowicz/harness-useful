// Verifies build/: link integrity and the SEO/CSP audit. Exits non-zero when any check fails.
// html-validate runs separately (see the verify:build script in package.json).
import { resolve } from 'node:path';
import { auditLinks } from './audit/links';
import { auditSeo } from './audit/seo';

const root = resolve(import.meta.dir, '..');

const checks: { name: string; run: () => string[] }[] = [
  { name: 'links', run: () => auditLinks(resolve(root, 'build')) },
  { name: 'seo', run: () => auditSeo(root) },
];

let failed = 0;

for (const check of checks) {
  const failures = check.run();

  if (failures.length === 0) {
    console.log(`verify-build: ${check.name} ok`);
    continue;
  }

  failed += failures.length;
  console.error(`verify-build: ${check.name} found ${failures.length} problem(s)`);

  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
}

if (failed > 0) {
  console.error(`verify-build: FAILED with ${failed} problem(s)`);
  process.exit(1);
}

console.log('verify-build: all checks passed');
