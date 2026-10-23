import { describe, expect, test } from 'bun:test';
import { collectIds, decodeEntities, findTags, jsonLdBlocks, parseAttributes, visibleText } from './html';

describe('parseAttributes', () => {
  test('reads double-quoted, single-quoted, unquoted and boolean attributes', () => {
    const attributes = parseAttributes(' href="/a?b=1&amp;c=2" rel=\'canonical\' data-x=y hidden');

    expect(attributes).toEqual({ href: '/a?b=1&c=2', rel: 'canonical', 'data-x': 'y', hidden: '' });
  });
});

describe('findTags', () => {
  test('returns the attributes of every matching tag and ignores longer tag names', () => {
    const tags = findTags('<link rel="icon" href="/a"><linkx rel="no"><link rel="canonical" href="/b"/>', 'link');

    expect(tags.map((tag) => tag.href)).toEqual(['/a', '/b']);
  });
});

describe('visibleText', () => {
  test('drops scripts, styles, comments and tags, decodes entities and collapses whitespace', () => {
    const html = '<p>Is  it&nbsp;free?</p><script>const hidden = "Secret";</script><style>p{}</style><!-- note --><b>Yes &amp; open</b>';

    expect(visibleText(html)).toBe('Is it free? Yes & open');
  });
});

describe('jsonLdBlocks', () => {
  test('returns only JSON-LD script bodies', () => {
    const html = '<script>x()</script><script type="application/ld+json">{"a":1}</script>';

    expect(jsonLdBlocks(html)).toEqual(['{"a":1}']);
  });
});

describe('collectIds', () => {
  test('collects ids and names but not ones inside scripts', () => {
    const html = '<main id="main"><a name="legacy"></a></main><script>"<i id=\'fake\'>"</script>';

    expect([...collectIds(html)].sort()).toEqual(['legacy', 'main']);
  });
});

describe('decodeEntities', () => {
  test('decodes named, decimal and hex entities and leaves unknown ones', () => {
    expect(decodeEntities('&rsquo; &#8211; &#x2192; &unknown;')).toBe('’ – → &unknown;');
  });
});
