import { COLORS, REPOS } from '$lib/config/site';
import type { Product } from './types';

// Source: ../harness-useful-skills/README.md. Sections cited per field group below.
// License: README "Attribution" ("This repository remains GPL-3.0-only") and package.json both say GPL-3.0-only.
export const SKILLS: Product = {
  id: 'skills',
  name: 'Harness Skills',
  // README intro, bold lead.
  tagline: 'From a natural-language request to reviewed, verified work.',
  // README intro paragraph.
  definition:
    'Harness Skills is a set of owned us-* skills for Oh My Pi, Claude Code, OpenCode and Codex that take a natural-language request to reviewed, verified work.',

  // README intro table, "Skill-led development", skill table, "Focused audits and delivery".
  features: [
    {
      title: 'Research before edits',
      text: 'us-research inspects current source, callers, conventions and applicable memory, using a read-only worker when research is enabled.',
    },
    {
      title: 'A plan with one approval',
      text: 'us-plan drafts a plan with concrete acceptance and ownership, then asks for one approval.',
    },
    {
      title: 'Classified implementation workers',
      text: 'us-implement runs authorized implementation and repairs, inline for a focused fix or through classified workers.',
    },
    {
      title: 'Fresh reviews',
      text: 'us-review and us-check-security give independent, evidence-based correctness and security reviews.',
    },
    {
      title: 'Focused audits',
      text: 'Security, performance and code-quality audits, plus architecture and test-coverage improvements. Audits default to read-only.',
    },
    {
      title: 'Delivery',
      text: 'us-open-pr and us-approve-work deliver reviewed work as a feature-branch pull request, only when you explicitly authorize it.',
    },
    {
      title: 'Memory',
      text: 'Agent-invoked memory for durable facts alongside code relationships. us-use-harness-memory pairs with the separate Harness Memory MCP tools.',
    },
    {
      title: 'A fast lane',
      text: 'A repository switch or us-ignore-workflow skips the workflow for a request. Small, bounded fixes can use focused repair.',
    },
  ],

  // README "Installation", "Claude Code", "OpenCode", "Codex" sections.
  harnesses: [
    {
      name: 'Oh My Pi (OMP)',
      support: 'Marketplace plugin harness-useful-skills@harness-useful-skills. Needs OMP with marketplace support and Node.js 22+.',
    },
    {
      name: 'Claude Code',
      support: 'Marketplace plugin with 21 namespaced skills and seven native agents. Needs Node.js 22+.',
    },
    {
      name: 'OpenCode',
      support: 'Supports OpenCode v1.x and v2.x through one installed plugin. Needs Node.js 22+.',
    },
    {
      name: 'Codex',
      support:
        'Plugin gives the 21 skills. The full install also adds seven agents and the memory MCP server. Needs Node.js 22+ and the codex CLI.',
    },
  ],

  // README "Installation" and "OpenCode": curl/PowerShell installers; the README states no OS limit for the plugin installs.
  platforms: ['macOS', 'Linux', 'Windows (PowerShell installer for OpenCode and Codex)'],

  // README "Installation", "Claude Code", "OpenCode", "Codex", verbatim commands.
  install: [
    {
      platform: 'omp',
      label: 'Oh My Pi',
      command:
        'omp plugin marketplace add MSpiechowicz/harness-useful-skills\nomp plugin install harness-useful-skills@harness-useful-skills --scope user',
    },
    {
      platform: 'claude-code',
      label: 'Claude Code',
      command:
        'claude plugin marketplace add MSpiechowicz/harness-useful-skills\nclaude plugin install harness-useful-skills@harness-useful-skills --scope user',
    },
    {
      platform: 'opencode',
      label: 'OpenCode (macOS and Linux)',
      command:
        "curl --proto '=https' --tlsv1.2 -fsSL https://raw.githubusercontent.com/MSpiechowicz/harness-useful-skills/main/install.sh | sh",
    },
    {
      platform: 'codex',
      label: 'Codex',
      command:
        'codex plugin marketplace add MSpiechowicz/harness-useful-skills\ncodex plugin add harness-useful-skills@harness-useful-skills',
    },
  ],

  privacyHeading: 'Is it safe? What stays under your control?',
  // README intro, "Skill-led development", "Installation", "Focused audits and delivery".
  privacy: [
    'No Anvil dependency, custom workflow executor, model router, phase database or stop-hook continuation loop.',
    'The skills are instructions your harness reads. They are prompt instructions, not enforced stage transitions.',
    'The OpenCode and Codex install scripts download the release tarball over HTTPS, run safety checks and install nothing when a check fails.',
    'Audits default to read-only local investigation: no production probing and no automatic fixes.',
  ],

  license: 'GPL-3.0-only',
  repo: REPOS.skills,
  releases: `${REPOS.skills}/releases`,

  // README video caption: "A 72-second tour with sound ...".
  video: {
    src: '/media/tour-skills.mp4',
    poster: '/media/poster-skills.webp',
    title: 'Harness Skills tour',
    description:
      'A 72-second tour with sound: one request from research and plan approval through workers and fresh reviews to a verified pull request, then the short path for small fixes, read-only audits, memory and installation. The terminals are illustrations.',
    uploadDate: '2026-10-11',
    duration: 'PT1M12S',
  },

  // FAQ answers: README "Installation", "Skill-led development", "Agent-invoked memory", "Attribution".
  faq: [
    {
      q: 'What is Harness Skills?',
      a: 'Harness Skills is a set of owned us-* skills for Oh My Pi, Claude Code, OpenCode and Codex. These harnesses discover the skill descriptions, and the model follows the relevant instructions with its own native tools and workers. It takes a request to reviewed, verified work.',
    },
    {
      q: 'Which coding agents does Harness Skills support?',
      a: 'Oh My Pi, Claude Code, OpenCode and Codex. Each has its own install section. Claude Code gets 21 namespaced skills and seven native agents. OpenCode v1.x and v2.x are supported. Codex needs the codex CLI. All adapters need Node.js 22 or newer.',
    },
    {
      q: 'How do I install Harness Skills?',
      a: 'Use the commands for your harness. Oh My Pi, Claude Code and Codex install a marketplace plugin with a short command. OpenCode, and the full Codex install, use a curl script on macOS and Linux or an irm script in PowerShell on Windows. Restart the harness afterwards.',
    },
    {
      q: 'Does the workflow run automatically and can I turn it off?',
      a: 'Natural development requests go through us-run-workflow, which inspects the code and explains the selected lane. The skills are prompt instructions, not enforced stage transitions. In OMP, run /useful-skills workflow disabled in a repository to switch it off there, or invoke us-ignore-workflow for one request.',
    },
    {
      q: 'Does Harness Skills include memory?',
      a: 'Yes. Claude Code, OpenCode and Codex get a separate local memory server with memory_status, memory_search, memory_save, graph_build and graph_query tools, with project-scoped private files. The us-use-harness-memory skill works with the separate Harness Memory MCP tools.',
    },
    {
      q: 'Is Harness Skills free and open source?',
      a: 'Yes. This repository is under GPL-3.0-only. Third-party portions keep their stated licenses, recorded in the repository’s attribution table. It has no custom workflow executor, model router or phase database.',
    },
  ],
  color: COLORS.skills,
};
