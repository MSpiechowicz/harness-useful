import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [enhancedImages(), sveltekit()],
  build: {
    // Never inline assets: the CSP has no data: sources.
    assetsInlineLimit: 0,
  },
  server: {
    fs: { allow: ['.generated', 'static'] },
  },
});
