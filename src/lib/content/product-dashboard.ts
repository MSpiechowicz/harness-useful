import { COLORS, REPOS } from '$lib/config/site';
import type { Product } from './types';

// Source: ../harness-useful-dashboard/README.md. Sections cited per field group below.
// License: README "License" says "GPL-3.0"; package.json says GPL-3.0-or-later (used here, per the approved plan).
export const DASHBOARD: Product = {
  id: 'dashboard',
  name: 'Harness Dashboard',
  // README intro, bold lead.
  tagline: 'Token usage across your AI coding tools, in one local app.',
  // README intro paragraph.
  definition:
    'Harness Dashboard is a local desktop app that reads the sessions your AI coding tools already write to disk and shows where your tokens and money go.',

  // README feature list under the intro video.
  features: [
    {
      title: 'Overall usage',
      text: 'Tokens, API-equivalent cost, sessions, prompts and cache hit rate, compared with the previous period.',
    },
    {
      title: 'Per-prompt cost',
      text: 'What each request really consumed, call by call, including the subagents it spawned.',
    },
    {
      title: 'Who used what',
      text: 'Where the money goes from tool to model to project in one flow chart, with a network of what used what.',
    },
    {
      title: 'Branches',
      text: 'What each piece of work cost, per git branch, with its sessions, changed files, commits and pull requests.',
    },
    {
      title: 'Live view',
      text: 'Tokens per minute as you work, the sessions running now, and how much of your plan limits is left.',
    },
    {
      title: 'Budgets and alerts',
      text: 'Daily, monthly and per-project spending caps, with desktop notifications at 80% and 100%.',
    },
    {
      title: 'Model drift and tips',
      text: 'Whether a model got slower, clumsier or more error-prone than usual, plus rule-based tips from your own usage.',
    },
    {
      title: 'MCP server',
      text: 'Agents in Claude Code, Codex, Cursor, Zed or OpenCode can read your usage, budgets and plan limits themselves.',
    },
  ],

  // README "Data sources" table and intro: the 13 tools it reads.
  harnesses: [
    { name: 'Claude Code', support: 'Reads ~/.claude/projects/**/*.jsonl.' },
    { name: 'Codex', support: 'Reads ~/.codex/sessions/** and archived_sessions/**.' },
    { name: 'Gemini CLI', support: 'Reads ~/.gemini/tmp/<project>/chats/.' },
    { name: 'GitHub Copilot CLI', support: 'Reads ~/.copilot/session-state/ and session-store.db.' },
    { name: 'GitHub Copilot Chat in VS Code', support: 'Reads the chat session files of VS Code, with no setup.' },
    { name: 'OpenCode', support: 'Reads its SQLite database, opencode.db, read-only.' },
    { name: 'pi', support: 'Reads ~/.pi/agent/sessions/**/*.jsonl.' },
    { name: 'omp (oh-my-pi)', support: 'Reads ~/.omp/agent/sessions/**/*.jsonl.' },
    { name: 'Zed', support: 'Reads the threads database of Zed’s own agent.' },
    { name: 'Cline', support: 'Reads task folders in VS Code’s extension storage.' },
    { name: 'Roo Code', support: 'Reads task folders in VS Code’s extension storage.' },
    { name: 'Kilo Code', support: 'Reads task folders in VS Code’s extension storage.' },
    {
      name: 'Cursor',
      support: 'Usage from cursor.com (Sync Cursor usage, off by default) or its CSV export.',
    },
  ],

  // README "Install": macOS, Linux (x86_64 only) and Windows.
  platforms: ['macOS', 'Linux (x86_64)', 'Windows'],

  // README "Install", verbatim commands.
  install: [
    {
      platform: 'macos-linux',
      label: 'macOS and Linux',
      command: 'curl -fsSL https://raw.githubusercontent.com/MSpiechowicz/harness-useful-dashboard/main/install.sh | sh',
    },
    {
      platform: 'windows',
      label: 'Windows (PowerShell)',
      command:
        'powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/MSpiechowicz/harness-useful-dashboard/main/install.ps1 | iex"',
    },
  ],

  // README intro and "Privacy".
  privacy: [
    'Everything runs locally. Your usage is never uploaded anywhere.',
    'Usage is stored in a local SQLite database, readable by your account only.',
    'The server and its API listen only on 127.0.0.1.',
    'Prompt text is stored truncated to 2,000 characters, and API keys, tokens and private keys in it are replaced with [redacted]. Set Stored prompt length to 0 to keep no prompt text.',
    'Outbound requests never carry your usage: the optional update check, plan-limit checks while Live is open, and the optional Cursor sync. All can be switched off in Settings.',
  ],

  license: 'GPL-3.0-or-later',
  repo: REPOS.dashboard,
  releases: `${REPOS.dashboard}/releases`,

  // README video caption: "A one-minute tour with sound ...".
  video: {
    src: '/media/tour-dashboard.mp4',
    poster: '/media/poster-dashboard.webp',
    title: 'Harness Dashboard tour',
    description:
      'A one-minute tour with sound: where the tokens go, one prompt in full, trimming an expensive skill, and the settings. Made with demo data.',
    uploadDate: '2026-10-11',
    duration: 'PT1M',
  },

  // FAQ answers: README intro, "Install", "Data sources", "MCP server", "Privacy".
  faq: [
    {
      q: 'What is Harness Dashboard?',
      a: 'Harness Dashboard is a local desktop app that reads the sessions your AI coding tools already write to disk. It stores everything in a local SQLite database and shows interactive charts of where your tokens and money go, by project, model, session and prompt.',
    },
    {
      q: 'Which coding tools does Harness Dashboard read?',
      a: 'Claude Code, Codex, Gemini CLI, GitHub Copilot CLI, GitHub Copilot Chat in VS Code, OpenCode, pi, omp, Zed, and the Cline, Roo Code and Kilo Code extensions. It also reads Cursor usage from cursor.com or a CSV export. That is 13 tools.',
    },
    {
      q: 'How do I install Harness Dashboard?',
      a: 'On macOS and Linux run the curl install script from the README. On Windows run the PowerShell command. The installer verifies the release checksums. You can also download a deb, rpm, dmg or msi from the GitHub releases page.',
    },
    {
      q: 'Does Harness Dashboard upload my usage?',
      a: 'No. Everything runs locally and your usage is never uploaded. The app makes only a few outbound requests, such as the optional update check and plan-limit checks, and none of them sends your usage. Each can be switched off in Settings.',
    },
    {
      q: 'Where does Harness Dashboard keep its data?',
      a: 'In a local SQLite database on your machine, or wherever you point it. The app data folder is readable by your account only. You can even point several machines at one SQLite file on iCloud Drive, Dropbox, OneDrive or a network share.',
    },
    {
      q: 'Can my agent read Harness Dashboard data?',
      a: 'Yes. harness-dashboard mcp is a local MCP server over stdio. An agent can check what a session or branch cost, how a budget stands or how much of a plan limit is left, for example before a large refactor. It reads the database only.',
    },
    {
      q: 'Is Harness Dashboard free and open source?',
      a: 'Yes. Harness Dashboard is open source under the GPL-3.0-or-later license. Its costs are API-equivalent prices in USD, not a bill.',
    },
  ],
  color: COLORS.dashboard,
};
