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

export const NET_LINKS: readonly NetLink[] = [
  { d: 'M 206 271 C 255 271, 255 271, 304 271', from: [206, 271], to: [304, 271] },
  { d: 'M 476 271 C 530 271, 530 271, 584 271', from: [476, 271], to: [584, 271] },
  { d: 'M 652 253 C 652 186, 652 186, 652 119', from: [652, 253], to: [652, 119] },
  { d: 'M 688 119 C 688 186, 688 186, 688 253', from: [688, 119], to: [688, 253] },
  { d: 'M 756 268 C 822 268, 822 158, 889 158', from: [756, 268], to: [889, 158] },
  { d: 'M 889 180 C 822 180, 822 284, 756 284', from: [889, 180], to: [756, 284] },
  { d: 'M 756 300 C 822 300, 822 402, 889 402', from: [756, 300], to: [889, 402] },
  { d: 'M 975 437 C 975 540, 390 540, 390 307', from: [975, 437], to: [390, 307] },
  { d: 'M 304 291 C 255 291, 255 291, 206 291', from: [304, 291], to: [206, 291] },
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

/** Two faint, slow comets per link run all the time; their phase is spread across the links. */
export function idleDelays(link: number): [string, string] {
  return [(0 - link * 0.37).toFixed(2), (-2.6 - link * 0.37).toFixed(2)];
}

export interface CometLayer {
  /** Visible length of the dash in pathLength units; also selects the nfDash<length> keyframe. */
  length: 30 | 14 | 4 | 3;
  width: number;
  opacity: number;
  blur: boolean;
  /** White core instead of the link gradient. */
  white: boolean;
}

/** Tapered comet of a hot link: glow halo, tail, body, bloom and white core. */
export const COMET_LAYERS: readonly CometLayer[] = [
  { length: 30, width: 12, opacity: 0.32, blur: true, white: false },
  { length: 30, width: 2.4, opacity: 0.38, blur: false, white: false },
  { length: 14, width: 3.8, opacity: 0.8, blur: false, white: false },
  { length: 4, width: 7, opacity: 1, blur: true, white: false },
  { length: 3, width: 3, opacity: 0.95, blur: false, white: true },
];

/** Two comets per hot link, half a loop apart. */
export const COMET_DELAYS = ['0s', '-0.8s'] as const;
