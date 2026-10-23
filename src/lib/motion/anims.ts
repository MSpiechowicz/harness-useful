// Pure frame functions of the homepage demos, ported from the approved board (TerminalStory.dc.html: anims(t), net(step)).
// A frame is a plain object computed from a tick counter; components render it and a ticker supplies the counter.
import { NET_COLORS, NET_ENDS, NET_HOPS } from '$lib/content/home-net';
import type { NetNode } from '$lib/content/types';

/** Milliseconds per demo tick (the board's TICK). */
export const TICK = 650;

export const DESKTOP_FRAMES = 16;
export const SKILLS_FRAMES = 18;
export const MEMORY_FRAMES = 16;

/** The first `frac` (0..1) of a string, rounded to whole characters; used for typing effects. */
export function typed(text: string, frac: number): string {
  const count = Math.max(0, Math.min(text.length, Math.round(text.length * frac)));

  return text.slice(0, count);
}

/** Wraps a tick into `0..length-1`, also for negative values. */
function frameOf(tick: number, length: number): number {
  return ((tick % length) + length) % length;
}

// --- Desktop: click line 7, comment, review, send to agent, toast ---

export const DESKTOP_COMMENT = 'Keep the message: Error::Parse(String)';

export interface DesktopFrame {
  /** Outline colour of diff line 7 (transparent when not selected). */
  selLine: string;
  isComposing: boolean;
  isSaved: boolean;
  /** Text typed into the composer so far. */
  comment: string;
  commentGlow: boolean;
  /** The "Review 1" button in the top bar. */
  reviewVisible: boolean;
  reviewGlow: boolean;
  /** The "1" badge next to src/lib.rs. */
  badgeVisible: boolean;
  isModal: boolean;
  sendGlow: boolean;
  toastVisible: boolean;
  cost: string;
}

export function desktopFrame(tick: number): DesktopFrame {
  const f = frameOf(tick, DESKTOP_FRAMES);

  return {
    selLine: f >= 2 && f <= 6 ? '#3B82F6' : 'transparent',
    isComposing: f >= 3 && f <= 6,
    isSaved: f >= 7,
    comment: typed(DESKTOP_COMMENT, (f - 2) / 3),
    commentGlow: f === 6,
    reviewVisible: f >= 7,
    reviewGlow: f === 9,
    badgeVisible: f >= 7,
    isModal: f >= 10 && f <= 12,
    sendGlow: f === 12,
    toastVisible: f >= 13,
    cost: f >= 14 ? '$7.91' : '$7.88',
  };
}

// --- Skills: six stages, each with its own filling line ---

export const SKILL_STAGES = ['research', 'plan', 'implement', 'review', 'security', 'deliver'] as const;

/** Ticks each stage lasts; the stage line is full exactly when the next stage starts. */
export const STAGE_TICKS = [3, 3, 4, 3, 3, 2] as const;

export interface SkillsStage {
  label: string;
  mark: string;
  border: string;
  bg: string;
  fg: string;
  /** Width of the line under the stage: full for finished stages. */
  bar: string;
  /** Keyframe filling the line of the active stage; alternating names restart it at every stage. */
  barAnim: 'hfFillA' | 'hfFillB' | null;
  /** Duration of that keyframe in ms. */
  barMs: number;
}

export interface SkillsFrame {
  /** Index into SKILL_STAGES of the active stage. */
  stage: number;
  stages: SkillsStage[];
  researchLines: [boolean, boolean, boolean];
  approved: boolean;
  workers: { role: string; task: string; width: string }[];
  reviewText: string;
  reviewColor: string;
  securityText: string;
  securityColor: string;
}

/** Index of the active stage for loop frame `g` (0..17). */
export function skillsStage(g: number): number {
  if (g <= 2) return 0;
  if (g <= 5) return 1;
  if (g <= 9) return 2;
  if (g <= 12) return 3;
  if (g <= 15) return 4;

  return 5;
}

function stageView(label: string, index: number, active: number): SkillsStage {
  const done = index < active;
  const current = index === active;

  return {
    label,
    mark: done ? '✓' : '·',
    border: current ? '#A3E635' : done ? '#2B4419' : '#1C2829',
    bg: current ? '#152210' : done ? '#0F170C' : 'transparent',
    fg: current ? '#ECFCCB' : done ? '#A3E635' : '#6F807C',
    bar: done ? '100%' : '0',
    barAnim: current ? (active % 2 ? 'hfFillB' : 'hfFillA') : null,
    barMs: STAGE_TICKS[index] * TICK,
  };
}

