// PNG icons: the H mark on the graphite tile. Served from /icons/<name>.png.
import { iconTileSvg } from './mark';
import { svgToPng } from './png';

export const ICON_SIZES = {
  'apple-touch-icon': 180,
  'icon-192': 192,
  'icon-512': 512,
} as const;

export type IconName = keyof typeof ICON_SIZES;

export const ICON_NAMES = Object.keys(ICON_SIZES) as IconName[];

export function isIconName(name: string): name is IconName {
  return name in ICON_SIZES;
}

/** PNG of the icon tile at the given pixel size. The touch icon is full-bleed; iOS applies its own mask. */
export function renderIcon(size: number, rounded = true): Promise<Buffer> {
  return svgToPng(iconTileSvg(size, rounded), size);
}

export function renderNamedIcon(name: IconName): Promise<Buffer> {
  return renderIcon(ICON_SIZES[name], name !== 'apple-touch-icon');
}
