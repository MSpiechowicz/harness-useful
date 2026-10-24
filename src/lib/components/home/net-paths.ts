// Geometry of the "life of a prompt" network, ported from the approved board (gen_net2.py output in TerminalStory.dc.html).
// Coordinates are in the 1120 x 560 diagram space. Each direction of a connection has its own lane, so a reply never rides
// the request's line. The order matches NET_ENDS in content/home-net.ts.
import type { NetNode } from '$lib/content/types';

export const NET_WIDTH = 1120;
export const NET_HEIGHT = 560;

export interface NetLink {
  /** SVG path data (cubic Bézier). */
  d: string;
  /** Gradient axis: sender end and receiver end. */
  from: readonly [number, number];
  to: readonly [number, number];
}

// Single links leave and enter at the middle of a card border; the two lanes of a pair sit symmetric around it.
export const NET_LINKS: readonly NetLink[] = [
  { d: 'M 206 270 C 255 270, 255 270, 304 270', from: [206, 270], to: [304, 270] },
  { d: 'M 476 280 C 530 280, 530 280, 584 280', from: [476, 280], to: [584, 280] },
  { d: 'M 652 253 C 652 186, 652 186, 652 119', from: [652, 253], to: [652, 119] },
  { d: 'M 688 119 C 688 186, 688 186, 688 253', from: [688, 119], to: [688, 253] },
  { d: 'M 756 270 C 822 270, 822 158, 889 158', from: [756, 270], to: [889, 158] },
  { d: 'M 889 178 C 822 178, 822 290, 756 290', from: [889, 178], to: [756, 290] },
  { d: 'M 670 307 C 670 410, 760 410, 889 410', from: [670, 307], to: [889, 410] },
  { d: 'M 975 437 C 975 516, 390 516, 390 307', from: [975, 437], to: [390, 307] },
  { d: 'M 304 290 C 255 290, 255 290, 206 290', from: [304, 290], to: [206, 290] },
];

/** Top-left corner of each node card (172 x 54) in diagram space. */
export const NET_NODE_POS: Record<NetNode['key'], { left: number; top: number }> = {
  you: { left: 34, top: 253 },
  desktop: { left: 304, top: 253 },
  cli: { left: 584, top: 253 },
  skills: { left: 584, top: 65 },
  memory: { left: 889, top: 141 },
  dashboard: { left: 889, top: 383 },
};

/** Two light packets drift along every idle link; their phase is spread across the links. */
export function packetDelays(link: number): [string, string] {
  return [`${(-link * 0.7).toFixed(1)}s`, `${(-3 - link * 0.7).toFixed(1)}s`];
}
