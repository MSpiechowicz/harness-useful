import { COLORS, REPOS } from '$lib/config/site';
import type { Product } from './types';

// Source: ../harness-useful-code/README.md. Sections cited per field group below.
// License: README "License" section and package.json say GPL-3.0-or-later.
export const CODE: Product = {
  id: 'code',
  name: 'Harness Code',
  // README intro, bold lead.
  tagline: 'A code graph for your AI coding agents, in one local binary.',
  // README intro paragraph.
  definition:
    'Harness Code is a local stdio MCP server that indexes a repository with tree-sitter and tells Claude Code, Codex, OMP, PI, OpenCode and any other MCP client where code is defined, who uses it and how one part reaches another.',

  // README intro, "MCP tools", "How the index works".
  features: [
    {
      title: 'A map before grep',
      text: 'code_map gives a ranked map of a project’s key files with their signatures, within a token budget, optionally centred on one folder.',
    },
    {
      title: 'Where it is and who uses it',
      text: 'code_symbol tells where a function, type or constant is defined, what it uses and who uses it, with path:line and the line of source that makes each link.',
    },
    {
      title: 'What a change breaks',
      text: 'code_impact lists everything that depends on a symbol or a file, by caller depth, with tests summarised per file. For before a signature changes.',
    },
    {
      title: 'How A reaches B',
      text: 'code_path finds the shortest chain of calls, renders and shared constants between two ends, one hop per line with the call site. An end can even be plain words.',
    },
    {
      title: 'Always fresh',
      text: 'Each call compares file sizes and times with the index and reads only what changed. There is no watcher, no commit hook and nothing to rebuild.',
    },
    {
      title: 'Six languages',
      text: 'Rust, TypeScript and JavaScript, .svelte, .vue and .astro files, Go and Python. Links across languages are marked as found by name.',
    },
    {
      title: 'No values in answers',
      text: 'String literals in signatures are replaced, credential formats and URL passwords are masked, and file names cannot forge a line of an answer.',
    },
    {
      title: 'Isolated and bounded',
      text: 'A repository is untrusted input, so it is indexed in a separate worker with a memory and time limit. Only git repositories are indexed, never your home folder.',
    },
  ],

  // README "Register with your harness".
  harnesses: [
    { name: 'Claude Code', support: 'Register with claude mcp add --scope user harness-code -- harness-code mcp.' },
    { name: 'Codex', support: 'Register with codex mcp add harness-code -- harness-code mcp.' },
    {
      name: 'OMP, PI, OpenCode',
      support: 'Add a harness-code entry that runs harness-code mcp: in mcp.json for OMP and PI, under mcp in opencode.json for OpenCode.',
    },
    {
      name: 'Harness Desktop',
      support:
        'Installs it, registers the server for every harness, keeps it up to date and builds the index of a project when you open it.',
    },
    { name: 'Any other MCP client', support: 'Any MCP client can start the stdio server with harness-code mcp.' },
  ],

  // README "Install": macOS Apple Silicon or Intel, Linux x86_64 only, Windows.
  platforms: ['macOS (Apple Silicon and Intel)', 'Linux (x86_64)', 'Windows'],

  // README "Install", verbatim commands.
  install: [
    {
      platform: 'macos-linux',
      label: 'macOS and Linux',
      command: 'curl -fsSL https://raw.githubusercontent.com/MSpiechowicz/harness-useful-code/main/install.sh | sh',
    },
    {
      platform: 'windows',
      label: 'Windows (PowerShell)',
      command:
        'powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/MSpiechowicz/harness-useful-code/main/install.ps1 | iex"',
    },
  ],

  // README intro, "How the index works", "Data".
  privacy: [
    'Nothing is sent anywhere. The index is one local SQLite file, code.sqlite3, in the harness-code folder of your user data directory.',
    'Nothing is written into your repositories.',
    'String values in signatures are hidden, and credential formats and URL passwords are masked in replies.',
    'Indexing runs in a separate worker with a time limit, and on Linux a memory limit, so a hostile repository cannot take the server down.',
    'Only git repositories are indexed. Your home folder, hidden folders under it and system folders are refused.',
  ],

  license: 'GPL-3.0-or-later',
  repo: REPOS.code,
  releases: `${REPOS.code}/releases`,

  // FAQ answers: README intro, "Install", "Register with your harness", "How the index works", "Switch", "Data".
  faq: [
    {
      q: 'What is Harness Code?',
      a: 'Harness Code is a stdio MCP server, shipped as one local binary called harness-code. It indexes a repository with tree-sitter and answers where code is defined, who uses it, what breaks when it changes and how one thing reaches another, so an agent reads the answer instead of grepping and opening files.',
    },
    {
      q: 'Which languages does it index?',
      a: 'Rust, TypeScript and JavaScript, .svelte, .vue and .astro files, Go and Python. A link between files in different languages comes only from a string that names a function or component defined elsewhere, and replies mark it as found by name.',
    },
    {
      q: 'Do I have to rebuild the index?',
      a: 'No. Each code_* call compares the size and modification time of the files with the index, reads only the ones that changed and answers from the updated graph. There is no watcher and no commit hook.',
    },
    {
      q: 'How do I install Harness Code?',
      a: 'On macOS and Linux run the curl install script from the README. On Windows run the PowerShell command. Both check the SHA-256 against the release’s checksums before installing anything. Then register harness-code mcp with each harness, or let Harness Desktop do it.',
    },
    {
      q: 'Does Harness Code send my code anywhere?',
      a: 'No. The index is a local SQLite file in your user data directory and nothing is sent over the network. What an agent reads from an answer goes to its model provider like the rest of its context.',
    },
    {
      q: 'Can I turn it off?',
      a: 'Yes. harness-code disable writes a switch file that hides its four code_* tools from every harness and keeps the index. harness-code enable turns it back on, and Harness Desktop has the same switch under Settings → Code.',
    },
    {
      q: 'Did the code graph use to be part of Harness Memory?',
      a: 'Yes. The code_map, code_symbol, code_impact and code_path tools moved from Harness Memory to Harness Code, which works on its own with neither Memory nor Knowledge installed.',
    },
  ],
  color: COLORS.code,
};
