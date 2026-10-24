// Homepage content, ported verbatim from the approved board (TerminalStory.dc.html).
// Product facts in COMPARISON come from the product READMEs via products.ts.
import { COLORS, REPOS } from '$lib/config/site';
import { PRODUCTS } from './products';
import type { CompareRow, DashboardTab, DataCard, DataConnection, DiffRow, ProductBlock, Tour } from './types';

export { NET_COLORS, NET_ENDS, NET_HOPS, NET_MS, NET_NODES } from './home-net';

/** Header navigation of the board. */
export const HOME_NAV = [
  { label: 'life-of-a-prompt', href: '#flow' },
  { label: 'products', href: '#products' },
  { label: 'dashboard', href: '#dashboard' },
  { label: 'tours', href: '#tours' },
  { label: 'install', href: '#install' },
] as const;

export const HERO = {
  eyebrow: '// open source · runs locally',
  /** h1 lines; the second one is the teal line. */
  h1: ['Local tools for', 'your coding agent.'],
  /** The four products in one line (OG card description). */
  products: 'Desktop, skills, memory, dashboard.',
  lead: 'A desktop app, skills, shared memory and a usage dashboard for the CLI you already run: Claude Code, Codex, OpenCode, PI or Oh My Pi.',
  ctas: [
    { label: '$ install desktop', href: '#install' },
    { label: '▶ watch a prompt travel', href: '#flow' },
  ],
  stats: [
    { value: '5', label: 'harnesses' },
    { value: '13', label: 'tools metered' },
    { value: '1', label: 'setup for all' },
    { value: '0', label: 'telemetry' },
  ],
  image: {
    img: 'd-hero-chat-2026.webp',
    alt: 'Current Harness Desktop chat: the top bar with Approvals, Memory, Thinking, Cost and Stats, a proposed memory note with Skip, Edit and Save, and three subagents running live',
  },
  /** Floating cards over the screenshot. Each one cycles through its events; the first is the static frame. */
  chips: [
    {
      tool: 'desktop',
      events: [
        { title: 'hook · sessionStart', text: 'Search Harness Memory first' },
        { title: 'hook · preToolUse', text: 'Block rm -rf outside the repo' },
      ],
    },
    {
      tool: 'memory',
      events: [
        { title: 'memory · recalled 2 times', text: 'Release build fails on macOS…' },
        { title: 'memory · saved', text: 'Source files stay under 500 lines' },
      ],
    },
    {
      tool: 'dashboard',
      events: [
        { title: 'dashboard · this week', text: '$0.121 / prompt · 90% from cache' },
        { title: 'dashboard · today', text: '$1.84 · 14 sessions' },
      ],
    },
    {
      tool: 'skills',
      events: [
        { title: 'skills · plan', text: '✓ approved by you' },
        { title: 'skills · review', text: '✓ 0 findings, tests pass' },
      ],
    },
  ],
  /** Order in which the chips light up, following a prompt: hook → memory → skills → dashboard. */
  chipOrder: [0, 1, 3, 2],
} as const;

/** Tools in the scrolling ticker under the hero (decorative, aria-hidden). */
export const MARQUEE = [
  'oh my pi',
  'pi',
  'opencode',
  'claude code',
  'codex',
  'gemini cli',
  'copilot cli',
  'copilot chat',
  'zed',
  'cline',
  'roo code',
  'kilo code',
  'cursor',
] as const;

/** Section headings of the board. */
export const SECTIONS = {
  flow: {
    prompt: '$ harness trace --prompt "Handle empty config input"',
    title: 'The life of one prompt in the family',
    lead: 'Follow a single request through the family: light runs along every connection, and the step happening now lights up.',
  },
  diff: {
    title: 'git diff --stat your-workflow',
    lead: 'What changes the day you add the family.',
  },
  dashboard: {
    tag: 'harness dashboard',
    title: 'See where every token goes. Down to the prompt.',
    lead: 'Thirteen AI coding tools, read from the sessions they already write to disk, stored in one local SQLite file. Never uploaded.',
    captionSuffix: 'real screen, demo data',
  },
  local: {
    title: 'Where your data lives: here.',
    lead: 'Every tool keeps its data on your machine. Only three connections ever leave it, and you choose all three.',
    machine: 'your machine',
  },
  tours: { title: 'Watch them work. About a minute each.' },
  install: {
    title: 'One install. It brings the family.',
    lead: 'Install Desktop, then Ecosystem → Run recommended setup. It installs Dashboard, Memory and Skills, registers their MCP servers in every harness it finds and adds the family hooks, asking before each step.',
  },
  footer: 'exit 0 · harness useful family · open source',
} as const;