export function skillsFrame(tick: number): SkillsFrame {
  const g = frameOf(tick, SKILLS_FRAMES);
  const stage = skillsStage(g);
  const k = Math.min(3, Math.max(0, g - 6));

  return {
    stage,
    stages: SKILL_STAGES.map((label, index) => stageView(label, index, stage)),
    researchLines: [true, g >= 1, g >= 2],
    approved: g >= 5,
    workers: [
      { role: 'frontend', task: 'Show 429 errors in the client', width: `${[30, 60, 85, 100][k]}%` },
      { role: 'backend', task: 'Limiter middleware and Redis store', width: `${[20, 45, 75, 100][k]}%` },
      { role: 'general-purpose', task: 'Document the limits in the README', width: `${[40, 70, 100, 100][k]}%` },
    ],
    reviewText: g <= 10 ? 'finding · limit resets on restart' : g === 11 ? '→ back to implement · repaired' : '✓ passed after repair',
    reviewColor: g <= 10 ? '#FB923C' : g === 11 ? '#FBBF24' : '#A3E635',
    securityText:
      g === 13 ? 'checking what changed…' : g === 14 ? 'finding · token printed in debug output' : '→ fixed in implement · ✓ passed',
    securityColor: g === 13 ? '#93A39F' : g === 14 ? '#FB923C' : '#A3E635',
  };
}

// --- Memory: note_search, notes recalled, work, turnEnd proposal, Save, new note ---

export const MEMORY_QUERY = 'release build macos';

export interface MemoryFrame {
  query: string;
  /** Terminal lines revealed so far: note_search, recalled, edit, timeout change, turnEnd. */
  lines: [boolean, boolean, boolean, boolean, boolean];
  /** The "Problem" note that was recalled is highlighted. */
  hit: boolean;
  card: boolean;
  /** Save button is highlighted / pressed. */
  saveActive: boolean;
  saveText: string;
  newNote: boolean;
  next: boolean;
}

export function memoryFrame(tick: number): MemoryFrame {
  const m = frameOf(tick, MEMORY_FRAMES);

  return {
    query: typed(MEMORY_QUERY, m >= 1 ? m / 2 : 0),
    lines: [m >= 1, m >= 3, m >= 5, m >= 6, m >= 8],
    hit: m >= 3 && m <= 7,
    card: m >= 9,
    saveActive: m >= 11,
    saveText: m >= 12 ? '✓ Saved' : 'Save',
    newNote: m >= 12,
    next: m >= 13,
  };
}

// --- Life of a prompt: the living network ---

export interface NetNodeFrame {
  /** Border gradient stops (CSS colours). */
  b1: string;
  b2: string;
  /** box-shadow of the node card. */
  glow: string;
  /** The receiving node blooms a ring. */
  ring: boolean;
}

export interface NetFrame {
  /** Index of the link running hot. */
  link: number;
  nodes: Record<NetNode['key'], NetNodeFrame>;
  caption: { title: string; sub: string; color: string; anim: 'nfCapA' | 'nfCapB' };
  num: string;
  total: string;
  /** Progress bar width, e.g. `33.3%`. */
  progress: string;
}

export function netFrame(step: number): NetFrame {
  const count = NET_HOPS.length;
  const index = frameOf(step, count);
  const hop = NET_HOPS[index];
  const [from, to] = NET_ENDS[hop.link];
  const nodes = {} as Record<NetNode['key'], NetNodeFrame>;

  for (const key of Object.keys(NET_COLORS) as NetNode['key'][]) {
    const color = NET_COLORS[key];
    const isTo = key === to;
    const isFrom = key === from;
    const lit = isTo || isFrom;

    nodes[key] = {
      b1: lit ? color : 'rgba(255,255,255,.14)',
      b2: lit ? `${color}55` : 'rgba(255,255,255,.04)',
      glow: isTo ? `0 0 0 1px ${color}55, 0 0 40px ${color}40` : isFrom ? `0 0 24px ${color}30` : '0 10px 30px rgba(0,0,0,.4)',
      ring: isTo,
    };
  }

  return {
    link: hop.link,
    nodes,
    caption: { title: hop.t, sub: hop.s, color: NET_COLORS[from], anim: index % 2 ? 'nfCapB' : 'nfCapA' },
    num: String(index + 1).padStart(2, '0'),
    total: String(count).padStart(2, '0'),
    progress: `${(((index + 1) / count) * 100).toFixed(1)}%`,
  };
}
