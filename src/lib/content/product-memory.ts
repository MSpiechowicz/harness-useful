import { COLORS, REPOS } from '$lib/config/site';
import type { Product } from './types';

// Source: ../harness-useful-memory/README.md. Sections cited per field group below.
// License: README "License" section, package.json and Cargo.toml all say GPL-3.0-or-later.
export const MEMORY: Product = {
  id: 'memory',
  name: 'Harness Memory',
  // README intro, bold lead.
  tagline: 'Project memory for your AI coding agents, in one local binary.',
  // README intro paragraph.
  definition:
    'Harness Memory is a local stdio MCP server that gives Claude Code, Codex, OMP, PI, OpenCode and any other MCP client one shared project memory.',

  // README intro, "Tools", "Search", "Team memory".
  features: [
    {
      title: 'Search first, save last',
      text: 'Agents search notes at the start of a task and save what they learn (fixes, decisions, where things live) before they finish.',
    },
    {
      title: 'Typed notes',
      text: 'Notes have a kind: outcome, problem, fix, optimisation, location, decision or note, plus tags and the entities they are about.',
    },
    {
      title: 'A small entity graph',
      text: 'entity_link relates two entities, for example ConfigLoader located_in src/config.rs, and entity_neighbors shows the relations around one.',
    },
    {
      title: 'Saved scripts',
      text: 'Agents save a deterministic script by name so a repeated action runs without being worked out again. A teammate’s script runs only after you approve it.',
    },
    {
      title: 'Local SQLite with full-text search',
      text: 'Notes live in a local SQLite database with FTS5 search, keyed per git repository. Search is stemmed English keyword search.',
    },
    {
      title: 'Optional vector search',
      text: 'Adds notes close in meaning through one local embedder per computer. It is off until you enable it.',
    },
    {
      title: 'Secrets redacted on write',
      text: 'Titles, bodies, tags, entity names and relation labels pass a secret filter before they are stored. It is a heuristic and does not catch everything.',
    },
    {
      title: 'Team memory',
      text: 'Point every teammate’s server at one shared database so a fix one person’s agent saves is found by the next teammate’s agent.',
    },
  ],

  // README intro and "Register with your harness".
  harnesses: [
    { name: 'Claude Code', support: 'Register with claude mcp add --scope user harness-memory -- harness-memory mcp.' },
    { name: 'Codex', support: 'Register with codex mcp add harness-memory -- harness-memory mcp, or in config.toml.' },
    { name: 'OMP (oh-my-pi)', support: 'Add an mcpServers entry in ~/.omp/agent/mcp.json, or use /mcp add.' },
    {
      name: 'PI',
      support: 'Recent versions read ~/.pi/agent/mcp.json. Older ones need the pi-mcp-adapter first.',
    },
    { name: 'OpenCode', support: 'Add a local entry to the mcp object of opencode.json.' },
    { name: 'Any other MCP client', support: 'Any MCP client can start the stdio server with harness-memory mcp.' },
  ],

  // README "Install": macOS Apple Silicon or Intel, Linux x86_64 only, Windows.
  platforms: ['macOS (Apple Silicon and Intel)', 'Linux (x86_64)', 'Windows'],

  // README "Install", verbatim commands.
  install: [
    {
      platform: 'macos-linux',
      label: 'macOS and Linux',
      command: 'curl -fsSL https://raw.githubusercontent.com/MSpiechowicz/harness-useful-memory/main/install.sh | sh',
    },
    {
      platform: 'windows',
      label: 'Windows (PowerShell)',
      command:
        'powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/MSpiechowicz/harness-useful-memory/main/install.ps1 | iex"',
    },
  ],

  // README intro, "Where data lives" and "Privacy and trust".
  privacy: [
    'Local by default. Without a team database the server opens no network connection, except that the embedder downloads its search model once when you turn vector search on.',
    'Notes live in one SQLite file, memory.sqlite3, in the harness-memory folder of your user data directory. The file is not encrypted.',
    'Secrets are redacted before anything is stored. The filter is a heuristic, so do not rely on it.',
    'Notes are untrusted data written by agents. Results say where each note came from, and agents are told to check notes against the code.',
    'Scripts run as you. A machine runs only scripts saved on it or approved by you there.',
  ],

  license: 'GPL-3.0-or-later',
  repo: REPOS.memory,
  releases: `${REPOS.memory}/releases`,

  // FAQ answers: README intro, "Install", "Register with your harness", "Where data lives", "Team memory", "Privacy and trust".
  faq: [
    {
      q: 'What is Harness Memory?',
      a: 'Harness Memory is a stdio MCP server, shipped as one local binary called harness-memory. Agents such as Claude Code, Codex, OMP, PI and OpenCode search it at the start of a task and save what they learn, so the next session in the same repository starts better informed.',
    },
    {
      q: 'Which coding agents work with Harness Memory?',
      a: 'Any MCP client can start it. The README documents setup for Claude Code, Codex, OMP, PI and OpenCode. Each harness keeps its MCP servers in its own settings, so you add the harness-memory entry once per harness. Harness Desktop can register it for you.',
    },
    {
      q: 'How do I install Harness Memory?',
      a: 'On macOS and Linux run the curl install script from the README. On Windows run the PowerShell command. Both download the binary and checksums from the GitHub release and install nothing unless the SHA-256 matches. Then register it with each harness and check harness-memory --version.',
    },
    {
      q: 'Where does Harness Memory store my notes?',
      a: 'In one SQLite file named memory.sqlite3, in the harness-memory folder of your user data directory. On Linux that is ~/.local/share/harness-memory, on macOS ~/Library/Application Support/harness-memory and on Windows %LOCALAPPDATA%\\harness-memory. Set HARNESS_MEMORY_DIR to use another folder.',
    },
    {
      q: 'Does Harness Memory send my notes anywhere?',
      a: 'Not by default. Without a team database the server opens no network connection. The embedder downloads its search model once if you turn vector search on. What an agent reads from memory goes to its model provider like the rest of its context.',
    },
    {
      q: 'Is Harness Memory free and can a team share it?',
      a: 'It is open source under GPL-3.0-or-later. By default each person keeps a local SQLite file. Team memory points every teammate’s server at one shared database, which you set up and configure yourself.',
    },
    {
      q: 'How does Harness Memory connect to Desktop and Skills?',
      a: 'Harness Desktop registers the server in every detected harness while Project memory is on in its Settings, and adds hooks that make agents search first and save last. The us-use-harness-memory skill in Harness Skills works with its MCP tools.',
    },
  ],
  color: COLORS.memory,
};