export const DIFFS: DiffRow[] = [
  {
    before: 'Every session starts cold and rediscovers the repo.',
    after: 'Sessions start with the repo’s notes, recalled by any harness.',
    tool: 'memory',
    color: COLORS.memory,
  },
  {
    before: 'The agent jumps straight into edits.',
    after: 'Research, a plan you approve, parallel workers, fresh reviews.',
    tool: 'skills',
    color: COLORS.skills,
  },
  {
    before: 'Read the diff in a pager, retype your feedback.',
    after: 'Comment on any diff line and send it all as one prompt.',
    tool: 'desktop',
    color: COLORS.desktop,
  },
  {
    before: 'Cost shows up as a bill at the end of the month.',
    after: 'Cost per prompt, branch and model, with live plan limits.',
    tool: 'dashboard',
    color: COLORS.dashboard,
  },
  {
    before: 'Five CLIs, five config formats, secrets in plain sight.',
    after: 'One window for config and extensions, secrets masked.',
    tool: 'desktop',
    color: COLORS.desktop,
  },
];

export const BLOCKS: ProductBlock[] = [
  {
    id: 'desktop',
    tag: 'harness desktop · the heart',
    color: COLORS.desktop,
    grad: 'linear-gradient(180deg,#818CF8,#38BDF8)',
    href: REPOS.desktop,
    note: 'animated · example data',
    title: 'Review like a human. Reply like a prompt.',
    lead: 'Your coding-agent CLI in a native window, with everything a terminal is bad at.',
    bullets: [
      {
        h: 'Comment on the real diff',
        p: 'Staged, unstaged and untracked changes. Click a line, then send every comment back as one prompt.',
      },
      { h: 'Every session is a branch tree', p: 'Open any transcript, resume it, or fork from any point.' },
      { h: 'Approvals you can read', p: 'Allow a shell command once, or deny it, before it runs.' },
      {
        h: 'One place for five harnesses',
        p: 'Config, MCP servers, plugins and skills of OMP, PI, OpenCode, Claude Code and Codex, with secrets masked.',
      },
    ],
    shots: [
      { img: 'd-changes.webp', cap: 'Changes · comment on any line', alt: 'Changes view with a unified diff' },
      {
        img: 'd-sessions.webp',
        cap: 'Sessions · branch tree, resume or fork',
        alt: 'Sessions view with a branch tree and transcript',
      },
      { img: 'd-approval.webp', cap: 'Approval · allow bash once', alt: 'Approval dialog asking to allow cargo test' },
      {
        img: 'd-ecosystem.webp',
        cap: 'Ecosystem · the family and your usage',
        alt: 'Ecosystem view with the family diagram and usage cards',
      },
    ],
  },
  {
    id: 'skills',
    tag: 'harness skills',
    color: COLORS.skills,
    grad: 'linear-gradient(180deg,#22C55E,#A3E635)',
    href: REPOS.skills,
    note: 'animated · example data',
    title: 'From a request to a verified PR, with a plan you approve.',
    lead: 'us-* skills that your harness discovers and follows with its own tools and workers.',
    bullets: [
      { h: 'Research before edits', p: 'A read-only scout maps the code, callers and conventions first.' },
      { h: 'A plan with acceptance criteria', p: 'Nothing changes until you approve it.' },
      { h: 'Workers on the model you choose', p: 'Frontend, backend and general packages run in parallel.' },
      {
        h: 'Fresh reviews, back for repair',
        p: 'Independent correctness and security reviews send findings back to Build.',
      },
    ],
    shots: [
      { img: 's-plan.webp', cap: 'Plan · approved by you', alt: 'Skills tour: plan with an Approve button' },
      {
        img: 's-build.webp',
        cap: 'Build · parallel workers',
        alt: 'Skills tour: frontend, backend and general-purpose workers with progress',
      },
      {
        img: 's-review.webp',
        cap: 'Review · back to Build for repair',
        alt: 'Skills tour: correctness finding sent back to build',
      },
      {
        img: 's-pr.webp',
        cap: 'Verify · pull request',
        alt: 'Skills tour: tests, lint, types and reviews passed, pull request opened',
      },
    ],
  },
  {
    id: 'memory',
    tag: 'harness memory',
    color: COLORS.memory,
    grad: 'linear-gradient(180deg,#FB923C,#D946EF)',
    href: REPOS.memory,
    note: 'animated · example data',
    title: 'Agents that remember your repository.',
    lead: 'One local binary, one MCP server, shared by every harness you use.',
    bullets: [
      {
        h: 'Search first, save last',
        p: 'Family hooks make agents look up notes at session start and record what they learned at turn end.',
      },
      { h: 'You stay the editor', p: 'Proposed notes appear in the chat with Save, Edit and Skip.' },
      {
        h: 'Typed, linked notes',
        p: 'Decisions, fixes, problems and locations, linked to files and to each other.',
      },
      {
        h: 'Private by default',
        p: 'SQLite with full-text search, secrets redacted, no network unless you set up a team database.',
      },
    ],
    shots: [
      { img: 'm-notes.webp', cap: 'Notes · typed, linked, recalled', alt: 'Notes view with an open note' },
      { img: 'm-memory-save.webp', cap: 'Chat · save, edit or skip', alt: 'Proposed memory notes in the chat' },
      {
        img: 'm-hooks.webp',
        cap: 'Hooks · search first, save last',
        alt: 'Hooks view with the family hooks active',
      },
    ],
  },
];

