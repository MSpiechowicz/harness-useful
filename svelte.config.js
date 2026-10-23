import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // No SPA fallback: src/routes/404/+page.svelte prerenders a real 404.html that nginx serves with full content.
    adapter: adapter({ pages: 'build', assets: 'build', precompress: true, strict: true }),
    // Root-absolute asset URLs: nginx serves 404.html at any missing (nested) URL, where relative `./_app` paths would 404.
    paths: { relative: false },
    prerender: {
      // Broken internal links fail the build; the CSP is emitted as a header (no kit.csp).
      handleHttpError: ({ path, message }) => {
        throw new Error(`Prerender error at ${path}: ${message}`);
      },
    },
  },
};

export default config;
