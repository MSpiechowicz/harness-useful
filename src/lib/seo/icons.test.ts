import { describe, expect, test } from 'bun:test';
import { ICON_NAMES, ICON_SIZES, isIconName, renderNamedIcon } from './icons';
import { pngSize } from './png-size';

describe('icons', () => {
  test('exposes the touch icon (180) and the 192 and 512 manifest icons', () => {
    expect(ICON_SIZES).toEqual({ 'apple-touch-icon': 180, 'icon-192': 192, 'icon-512': 512 });
    expect(isIconName('icon-512')).toBe(true);
    expect(isIconName('icon-1024')).toBe(false);
  });

  test.each(ICON_NAMES)('%s renders a square PNG of its size', async (name) => {
    const png = await renderNamedIcon(name);
    const size = ICON_SIZES[name];

    expect(pngSize(png)).toEqual({ width: size, height: size });
  });
});