export const DTABS: DashboardTab[] = [
  {
    label: 'Where the money goes',
    sub: 'Tool → model → project in one flow',
    img: 'db-flow.webp',
    alt: 'Flow chart of spend from tools to models to projects',
  },
  {
    label: 'What used what',
    sub: 'Lights run along the busiest links',
    video: { src: '/media/db-network-motion.mp4', poster: '/media/db-network.webp' },
    alt: 'Harness Dashboard network of what used what, with lights running along the busiest links',
  },
  {
    label: 'Every session on one map',
    sub: 'Cost against time, by tool',
    img: 'db-session-map.webp',
    alt: 'Scatter map of sessions by cost and time',
  },
  {
    label: 'Projects side by side',
    sub: 'One scale, the outlier jumps out',
    img: 'db-project-tiles.webp',
    alt: 'Small multiples of cost per project',
  },
  {
    label: 'When you work',
    sub: 'Your activity calendar',
    img: 'db-calendar.webp',
    alt: 'Daily activity calendar heatmap',
  },
  {
    label: 'One prompt in full',
    sub: 'Call by call, subagents included',
    img: 'db-prompt-detail.webp',
    alt: 'Prompt detail with per-call cost',
  },
  {
    label: 'Live',
    sub: 'Tokens per minute, plan limits left',
    img: 'db-live.webp',
    alt: 'Live view with tokens per minute and plan limits',
  },
  {
    label: 'Compactions',
    sub: 'What each one dropped and cost',
    img: 'db-compactions.webp',
    alt: 'Context size over time with compactions',
  },
];

/** Four capability cards under the dashboard showcase. */
export const DASHBOARD_POINTS = [
  { label: 'Per prompt', icon: 'coins', text: 'What each request consumed, call by call, subagents included.' },
  { label: 'Per branch', icon: 'gitBranch', text: 'What each piece of work cost, with its commits and pull requests.' },
  { label: 'Model drift', icon: 'trendingUp', text: 'Whether a model got slower, clumsier or more error-prone than usual.' },
  { label: 'For agents too', icon: 'bot', text: 'An MCP server lets agents read budgets and plan limits before long work.' },
] as const;

