import { createHash } from 'node:crypto';
import { describe, expect, test } from 'bun:test';
import { buildConfig, buildPolicy, extractInlineScripts, hashScript } from './gen-csp';

const sha256 = (text: string) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`;

describe('extractInlineScripts', () => {
  test('returns the text of inline scripts, including module scripts', () => {
    const html = '<script>window.a = 1;</script><script type="module">import("/x.js")</script>';

    expect(extractInlineScripts(html)).toEqual(['window.a = 1;', 'import("/x.js")']);
  });

  test('excludes JSON-LD blocks in any quoting or casing', () => {
    const html = [
      '<script type="application/ld+json">{"a":1}</script>',
      '<script type=\'application/ld+json\'>{"b":2}</script>',
      '<script TYPE="Application/LD+JSON">{"c":3}</script>',
      '<script>keep()</script>',
    ].join('');

    expect(extractInlineScripts(html)).toEqual(['keep()']);
  });

  test('excludes scripts with a src attribute and empty scripts', () => {
    const html = '<script src="/a.js"></script><script async src=/b.js></script><script>  </script><script>run()</script>';

    expect(extractInlineScripts(html)).toEqual(['run()']);
  });

  test('keeps whitespace inside the script exactly as written', () => {
    expect(extractInlineScripts('<script>\n  x();\n</script>')).toEqual(['\n  x();\n']);
  });
});

describe('hashScript', () => {
  test('matches a sha256 base64 digest computed with node:crypto', () => {
    const body = 'console.log("hi");';

    expect(hashScript(body)).toBe(sha256(body));
    expect(hashScript('abc')).toBe("'sha256-ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='");
  });
});

describe('buildPolicy', () => {
  test('collapses duplicate hashes and lists each once after self', () => {
    const a = sha256('a');
    const b = sha256('b');
    const policy = buildPolicy([b, a, b, a]);
    const scriptSrc = policy.split('; ').find((directive) => directive.startsWith('script-src '));

    expect(scriptSrc).toBe(`script-src 'self' ${[a, b].sort().join(' ')}`);
  });

  test('contains the full fixed policy and no script unsafe-inline', () => {
    const policy = buildPolicy([]);

    expect(policy).toBe(
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; " +
        "media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; " +
        "frame-ancestors 'none'; upgrade-insecure-requests",
    );
  });
});

describe('buildConfig', () => {
  test('is exactly one add_header line', () => {
    const config = buildConfig(buildPolicy([sha256('a')]));

    expect(config.trimEnd().split('\n')).toHaveLength(1);
    expect(config).toStartWith('add_header Content-Security-Policy "');
    expect(config).toEndWith('" always;\n');
  });
});
