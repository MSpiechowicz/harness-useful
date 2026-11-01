// Homepage product blocks (text parts only; the animated demos live in components), ported from the approved board
// (TerminalStory.dc.html) and extended with Harness Knowledge and Harness Code from their READMEs.
import { COLORS, REPOS } from '$lib/config/site';
import type { ProductBlock } from './types';

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
  {
    id: 'knowledge',
    tag: 'harness knowledge',
    color: COLORS.knowledge,
    grad: 'linear-gradient(180deg,#D4A373,#8B5A2B)',
    href: REPOS.knowledge,
    note: 'animated · example data',
    title: 'Agents that read your docs before they guess.',
    lead: 'Guides, ADRs, API specs and runbooks you import, searched by every harness through one MCP server.',
    bullets: [
      {
        h: 'Cited passages',
        p: 'Each hit comes back with its title, section and snippet, and the agent reads the one it needs in full.',
      },
      { h: 'Hybrid search', p: 'Keyword and vector ranking merged, with a multilingual model that runs on your computer.' },
      {
        h: 'Every format you keep docs in',
        p: 'Markdown, HTML and Confluence exports, OpenAPI, AsciiDoc, reStructuredText, PDFs and meeting transcripts.',
      },
      { h: 'You approve what agents add', p: 'A document an agent proposes waits in a review queue until a person approves it.' },
    ],
    shots: [],
  },
  {
    id: 'code',
    tag: 'harness code',
    color: COLORS.code,
    grad: 'linear-gradient(180deg,#F87171,#DC2626)',
    href: REPOS.code,
    note: 'animated · example data',
    title: 'Ask the code graph before you grep.',
    lead: 'A tree-sitter index of your repository that answers where code lives, who uses it and how one part reaches another.',
    bullets: [
      { h: 'A map of the key files', p: 'code_map ranks a project’s files with their signatures, within a token budget.' },
      { h: 'Who uses it, what breaks', p: 'code_symbol and code_impact list definitions, callers and dependents with path:line.' },
      { h: 'How A reaches B', p: 'code_path returns the shortest call chain, one hop per line with the call site.' },
      { h: 'Always fresh, never uploaded', p: 'Each call re-reads only the files that changed. The index is one local SQLite file.' },
    ],
    shots: [],
  },
];
