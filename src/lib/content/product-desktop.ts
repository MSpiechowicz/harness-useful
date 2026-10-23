import { COLORS, REPOS } from '$lib/config/site';
import type { Product } from './types';

// Source: ../harness-useful-desktop/README.md. Sections cited per field group below.
// License: README "License" section, package.json and Cargo.toml all say GPL-3.0-or-later.
export const DESKTOP: Product = {
  id: 'desktop',
  name: 'Harness Desktop',
  // README intro, bold lead.
  tagline: 'Your coding-agent CLI, in a native desktop window.',
  // README intro paragraph.
  definition:
    'Harness Desktop is a native desktop app for coding-agent harness CLIs that runs on top of the CLI you already have installed.',

  // README "Features".
  features: [
    {
      title: 'Chat with approvals',
      text: 'Streams the agent’s replies, thinking and tool calls, answers its approval and input dialogs, picks the model and thinking level, and asks before any shell command you send.',
    },
    {
      title: 'Sessions and branches',
      text: 'Lists a project’s saved sessions, shows the branch tree of each, opens the transcript, and resumes or forks it.',
    },
    {
      title: 'Changes panel with review comments',
      text: 'A graphical diff of the working tree (staged, unstaged, untracked). Comment on any line and send the comments to the agent as one prompt.',
    },
    {
      title: 'Config viewer',
      text: 'Settings, MCP servers and profiles of OMP, PI, OpenCode, Claude Code and Codex in one readable place, with secrets masked.',
    },
    {
      title: 'Extensions',
      text: 'Plugins, marketplaces, packages, skills, commands, agents, MCP servers and themes, with install, enable and update actions run through the harness’s own CLI.',
    },
    {
      title: 'Hooks',
      text: 'Small rules that add context to a prompt, send a follow-up after the agent finishes or run a command when something happens in a chat. A hook an agent adds never runs until you approve it.',
    },
    {
      title: 'Recommended setup',
      text: 'An optional step that, after you confirm each part, installs Harness Dashboard, Harness Memory and Harness Skills and registers their MCP servers in each detected harness.',
    },
    {
      title: 'Share setup',
      text: 'Export the marketplaces, plugins, packages and MCP servers of your harnesses as a string or a JSON file, and import one on another machine after reviewing the exact commands.',
    },
  ],

  // README "Supported harnesses" table.
  harnesses: [
    { name: 'Oh My Pi (omp)', support: 'Supported. Verified against 18.6.1.' },
    { name: 'Pi (pi)', support: 'Supported. Tested with PI 1.1. Other versions show as untested.' },
    {
      name: 'OpenCode (opencode)',
      support:
        'Partly supported. Works: detection, configuration, extensions, sessions, Harness Skills install and MCP entries in Recommended setup, and Share setup. Chat is a preview.',
    },
    {
      name: 'Claude Code (claude)',
      support: 'Supported, chat as a preview. Works: detection, configuration, extensions, sessions, Recommended setup and Share setup.',
    },
    {
      name: 'Codex (codex)',
      support: 'Supported, chat as a preview. Works: detection, configuration, extensions, sessions, Recommended setup and Share setup.',
    },
  ],

  // README "Install": Linux AppImage/deb/rpm, macOS dmg (Apple Silicon and Intel), Windows NSIS/MSI.
  platforms: ['macOS (Apple Silicon and Intel)', 'Linux (AppImage, deb, rpm)', 'Windows (NSIS installer, MSI)'],

  // README "Install", verbatim commands.
  install: [
    {
      platform: 'macos-linux',
      label: 'macOS and Linux',
      command: 'curl -fsSL https://raw.githubusercontent.com/MSpiechowicz/harness-useful-desktop/main/install.sh | sh',
    },
    {
      platform: 'windows',
      label: 'Windows (PowerShell)',
      command:
        'powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/MSpiechowicz/harness-useful-desktop/main/install.ps1 | iex"',
    },
  ],

  // README "Privacy" and intro.
  privacy: [
    'Everything runs on your machine. No telemetry, no accounts, no stored tokens.',
    'Credential files are never read, and secrets in configuration are masked.',
    'The only network requests the app makes itself are the signed update check and a lookup of the companion tools’ latest release numbers on GitHub. Both can be turned off.',
    'Hook files are plain JSON in your data folder (harness-hooks/hooks). A hook an agent adds or changes runs only after you approve that exact version.',
  ],

  license: 'GPL-3.0-or-later',
  repo: REPOS.desktop,
  releases: `${REPOS.desktop}/releases`,

  // README video caption: "A 73-second tour with sound ...".
  video: {
    src: '/media/tour-desktop.mp4',
    poster: '/media/poster-desktop.webp',
    title: 'Harness Desktop tour',
    description:
      'A 73-second tour with sound: chat with live tool calls and subagents, approvals, sessions and branches, review comments sent back to the agent, config and extensions, the Harness family and Harness Dashboard data, themes and privacy. Made with the app’s demo data.',
    uploadDate: '2026-10-11',
    duration: 'PT1M13S',
  },

  // FAQ answers: README "Install", "Supported harnesses", "Privacy", "Project memory", "Hooks", "License".
  faq: [
    {
      q: 'What is Harness Desktop?',
      a: 'Harness Desktop is a native desktop app that runs on top of the coding-agent CLI you already have installed. You chat with the agent in a window, browse its sessions and branches, review the changes it made and send comments back, and manage its configuration and extensions.',
    },
    {
      q: 'Which coding agents does Harness Desktop support?',
      a: 'It supports Oh My Pi and Pi fully. Claude Code and Codex are supported with chat as a preview. OpenCode is partly supported, with chat as a preview. Other harness CLIs are planned. The app finds the CLI on your PATH and does not install harnesses.',
    },
    {
      q: 'How do I install Harness Desktop?',
      a: 'On macOS and Linux run the curl install script from the README. On Windows run the PowerShell install command. Both verify the release checksum. You can also download an AppImage, deb, rpm, dmg, NSIS installer or MSI from the GitHub releases page.',
    },
    {
      q: 'Does Harness Desktop need an account or send telemetry?',
      a: 'No. It has no telemetry, no accounts and stores no tokens. Credential files are never read. The only requests the app makes itself are the signed update check and a lookup of the companion tools’ latest release numbers on GitHub, and you can turn both off.',
    },
    {
      q: 'Where does Harness Desktop keep its data?',
      a: 'Hooks are plain JSON files, one per hook, in the harness-hooks/hooks folder of your data directory. The app itself stores only preferences, window geometry, a few UI choices, your hook approvals and a local log file. Project notes belong to the separate Harness Memory server.',
    },
    {
      q: 'Is Harness Desktop free and open source?',
      a: 'Yes. Harness Desktop is open source under the GPL-3.0-or-later license, copyright Maciej Spiechowicz. The source and releases are on GitHub.',
    },
    {
      q: 'How does Harness Desktop work with Memory, Skills and Dashboard?',
      a: 'Its Recommended setup installs Harness Dashboard, Harness Memory and Harness Skills after you confirm each part, and registers their MCP servers in each detected harness. It also adds family hooks that ask agents to search memory first and check limits with the dashboard before long work.',
    },
  ],
  color: COLORS.desktop,
};
