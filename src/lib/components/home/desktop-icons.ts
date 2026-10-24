// Lucide icon geometry used by the homepage demos and cards (24 x 24 grid, stroke 2), copied from the approved board.
export type IconNode = [tag: 'path' | 'circle' | 'rect', attrs: Record<string, string | number>][];

const path = (d: string): IconNode[number] => ['path', { d }];
const circle = (cx: number, cy: number, r: number): IconNode[number] => ['circle', { cx, cy, r }];
const rect = (x: number, y: number, width: number, height: number, rx?: number): IconNode[number] => [
  'rect',
  rx === undefined ? { x, y, width, height } : { x, y, width, height, rx },
];

const gitCompare: IconNode = [circle(18, 18, 3), circle(6, 6, 3), path('M13 6h3a2 2 0 0 1 2 2v7'), path('M11 18H8a2 2 0 0 1-2-2V9')];
const messageSquare: IconNode = [
  path('M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z'),
];
const search: IconNode = [path('m21 21-4.34-4.34'), circle(11, 11, 8)];
const panelLeft: IconNode = [rect(3, 3, 18, 18, 2), path('M9 3v18')];

export const ICONS = {
  search,
  messageSquare,
  gitCompare,
  panelLeft,
  gitBranch: [path('M15 6a9 9 0 0 0-9 9V3'), circle(18, 6, 3), circle(6, 18, 3)],
  listFilter: [
    path('M10 5H3'),
    path('M12 19H3'),
    path('M14 3v4'),
    path('M16 17v4'),
    path('M21 12h-9'),
    path('M21 19h-5'),
    path('M21 5h-7'),
    path('M8 10v4'),
    path('M8 12H3'),
  ],
  blocks: [path('M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2'), rect(14, 2, 8, 8, 1)],
  network: [
    path('M20.341 6.484A10 10 0 0 1 10.266 21.85'),
    path('M3.659 17.516A10 10 0 0 1 13.74 2.152'),
    circle(12, 12, 3),
    circle(19, 5, 2),
    circle(5, 19, 2),
  ],
  notebook: [
    path('M2 6h4'),
    path('M2 10h4'),
    path('M2 14h4'),
    path('M2 18h4'),
    rect(4, 2, 16, 20, 2),
    path('M9.5 8h5'),
    path('M9.5 12H16'),
    path('M9.5 16H14'),
  ],
  fileTerminal: [
    path('M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'),
    path('M14 2v5a1 1 0 0 0 1 1h5'),
    path('M10 12.5 8 15l2 2.5'),
    path('m14 12.5 2 2.5-2 2.5'),
  ],
  cloudCog: [
    path('M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2'),
    path('m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06'),
    path('m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8'),
  ],
  calendarClock: [
    path('M16 14v2.2l1.6 1'),
    path('M16 2v3'),
    path('M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338'),
    path('M3 9h5.859'),
    path('M8 2v3'),
    circle(16, 16, 6),
  ],
  settings: [
    path(
      'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
    ),
    circle(12, 12, 3),
  ],
  keyboard: [
    path('M10 8h.01'),
    path('M12 12h.01'),
    path('M14 8h.01'),
    path('M16 12h.01'),
    path('M18 8h.01'),
    path('M6 8h.01'),
    path('M7 16h10'),
    path('M8 12h.01'),
    rect(2, 4, 20, 16, 2),
  ],
  download: [path('M12 15V3'), path('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), path('m7 10 5 5 5-5')],
  rows: [rect(3, 3, 18, 18, 2), path('M3 12h18')],
  columns: [rect(3, 3, 18, 18, 2), path('M12 3v18')],
  ellipsis: [circle(12, 12, 1), circle(19, 12, 1), circle(5, 12, 1)],
  coins: [path('M13.744 17.736a6 6 0 1 1-7.48-7.48'), path('M15 6h1v4'), path('m6.134 14.768.866-.5 2 3.464'), circle(16, 8, 6)],
  pencil: [
    path(
      'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    ),
    path('m15 5 4 4'),
  ],
  trash: [
    path('M10 11v6'),
    path('M14 11v6'),
    path('M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'),
    path('M3 6h18'),
    path('M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  ],
  x: [path('M18 6 6 18'), path('m6 6 12 12')],
  trendingUp: [path('M16 7h6v6'), path('m22 7-8.5 8.5-5-5L2 17')],
  bot: [path('M12 8V4H8'), rect(4, 8, 16, 12, 2), path('M2 14h2'), path('M20 14h2'), path('M15 13v2'), path('M9 13v2')],
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof ICONS;
