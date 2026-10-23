<script lang="ts">
  import type { Snippet } from 'svelte';
  import '@fontsource-variable/inter';
  import '@fontsource-variable/jetbrains-mono';
  import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
  import monoLatin from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url';
  import '../app.css';
  import Footer from '$lib/components/layout/Footer.svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import SkipLink from '$lib/components/layout/SkipLink.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <link rel="preload" as="font" type="font/woff2" href={interLatin} crossorigin="anonymous" />
  <link rel="preload" as="font" type="font/woff2" href={monoLatin} crossorigin="anonymous" />
</svelte:head>

<SkipLink />
<Header />
<main id="main" tabindex="-1">
  {@render children()}
</main>
<Footer />

<style>
  main {
    flex: 1 0 auto;
  }

  main:focus {
    outline: none;
  }
</style>
