// "Life of a prompt" network, ported verbatim from the approved board (TerminalStory.dc.html: NET_*).
import type { Hop, NetNode } from './types';

export const NET_HOPS: Hop[] = [
  {
    link: 0,
    t: 'you → Harness Desktop',
    s: 'your prompt',
    title: 'You type a prompt',
    body: 'In the Desktop chat of an open project, with the CLI you already use and your own login.',
    benefit: 'A real window around your harness.',
  },
  {
    link: 1,
    t: 'Harness Desktop → your CLI',
    s: 'prompt + hook context',
    title: 'Desktop hands it to your CLI',
    body: 'First the hooks you approved add their context: search memory and knowledge first, check skills and limits, check the branch.',
    benefit: 'One set of rules for every harness.',
  },
  {
    link: 4,
    t: 'your CLI → Harness Memory',
    s: 'note_search',
    title: 'The agent searches Harness Memory',
    body: 'note_search and script_list for this git repository, before any work starts.',
    benefit: 'Every session starts informed.',
  },
  {
    link: 5,
    t: 'Harness Memory → your CLI',
    s: '2 notes for this repo',
    title: 'What earlier sessions learned comes back',
    body: 'Typed notes (decisions, fixes, locations) written by any of your harnesses.',
    benefit: 'Nothing is relearned.',
  },
  {
    link: 9,
    t: 'your CLI → Harness Knowledge',
    s: 'knowledge_search',
    title: 'The agent checks the written docs',
    body: 'knowledge_search over the guides, ADRs and API specs you imported, keyword and vector ranking merged.',
    benefit: 'Answers come from your docs, not a guess.',
  },
  {
    link: 10,
    t: 'Harness Knowledge → your CLI',
    s: '3 passages with their section',
    title: 'Cited passages come back',
    body: 'Title, section and snippet of each hit; the agent reads the one it needs in full with knowledge_get.',
    benefit: 'Every claim has a source.',
  },
  {
    link: 2,
    t: 'your CLI → Harness Skills',
    s: 'pick a lane, research, plan',
    title: 'Skills pick a lane and plan',
    body: 'A read-only scout researches the code, then the planner drafts work packages with acceptance criteria.',
    benefit: 'Understood before it is changed.',
  },
  {
    link: 11,
    t: 'your CLI → Harness Code',
    s: 'code_map · code_path',
    title: 'The scout asks the code graph',
    body: 'A ranked map of the key files, then how the config loader reaches the parser, instead of grepping and opening files.',
    benefit: 'Fewer files read, fewer tokens spent.',
  },
  {
    link: 12,
    t: 'Harness Code → your CLI',
    s: '4 hops with path:line',
    title: 'The call chain comes back',
    body: 'One hop per line with path:line and the call site, read from an index that refreshes itself on every call.',
    benefit: 'The plan names the exact lines.',
  },
  {
    link: 13,
    t: 'your CLI → Harness Desktop',
    s: 'plan + approval request',
    title: 'The plan comes back to Desktop',
    body: 'The work packages and their acceptance criteria show up in the chat, with an Approve button next to them.',
    benefit: 'Readable before anything changes.',
  },
  {
    link: 8,
    t: 'Harness Desktop → you',
    s: 'plan · approve?',
    title: 'You approve the plan',
    body: 'Nothing is edited before you say yes, and risky calls ask again while the work runs.',
    benefit: 'You stay in control.',
  },
  {
    link: 3,
    t: 'Harness Skills → your CLI',
    s: 'implement · reviews · release assessment',
    title: 'Implement, review, assess',
    body: 'Workers build in parallel, fresh reviewers check correctness and security, and a read-only assessor grades the risk and lists what to check.',
    benefit: 'The agent does not grade its own work.',
  },
  {
    link: 6,
    t: 'your CLI → Harness Dashboard',
    s: 'limits, then the session log',
    title: 'Dashboard checks limits and prices the run',
    body: 'Limits and budgets before long work, then every call priced from the session log, subagents included.',
    benefit: 'Know what a feature cost.',
  },
  {
    link: 7,
    t: 'Harness Dashboard → Harness Desktop',
    s: 'cost per prompt in Ecosystem',
    title: 'The cost shows up in Desktop',
    body: 'Ecosystem shows cost, tokens and cost per prompt next to the family status.',
    benefit: 'The loop closes where it started.',
  },
];

/** [from, to] node keys of every link; Hop.link indexes this list. */
export const NET_ENDS: [NetNode['key'], NetNode['key']][] = [
  ['you', 'desktop'],
  ['desktop', 'cli'],
  ['cli', 'skills'],
  ['skills', 'cli'],
  ['cli', 'memory'],
  ['memory', 'cli'],
  ['cli', 'dashboard'],
  ['dashboard', 'desktop'],
  ['desktop', 'you'],
  ['cli', 'knowledge'],
  ['knowledge', 'cli'],
  ['cli', 'code'],
  ['code', 'cli'],
  ['cli', 'desktop'],
];

export const NET_COLORS: Record<NetNode['key'], string> = {
  you: '#F2F7F5',
  desktop: '#7DD3FC',
  cli: '#5EEAC4',
  skills: '#A3E635',
  memory: '#E879F9',
  knowledge: '#D4A373',
  code: '#F87171',
  dashboard: '#FBBF24',
};

/** Duration of one hop in the auto-play: long enough for the comet to land twice and the step text to be read. */
export const NET_MS = 4200;

/** Node labels of the network diagram (board markup). */
export const NET_NODES: NetNode[] = [
  { key: 'you', name: 'you', sub: 'in the chat' },
  { key: 'desktop', name: 'Harness Desktop', sub: 'the window' },
  { key: 'cli', name: 'your CLI', sub: 'omp · claude · codex' },
  { key: 'skills', name: 'Harness Skills', sub: 'loaded into the CLI' },
  { key: 'memory', name: 'Harness Memory', sub: 'MCP · per repo' },
  { key: 'knowledge', name: 'Harness Knowledge', sub: 'MCP · project docs' },
  { key: 'code', name: 'Harness Code', sub: 'MCP · code graph' },
  { key: 'dashboard', name: 'Harness Dashboard', sub: 'MCP · local data' },
];
