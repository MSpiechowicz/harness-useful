// Family-wide FAQ (also rendered at /faq). Answers are self-contained and sourced from the six product READMEs
// (Desktop "Install"/"Privacy"/"Project memory"/"Hooks", Memory "Where data lives"/"Privacy and trust",
// Knowledge "Install"/"Team database", Code "How the index works"/"Data", Dashboard "Data sources"/"Privacy",
// Skills "Installation").
import type { Faq } from './types';

export const FAMILY_FAQ: Faq[] = [
  {
    q: 'What is Harness Useful?',
    a: 'Harness Useful is a family of six open-source, local tools for coding-agent harnesses such as Oh My Pi, PI, OpenCode, Claude Code and Codex. Harness Desktop is the window, Harness Skills the workflow, Harness Memory the shared project memory, Harness Knowledge the searchable project documentation, Harness Code the code graph and Harness Dashboard the usage and cost meter. Each works on its own.',
  },
  {
    q: 'Which Harness Useful tool should I start with?',
    a: 'Start with Harness Desktop. Install it, then open Ecosystem and choose Run recommended setup. After you confirm each part, it installs Harness Dashboard, Harness Memory, Harness Knowledge, Harness Code and Harness Skills, registers their MCP servers in each detected harness and adds the family hooks. You can also install any tool by itself.',
  },
  {
    q: 'Do the Harness Useful tools work separately?',
    a: 'Yes. Each tool has its own repository, installer and README, and works without the others. Harness Memory, Harness Knowledge and Harness Code are standalone MCP servers, Harness Dashboard is a standalone app, and Harness Skills installs straight into your harness. They work best together, and Desktop connects them through Recommended setup.',
  },
  {
    q: 'Which coding agents do the tools support?',
    a: 'Harness Desktop supports Oh My Pi and PI, with partial OpenCode support and chat previews for OpenCode, Claude Code and Codex. Harness Skills supports Oh My Pi, Claude Code, OpenCode, Codex and Pi. Harness Memory, Harness Knowledge and Harness Code work with any MCP client. Harness Dashboard reads 13 tools, including Gemini CLI, GitHub Copilot, Zed, Cline, Roo Code, Kilo Code and Cursor.',
  },
  {
    q: 'Is Harness Useful free and open source?',
    a: 'Yes. All six tools are open source on GitHub under the GNU General Public License version 3. Harness Desktop, Harness Memory, Harness Knowledge, Harness Code and Harness Dashboard are GPL-3.0-or-later, and Harness Skills is GPL-3.0-only. You can read the source, install the tools at no charge and follow each project’s releases on its GitHub repository.',
  },
  {
    q: 'Do the tools collect telemetry or need an account?',
    a: 'No. Harness Desktop has no telemetry, no accounts and stores no tokens. Harness Dashboard never uploads your usage. Harness Memory and Harness Knowledge open no network connection unless you set up a team database, apart from a one-time model download for vector search. Harness Code sends nothing anywhere. The tools make a few optional requests, such as signed update checks against GitHub, which you can turn off.',
  },
  {
    q: 'Where is my data stored?',
    a: 'On your machine. Harness Memory keeps notes in a SQLite file, memory.sqlite3, in the harness-memory folder of your user data directory. Harness Knowledge keeps its document index in knowledge.sqlite3 in the harness-knowledge folder, and Harness Code its code index in code.sqlite3 in the harness-code folder. Harness Dashboard keeps usage in a local SQLite database. Harness Desktop keeps hooks as JSON files in harness-hooks/hooks. Harness Skills is plugin files that your harness reads.',
  },
  {
    q: 'Which operating systems are supported?',
    a: 'Harness Desktop runs on macOS (Apple Silicon and Intel), Linux and Windows. Harness Memory, Harness Knowledge and Harness Code support macOS, Linux on x86_64 and Windows. Harness Dashboard supports macOS, Linux on x86_64 and Windows. Harness Skills installs into your harness with a short command and needs Node.js 22 or newer.',
  },
  {
    q: 'How do the tools connect to each other?',
    a: 'Through MCP servers and hooks. Harness Memory, Harness Knowledge, Harness Code and Harness Dashboard are MCP servers that your harness starts. Harness Desktop registers them in each detected harness and adds hooks that ask agents to search memory and knowledge first, save what they learned and check limits before long work. Harness Skills adds the us-* workflow skills.',
  },
  {
    q: 'How do I install Harness Useful?',
    a: 'Install Harness Desktop with one command: on macOS and Linux run the curl install script, on Windows run the PowerShell install command. Both verify the release checksum. Then use Ecosystem and Run recommended setup to add the other tools. Each tool also has its own install command on its page.',
  },
];
