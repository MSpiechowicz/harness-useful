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
    'Harness Skills is a set of owned us-* skills for Oh My Pi, Claude Code, OpenCode, Codex and Pi that take a natural-language request to reviewed, verified work.',

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
      title: 'Release assessment',
      text: 'us-assess-release has a fresh read-only release-assessor grade the finished change: a review tier from T0 to T6, a confidence from observed evidence and the files a human should check, also as a Review guide on the pull request.',
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
      title: 'Memory, docs and code graph',
      text: 'Agent-invoked memory for durable facts. us-use-harness-memory and us-use-harness-knowledge pair with the separate Harness Memory and Harness Knowledge MCP tools, and the code graph comes from Harness Code.',
    },
    {
      title: 'A fast lane',
      text: 'A repository switch or us-ignore-workflow skips the workflow for a request. Small, bounded fixes can use focused repair.',
    },
  ],

  // README "Installation", "Claude Code", "OpenCode", "Codex", "Pi" sections.
  harnesses: [
    {
      name: 'Oh My Pi (OMP)',
      support: 'Marketplace plugin harness-useful-skills@harness-useful-skills. Needs OMP with marketplace support and Node.js 22+.',
    },
    {
      name: 'Claude Code',
      support: 'Marketplace plugin with 23 namespaced skills and eight native agents. Needs Node.js 22+.',
    },
    {
      name: 'OpenCode',
      support: 'Supports OpenCode v1.x and v2.x through one installed plugin. Needs Node.js 22+.',
    },
    {
      name: 'Codex',
      support:
        'Plugin gives the 23 skills. The full install also adds eight agents and the memory MCP server. Needs Node.js 22+ and the codex CLI.',
    },
    {
      name: 'Pi',
      support:
        'Pi package with the 23 skills. Work runs inline; reviews and the release assessment run in a fresh read-only pi process. Needs only the pi CLI.',
    },
  ],

  // README "Installation" and "OpenCode": curl/PowerShell installers; the README states no OS limit for the plugin installs.
  platforms: ['macOS', 'Linux', 'Windows (PowerShell installer for OpenCode and Codex)'],

  // README "Installation", "Claude Code", "OpenCode", "Codex", "Pi", verbatim commands.
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
    {
      platform: 'pi',
      label: 'Pi',
      command: 'pi install git:github.com/MSpiechowicz/harness-useful-skills',
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
      a: 'Harness Skills is a set of owned us-* skills for Oh My Pi, Claude Code, OpenCode, Codex and Pi. These harnesses discover the skill descriptions, and the model follows the relevant instructions with its own native tools and workers. It takes a request to reviewed, verified work.',
    },
    {
      q: 'Which coding agents does Harness Skills support?',
      a: 'Oh My Pi, Claude Code, OpenCode, Codex and Pi. Each has its own install section. Claude Code gets 23 namespaced skills and eight native agents. OpenCode v1.x and v2.x are supported. Codex needs the codex CLI. These adapters need Node.js 22 or newer; Pi installs the skills as a Pi package with only the pi CLI.',
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
      a: 'Yes. Claude Code, OpenCode and Codex get a separate local memory server with memory_status, memory_search and memory_save tools, with project-scoped private files. The us-use-harness-memory and us-use-harness-knowledge skills work with the separate Harness Memory and Harness Knowledge MCP tools, and code graph lookups use the Harness Code tools.',
    },
    {
      q: 'Is Harness Skills free and open source?',
      a: 'Yes. This repository is under GPL-3.0-only. Third-party portions keep their stated licenses, recorded in the repository’s attribution table. It has no custom workflow executor, model router or phase database.',
    },
  ],
  color: COLORS.skills,
};