// README paths: Desktop "Hooks" (harness-hooks/hooks), Memory "Where data lives", Dashboard "Privacy".
// The board wrote "usage.sqlite" for the dashboard; the dashboard README names the file usage.db.
export const DATA_LIVES: DataCard[] = [
  {
    tool: 'desktop',
    name: 'desktop',
    path: 'harness-hooks/hooks/*.json',
    text: 'No accounts, no stored tokens. Credential files are never read.',
  },
  {
    tool: 'memory',
    name: 'memory',
    path: 'harness-memory/ · SQLite FTS5',
    text: 'Per git repository. Secrets redacted before anything is stored.',
  },
  {
    tool: 'dashboard',
    name: 'dashboard',
    path: 'usage.db · read from disk',
    text: 'Reads the session files your tools already write. Never uploaded.',
  },
  {
    tool: 'skills',
    name: 'skills',
    path: 'plugin files in your harness',
    text: 'Instructions your harness reads. No workflow executor, no phase database.',
  },
  {
    tool: 'cli',
    name: 'your CLI',
    path: 'omp · pi · opencode · claude · codex',
    text: 'The harness you installed, with your own login. It is the only door to your model provider.',
  },
];

export const DATA_CONNECTIONS: DataConnection[] = [
  { name: 'Your model provider', text: 'through your own CLI and your own login' },
  { name: 'GitHub releases', text: 'signed update checks, can be turned off' },
  { name: 'A team memory database', text: 'only if you configure one' },
];

export const TOURS: Tour[] = [
  { id: 'desktop', caption: '· 73 s · chat, subagents, approvals, review' },
  { id: 'dashboard', caption: '· 1 min · where the tokens go' },
  { id: 'skills', caption: '· 72 s · request to verified PR' },
];

/** Install commands shown at the bottom of the board (same as the Desktop install steps). */
export const INSTALL = {
  title: SECTIONS.install.title,
  lead: SECTIONS.install.lead,
  commands: [
    { label: '# macOS · Linux', prompt: '$', command: PRODUCTS.desktop.install[0].command },
    { label: '# Windows', prompt: '>', command: PRODUCTS.desktop.install[1].command },
  ],
};

// "Which tool do I need?": facts from each product README (see products.ts for the cited sections).
export const COMPARISON: CompareRow[] = [
  {
    id: 'desktop',
    name: PRODUCTS.desktop.name,
    what: 'Your coding-agent CLI in a native desktop window: chat, sessions, review comments, config and extensions.',
    runsAs: 'Desktop app',
    platforms: PRODUCTS.desktop.platforms.join(', '),
    worksWith: 'OMP, PI, OpenCode, Claude Code, Codex',
    dataLives: 'Hooks as JSON files in harness-hooks/hooks in your data folder',
    license: PRODUCTS.desktop.license,
  },
  {
    id: 'skills',
    name: PRODUCTS.skills.name,
    what: 'us-* skills that take a request to reviewed, verified work.',
    runsAs: 'Plugin or skills loaded by your harness',
    platforms: PRODUCTS.skills.platforms.join(', '),
    worksWith: 'Oh My Pi, Claude Code, OpenCode, Codex',
    dataLives: 'Plugin files in your harness',
    license: PRODUCTS.skills.license,
  },
  {
    id: 'memory',
    name: PRODUCTS.memory.name,
    what: 'One shared project memory for your coding agents.',
    runsAs: 'Local stdio MCP server (one binary)',
    platforms: PRODUCTS.memory.platforms.join(', '),
    worksWith: 'Any MCP client, including Claude Code, Codex, OMP, PI, OpenCode',
    dataLives: 'memory.sqlite3 in the harness-memory folder of your user data directory',
    license: PRODUCTS.memory.license,
  },
  {
    id: 'dashboard',
    name: PRODUCTS.dashboard.name,
    what: 'Token usage and API-equivalent cost across your AI coding tools.',
    runsAs: 'Desktop app with an optional MCP server',
    platforms: PRODUCTS.dashboard.platforms.join(', '),
    worksWith: 'Claude Code, Codex, Gemini CLI, Copilot CLI, Copilot Chat, OpenCode, pi, omp, Zed, Cline, Roo Code, Kilo Code, Cursor',
    dataLives: 'A local SQLite database on your machine',
    license: PRODUCTS.dashboard.license,
  },
];
