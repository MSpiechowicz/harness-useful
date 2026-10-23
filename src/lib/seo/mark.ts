// The Harness "H" mark, geometry copied from the approved board (TerminalStory.dc.html) and from
// src/lib/components/layout/Logo.svelte. Used by the favicon, the PNG icons and the Open Graph cards.
import type { GradientPair } from './types';

/** viewBox of the mark: x y width height. */
export const MARK_VIEWBOX = '10 14 100 86';
export const MARK_ASPECT = 86 / 100;

const MARK_SHAPES =
  '<path d="M18 20 H33 V50 H58 V20 H73 V64 H33 V94 H18 Z" transform="rotate(7 33 94)"/>' +
  '<path d="M58 64 H73 V94 H58 Z" transform="rotate(90 73 94)"/>';

/** Standalone SVG of the mark filled with a bottom-to-top gradient. */
export function markSvg(gradient: GradientPair, width: number): string {
  const height = Math.round(width * MARK_ASPECT);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" width="${width}" height="${height}">` +
    `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="94" x2="0" y2="20">` +
    `<stop offset="0" stop-color="${gradient[0]}"/><stop offset="1" stop-color="${gradient[1]}"/>` +
    `</linearGradient></defs><g fill="url(#g)">${MARK_SHAPES}</g></svg>`
  );
}

/**
 * The mark on a graphite tile (#232327 to #101012, diagonal) as a square SVG.
 * `rounded: false` gives a full-bleed square (iOS applies its own mask to the touch icon).
 */
export function iconTileSvg(size: number, rounded = true): string {
  const radius = rounded ? Math.round(size * 0.22) : 0;
  const markWidth = Math.round(size * 0.62);
  const markHeight = Math.round(markWidth * MARK_ASPECT);
  const left = Math.round((size - markWidth) / 2);
  const top = Math.round((size - markHeight) / 2);
  const mark = markSvg(['#2DD4A8', '#5EB3FF'], markWidth).replace('<svg ', `<svg x="${left}" y="${top}" `);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<defs><linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#232327"/><stop offset="1" stop-color="#101012"/></linearGradient></defs>` +
    `<rect width="${size}" height="${size}" rx="${radius}" fill="url(#tile)"/>${mark}</svg>`
  );
}
