// Geometry of the "life of a prompt" network, ported from the approved board (gen_net2.py output in TerminalStory.dc.html).
// Coordinates are in the 1120 x 560 diagram space. A request and its reply ride the same wire: the reply runs the wire
// backwards. NET_LINKS follows the order of NET_ENDS in content/home-net.ts.
import type { NetNode } from '$lib/content/types';

export const NET_WIDTH = 1120;
export const NET_HEIGHT = 560;

/** One drawn connection between two cards. */
export interface NetWire {
  /** SVG path data of one cubic Bézier, drawn from the requesting end. */
  d: string;
  from: readonly [number, number];
  to: readonly [number, number];
  /** Carries a reply too, so its idle packets drift both ways. */
  twoWay: boolean;
}

/** A wire with its length in diagram units (packets are fixed-length streaks, so they need it). */
export interface MeasuredWire extends NetWire {
  length: number;
}

/** One direction of a wire: the path the hot pulse runs for a hop. */
export interface NetLink {
  wire: number;
  d: string;
  /** Gradient axis: sender end and receiver end. */
  from: readonly [number, number];
  to: readonly [number, number];
  length: number;
}

// Every wire leaves and enters at the middle of a card border. The three MCP servers leave the CLI card by different
// borders (Memory the top, Knowledge the right, Code the bottom), so their wires keep apart.
const WIRES: readonly NetWire[] = [
  { d: 'M 206 280 C 255 280, 255 280, 304 280', from: [206, 280], to: [304, 280], twoWay: true },
  { d: 'M 476 280 C 530 280, 530 280, 584 280', from: [476, 280], to: [584, 280], twoWay: true },
  { d: 'M 670 253 C 670 186, 670 186, 670 119', from: [670, 253], to: [670, 119], twoWay: true },
  { d: 'M 726 253 C 726 160, 800 67, 889 67', from: [726, 253], to: [889, 67], twoWay: true },
  { d: 'M 756 280 C 822 280, 822 177, 889 177', from: [756, 280], to: [889, 177], twoWay: true },
  { d: 'M 726 307 C 726 365, 790 327, 889 327', from: [726, 307], to: [889, 327], twoWay: true },
  { d: 'M 670 307 C 670 447, 760 447, 889 447', from: [670, 307], to: [889, 447], twoWay: false },
  { d: 'M 975 474 C 975 522, 390 522, 390 307', from: [975, 474], to: [390, 307], twoWay: false },
];

const CUBIC = /^M (\S+ \S+) C (\S+ \S+), (\S+ \S+), (\S+ \S+)$/;

function cubicPoints(d: string): string[] {
  const match = CUBIC.exec(d);

  if (!match) {
    throw new Error(`Not a single cubic path: ${d}`);
  }

  return match.slice(1);
}

/** The same cubic Bézier drawn from its other end. */
export function reversePath(d: string): string {
  const [start, c1, c2, end] = cubicPoints(d);

  return `M ${end} C ${c2}, ${c1}, ${start}`;
}

/** Length of a single cubic path, from 64 straight pieces (well under a unit off for these wires). */
export function pathLength(d: string): number {
  const [p0, p1, p2, p3] = cubicPoints(d).map((pair) => pair.split(' ').map(Number));
  let length = 0;
  let [x, y] = p0;

  for (let step = 1; step <= 64; step++) {
    const t = step / 64;
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const e = t * t * t;
    const nx = a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0];
    const ny = a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1];

    length += Math.hypot(nx - x, ny - y);
    [x, y] = [nx, ny];
  }

  return Math.round(length);
}

export const NET_WIRES: readonly MeasuredWire[] = WIRES.map((wire) => ({ ...wire, length: pathLength(wire.d) }));

/** [wire, runs backwards] of every NET_ENDS entry. */
const DIRECTIONS: readonly [number, boolean][] = [
  [0, false],
  [1, false],
  [2, false],
  [2, true],
  [3, false],
  [3, true],
  [6, false],
  [7, false],
  [0, true],
  [4, false],
  [4, true],
  [5, false],
  [5, true],
  [1, true],
];

export const NET_LINKS: readonly NetLink[] = DIRECTIONS.map(([wire, back]) => {
  const { d, from, to, length } = NET_WIRES[wire];

  return back ? { wire, d: reversePath(d), from: to, to: from, length } : { wire, d, from, to, length };
});

/** Top-left corner of each node card (172 x 54) in diagram space. */
export const NET_NODE_POS: Record<NetNode['key'], { left: number; top: number }> = {
  you: { left: 34, top: 253 },
  desktop: { left: 304, top: 253 },
  cli: { left: 584, top: 253 },
  skills: { left: 584, top: 65 },
  memory: { left: 889, top: 40 },
  knowledge: { left: 889, top: 150 },
  code: { left: 889, top: 300 },
  dashboard: { left: 889, top: 420 },
};

/** Background of the stage under the wires (LifeOfPrompt .stage). */
const STAGE_RGB = [8, 11, 13];

/** A node colour dimmed into the stage background, opaque, so the dot grid never shows through an idle wire. */
export function quietColor(hex: string, strength = 0.2): string {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];

  return `rgb(${channels.map((channel, index) => Math.round(channel * strength + STAGE_RGB[index] * (1 - strength))).join(' ')})`;
}
