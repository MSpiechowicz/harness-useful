import { COLORS, REPOS } from '$lib/config/site';
import type { Product } from './types';

// Source: ../harness-useful-knowledge/README.md. Sections cited per field group below.
// License: README "License" section and package.json say GPL-3.0-or-later.
export const KNOWLEDGE: Product = {
  id: 'knowledge',
  name: 'Harness Knowledge',
  // README intro, bold lead.
  tagline: 'Project documentation for your AI coding agents, in one local binary.',
  // README intro paragraph.
  definition:
    'Harness Knowledge is a local stdio MCP server that lets Claude Code, Codex, OMP, PI, OpenCode and any other MCP client search the documentation you import, with cited passages.',

  // README intro, "Documents", "MCP tools", "Vector search", "Team database".
  features: [
    {
      title: 'Written knowledge, searched on demand',
      text: 'People import guides, READMEs, ADRs, OpenAPI specs, Confluence exports, PDFs and meeting transcripts. Agents search them when they need to know how something works.',
    },
    {
      title: 'Cited passages',
      text: 'knowledge_search answers with pointers (title, section and snippet) or whole chunks, and knowledge_get reads a document or chunk with its neighbours.',
    },
    {
      title: 'Hybrid search',
      text: 'Keyword search (BM25) and vector search with the multilingual e5-small model, merged with reciprocal rank fusion. Without the embedder, search falls back to keywords.',
    },
    {
      title: 'Heading-aware chunks',
      text: 'Markdown, text, HTML and Confluence exports, OpenAPI, AsciiDoc, reStructuredText, PDFs with a text layer and VTT or SRT transcripts, each split along its own sections.',
    },
    {
      title: 'Linked to repositories',
      text: 'A document can link to repositories, narrowed to path globs. A search from inside a repository ranks its linked documents higher; an unlinked document is global.',
    },
    {
      title: 'People approve what agents add',
      text: 'knowledge_add only sends a proposal to a review queue. A person approving it in Harness Desktop, or with held approve, makes it searchable.',
    },
    {
      title: 'Cheap re-imports',
      text: 'Unchanged content changes nothing. Changed content updates the document in place and reuses the vectors of unchanged chunks.',
    },
    {
      title: 'Team database',
      text: 'Keep the index in MongoDB, PostgreSQL with pgvector or libSQL, and choose per kind of document whether it lives remote, on this computer or both.',
    },
  ],

  // README "Register with your harness".
  harnesses: [
    {
      name: 'Claude Code',
      support: 'Register with claude mcp add --scope user harness-knowledge -- harness-knowledge mcp.',
    },
    { name: 'Codex', support: 'Register with codex mcp add harness-knowledge -- harness-knowledge mcp.' },
    { name: 'OMP, PI, OpenCode', support: 'Add a harness-knowledge entry that runs harness-knowledge mcp to their MCP config.' },
    {
      name: 'Harness Desktop',
      support: 'Installs it, registers the server for every harness and adds a Knowledge view for import, review and repository links.',
    },
    { name: 'Any other MCP client', support: 'Any MCP client can start the stdio server with harness-knowledge mcp.' },
  ],

  // README "Install": macOS Apple Silicon or Intel, Linux x86_64 only, Windows.
  platforms: ['macOS (Apple Silicon and Intel)', 'Linux (x86_64)', 'Windows'],

  // README "Install", verbatim commands.
  install: [
    {
      platform: 'macos-linux',
      label: 'macOS and Linux',
      command: 'curl -fsSL https://raw.githubusercontent.com/MSpiechowicz/harness-useful-knowledge/main/install.sh | sh',
    },
    {
      platform: 'windows',
      label: 'Windows (PowerShell)',
      command:
        'powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/MSpiechowicz/harness-useful-knowledge/main/install.ps1 | iex"',
    },
  ],

  // README intro, "Documents", "Vector search", "Team database".
  privacy: [
    'Local by default. The index lives in knowledge.sqlite3 in the harness-knowledge folder of your user data directory unless you point it at a team database.',
    'The embedder downloads its search model once from this project’s GitHub release, pinned by SHA-256 and size, and runs it on this computer.',
    'Document text is treated as untrusted data, never as instructions.',
    'Agents cannot write knowledge on their own. Every proposal waits in a review queue for a person.',
    'A team database is reached over TLS whenever it is not on this computer.',
  ],

  license: 'GPL-3.0-or-later',
  repo: REPOS.knowledge,
  releases: `${REPOS.knowledge}/releases`,

  // FAQ answers: README intro, "Install", "Register with your harness", "Documents", "Vector search", "Team database".
  faq: [
    {
      q: 'What is Harness Knowledge?',
      a: 'Harness Knowledge is a stdio MCP server, shipped as one local binary called harness-knowledge. People import project documents and coding agents search them, getting back passages with their title and section, so an answer comes from your docs instead of a guess.',
    },
    {
      q: 'How is it different from Harness Memory?',
      a: 'Harness Memory keeps what agents learn that is written down nowhere, such as fixes, decisions and where things live. Harness Knowledge keeps what is written down already: guides, ADRs, API specs, runbooks and transcripts that people import.',
    },
    {
      q: 'Which documents can I import?',
      a: 'Markdown, plain text, HTML and Confluence exports, OpenAPI and Swagger specs, AsciiDoc, reStructuredText, PDFs with a text layer and VTT or SRT transcripts. Each is split along its headings, operations, pages or time ranges. Scanned PDFs without a text layer are refused.',
    },
    {
      q: 'Can an agent add documents by itself?',
      a: 'No. knowledge_add sends a proposal to a review queue and never writes the database. Only a person approving it in Harness Desktop, or with harness-knowledge held approve, makes it searchable.',
    },
    {
      q: 'How do I install Harness Knowledge?',
      a: 'On macOS and Linux run the curl install script from the README. On Windows run the PowerShell command. Both check the SHA-256 against the release’s checksums before installing anything. Then register harness-knowledge mcp with each harness, or let Harness Desktop do it.',
    },
    {
      q: 'Does Harness Knowledge send my documents anywhere?',
      a: 'Not by default: the index is a local SQLite file and the embedder runs on your computer. If you configure a team database (MongoDB, PostgreSQL or libSQL), documents and the words of a search go to that database. What an agent reads goes to its model provider like the rest of its context.',
    },
  ],
  color: COLORS.knowledge,
};
