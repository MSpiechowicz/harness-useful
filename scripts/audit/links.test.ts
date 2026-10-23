import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { auditLinks, collectReferences, servedPath } from './links';

let buildDir: string;

function write(path: string, content = ''): void {
  const file = join(buildDir, path);

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

beforeEach(() => {
  buildDir = mkdtempSync(join(tmpdir(), 'audit-links-'));
});

afterEach(() => {
  rmSync(buildDir, { recursive: true, force: true });
});

describe('collectReferences', () => {
  test('finds href, src, poster and every srcset candidate, but not script bodies', () => {
    const html =
      '<a href="/a">x</a><img src="/b.webp" srcset="/c.webp 640w, /d.webp 1280w"><video poster="/e.webp"></video>' +
      '<script>const t = "<a href=\'/ignored\'>";</script>';

    expect(collectReferences(html).map((reference) => reference.value)).toEqual(['/a', '/b.webp', '/c.webp', '/d.webp', '/e.webp']);
  });
});

describe('servedPath', () => {
  test('maps built files to their public URL paths', () => {
    expect(servedPath(buildDir, join(buildDir, 'index.html'))).toBe('/');
    expect(servedPath(buildDir, join(buildDir, 'desktop.html'))).toBe('/desktop');
    expect(servedPath(buildDir, join(buildDir, 'docs', 'index.html'))).toBe('/docs');
  });
});

describe('auditLinks', () => {
  test('accepts extensionless pages, assets, markdown twins, same-page and cross-page anchors', () => {
    write(
      'index.html',
      '<h2 id="install"></h2><a href="#install">i</a><a href="/desktop#faq">d</a><a href="./desktop.md">m</a><img src="/og/index.png">',
    );
    write('desktop.html', '<h2 id="faq"></h2><a href="/">home</a><link rel="canonical" href="https://harness-useful.com/desktop">');
    write('desktop.md', '# x');
    write('og/index.png', 'png');

    expect(auditLinks(buildDir)).toEqual([]);
  });

  test('reports missing files, missing anchors and unresolved srcset candidates', () => {
    write('index.html', '<a href="#nope">a</a><a href="/missing">b</a><a href="/desktop#gone">c</a><img srcset="/x.webp 1x">');
    write('desktop.html', '<a href="/index.md">m</a>');

    const failures = auditLinks(buildDir);

    expect(failures).toHaveLength(5);
    expect(failures.join('\n')).toContain('#nope');
    expect(failures.join('\n')).toContain('"/missing"');
    expect(failures.join('\n')).toContain('#gone');
    expect(failures.join('\n')).toContain('"/x.webp"');
    expect(failures.join('\n')).toContain('"/index.md"');
  });

  test('ignores external, mailto and data URLs', () => {
    write('index.html', '<a href="https://github.com/x">g</a><a href="mailto:a@b.c">m</a><img src="data:image/png;base64,AAAA">');

    expect(auditLinks(buildDir)).toEqual([]);
  });

  test('accepts root-absolute _app URLs in attributes and inline scripts', () => {
    write('index.html', '<link href="/_app/immutable/a.css"><script>import("/_app/immutable/entry/start.js")</script>');
    write('_app/immutable/a.css', 'css');
    write('_app/immutable/entry/start.js', 'js');

    expect(auditLinks(buildDir)).toEqual([]);
  });

  test('fails on relative _app URLs, which break on the 404 page served at nested URLs', () => {
    write('404.html', '<script>import("./_app/immutable/entry/start.js")</script>');
    write('index.html', '<link href="./_app/immutable/a.css">');
    write('_app/immutable/a.css', 'css');
    write('_app/immutable/entry/start.js', 'js');

    const failures = auditLinks(buildDir);

    expect(failures).toHaveLength(2);
    expect(failures.join('\n')).toContain('404.html: references _app/ with a relative URL');
    expect(failures.join('\n')).toContain('index.html: references _app/ with a relative URL');
  });

  test('fails when there are no pages at all', () => {
    expect(auditLinks(buildDir)).toHaveLength(1);
  });
});
