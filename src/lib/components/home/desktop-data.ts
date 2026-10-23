// Static content of the Desktop demo (a recreation of the Changes view with example data), from the approved board.
import type { IconName } from './desktop-icons';

export interface RailItem {
  icon: IconName;
  active?: boolean;
  badge?: string;
}

/** Rail groups; a divider separates groups. */
export const RAIL_GROUPS: RailItem[][] = [
  [{ icon: 'messageSquare' }, { icon: 'gitBranch' }, { icon: 'gitCompare', active: true, badge: '5' }],
  [
    { icon: 'listFilter' },
    { icon: 'blocks' },
    { icon: 'network' },
    { icon: 'notebook' },
    { icon: 'fileTerminal' },
    { icon: 'cloudCog', badge: '1' },
    { icon: 'calendarClock', badge: '3' },
  ],
  [{ icon: 'settings' }, { icon: 'keyboard' }, { icon: 'panelLeft' }],
];

export type FileStatus = 'M' | 'R' | 'A' | 'U';

export interface ChangedFile {
  status: FileStatus;
  dir: string;
  name: string;
  add: number;
  del: number;
  /** The file open in the diff; it also carries the comment badge. */
  selected?: boolean;
}

export const FILE_GROUPS: { title: string; files: ChangedFile[] }[] = [
  {
    title: 'UNSTAGED',
    files: [
      { status: 'M', dir: 'assets/', name: 'logo.png', add: 0, del: 0 },
      { status: 'M', dir: 'src/', name: 'lib.rs', add: 15, del: 3, selected: true },
    ],
  },
  {
    title: 'STAGED',
    files: [
      { status: 'R', dir: 'docs/', name: 'guide.md', add: 1, del: 1 },
      { status: 'A', dir: 'src/', name: 'error.rs', add: 6, del: 0 },
    ],
  },
  { title: 'UNTRACKED', files: [{ status: 'U', dir: 'notes/', name: 'todo.md', add: 3, del: 0 }] },
];

/** Syntax class of a code segment. */
export type Kind = 'kw' | 'fn' | 'ty' | 'cm';
export type Seg = [text: string, kind?: Kind];

export interface DiffLine {
  type: 'ctx' | 'del' | 'add' | 'gap';
  old?: number;
  next?: number;
  segs: Seg[];
  /** Line 7, where the demo comments. */
  anchor?: boolean;
}

export const DIFF_LINES: DiffLine[] = [
  { type: 'ctx', old: 1, next: 1, segs: [['//!', 'cm'], [' Line-oriented record parser.']] },
  { type: 'ctx', old: 2, next: 2, segs: [] },
  {
    type: 'del',
    old: 3,
    segs: [
      ['pub', 'kw'],
      [' '],
      ['fn', 'kw'],
      [' '],
      ['parse', 'fn'],
      ['(input: &str) -> '],
      ['Result', 'ty'],
      ['<'],
      ['Vec', 'ty'],
      ['<'],
      ['Record', 'ty'],
      ['>, '],
      ['String', 'ty'],
      ['> {'],
    ],
  },
  { type: 'add', next: 3, segs: [['mod', 'kw'], [' error;']] },
  { type: 'add', next: 4, segs: [] },
  {
    type: 'add',
    next: 5,
    segs: [['pub', 'kw'], [' '], ['use', 'kw'], [' error::'], ['Error', 'ty'], [';']],
  },
  { type: 'add', next: 6, segs: [] },
  {
    type: 'add',
    next: 7,
    anchor: true,
    segs: [
      ['pub', 'kw'],
      [' '],
      ['fn', 'kw'],
      [' '],
      ['parse', 'fn'],
      ['(input: &str) -> '],
      ['Result', 'ty'],
      ['<'],
      ['Vec', 'ty'],
      ['<'],
      ['Record', 'ty'],
      ['>, '],
      ['Error', 'ty'],
      ['> {'],
    ],
  },
  {
    type: 'ctx',
    old: 4,
    next: 8,
    segs: [['    '], ['let', 'kw'], [' '], ['mut', 'kw'], [' records = '], ['Vec', 'ty'], ['::new();']],
  },
  {
    type: 'ctx',
    old: 5,
    next: 9,
    segs: [['    '], ['for', 'kw'], [' line '], ['in', 'kw'], [' input.lines() {']],
  },
  {
    type: 'ctx',
    old: 6,
    next: 10,
    segs: [['        records.push('], ['Record', 'ty'], ['::from_line(line)?);']],
  },
  { type: 'gap', segs: [['⇕ Show 6 unchanged lines']] },
  { type: 'ctx', old: 13, next: 17, segs: [['}']] },
];
