# harness-useful

The website of the Harness Useful family, live at [harness-useful.com](https://harness-useful.com). It presents four open source tools that upgrade a coding agent: Harness Desktop (the window), Harness Skills (the workflow), Harness Memory (the memory) and Harness Dashboard (the meter).

The site is fully prerendered, ships no analytics and sets no cookies.

## Tech stack

- SvelteKit 2 and Svelte 5 (runes) with `@sveltejs/adapter-static`, every route prerendered.
- `@sveltejs/enhanced-img` (sharp) for responsive images, self-hosted Inter and JetBrains Mono fonts.
- Open Graph images and icons rendered at build time with satori and resvg-wasm.
- Bun 1.4.2 for installs, scripts and tests. nginx (unprivileged) serves the static output in a container.
- GitHub Actions for CI and releases, semantic-release for versioning, GHCR for the image, Coolify for hosting.

## Development

```sh
bun install
bun run dev            # dev server
bun run check          # svelte-check
bun run lint           # eslint and prettier --check
bun run format         # prettier --write
bun run guard          # no source file over 500 lines
bun run test           # unit tests
bun run build          # prerender into build/ and generate the CSP
bun run verify:build   # link, SEO and CSP audit plus html-validate on build/
bun run preview        # serve the production build
```

`bun run lhci` runs Lighthouse CI. In CI it targets the container on port 8080, so start the image first (see Docker).

### HTML validation relaxations

`.htmlvalidate.json` extends `html-validate:recommended`. JSON has no comments, so each relaxation is documented here:

- `no-inline-style` is off. Svelte emits `style` attributes during server rendering for values set through CSS custom properties (component sizes, animation delays, per-product colours), so the rule would flag generated output we cannot change. Static styling still lives in scoped classes.
- `void-style` is off. SvelteKit and enhanced-img emit self-closing void elements (`<meta/>`, `<img/>`, `<source/>`), which is valid HTML and not configurable.
- `attribute-boolean-style` is off. Svelte renders boolean attributes as `open=""` and `controls=""`.
- `attribute-empty-style` is off. Svelte renders empty attributes such as `download=""` in this form.
- `doctype-style` is off. SvelteKit's `app.html` template output uses a lowercase `<!doctype html>`.
- `no-trailing-whitespace` is off. Whitespace left by Svelte and SvelteKit output is harmless and outside our control.

Every other rule keeps its recommended setting.

## SEO, GEO and AEO

- `sitemap.xml` listing every canonical URL (apex domain, no trailing slash).
- `robots.txt` that allows all crawlers and names the AI crawlers explicitly (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, CCBot, meta-externalagent, DuckAssistBot, cohere-ai, MistralAI-User), plus a `Sitemap` line.
- `llms.txt` (per llmstxt.org) and `llms-full.txt` with the full text of every page.
- A markdown twin of every page (`/<slug>.md`, home is `/index.md`).
- JSON-LD on every page: `WebSite` with its publisher, `WebPage` and `BreadcrumbList`; the home page adds an `ItemList` of `SoftwareApplication`; product pages add `SoftwareApplication`, `SoftwareSourceCode`, `HowTo` and `FAQPage`; `/faq` is a `FAQPage`; the tours are `VideoObject`.
- Unique titles and descriptions, canonical URLs, Open Graph and Twitter cards with a 1200x630 image per page (`/og/<slug>.png`), favicon and PNG icons.
- Answer-first copy with question headings, so the content is easy to quote.

## Docker

```sh
docker build -t harness-useful .
docker run --rm -p 8080:8080 harness-useful
```

The site is then on http://localhost:8080. The container runs as a non-root user, listens on port 8080 and has a healthcheck on `/healthz` (`docker ps` shows `healthy`). It sends the security headers (CSP with script hashes, HSTS, nosniff, frame and referrer policies) on every response, including errors.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes to main and on pull requests:

1. quality: `check`, `lint`, `guard`, `test`
2. build: `build` and `verify:build`
3. docker: builds the image, runs it, asserts status codes, the `/desktop/`, `/desktop.html`, `/index.html` and `/index` redirects, that crafted URLs such as `//evil.example.html` never redirect off-site, hidden-file and Brotli-file 404s, the 404 page (including root-absolute `/_app/` assets at nested missing URLs), security headers, cache headers, gzip and content types with curl, then runs Lighthouse CI on all six pages (performance 0.9, accessibility 0.95, best practices 0.95, SEO 1.0). The reports are uploaded as the `lighthouse` artifact.

## Release

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). After CI succeeds on main, `.github/workflows/release.yml` runs:

1. semantic-release picks the version (`fix:` patch, `feat:` minor, `feat!:` or a `BREAKING CHANGE:` footer major), updates `CHANGELOG.md` and `package.json`, pushes the release commit and the `vX.Y.Z` tag and creates a draft GitHub release.
2. The image is built for linux/amd64 and pushed to `ghcr.io/mspiechowicz/harness-useful` with the tags `X.Y.Z`, `X.Y` and `latest`, with a signed build provenance attestation.
3. If the Coolify secrets are set, the Coolify deploy webhook is called. Without them this step is skipped.
4. The draft release is published as the latest release.

- `@semantic-release/git` pushes the release commit to `main` with `GITHUB_TOKEN`, so branch protection or rulesets on `main` must allow GitHub Actions to push (or drop the git plugin from `.releaserc.json`).
- Releases are cut only from Conventional Commits (`feat:` or `fix:`). The first release needs one after the initial commit.

Dependabot proposes grouped weekly updates for GitHub Actions, Bun dependencies and Docker base images.

### Coolify setup

1. In Coolify create a new resource of type Docker image: `ghcr.io/mspiechowicz/harness-useful:latest` (or pin a version such as `ghcr.io/mspiechowicz/harness-useful:1.0.0`).
2. Set the exposed port to `8080`.
3. Set the domain to `https://harness-useful.com` and add a redirect from `www.harness-useful.com` to the apex domain.
4. Set the health check path to `/healthz`.
5. Make the GHCR package public (package settings on GitHub), or add registry credentials to Coolify.
6. Enable the deploy webhook for the resource and add two repository secrets in GitHub (Settings, Secrets and variables, Actions): `COOLIFY_WEBHOOK_URL` (the webhook URL) and `COOLIFY_API_TOKEN` (a Coolify API token that may deploy).

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
