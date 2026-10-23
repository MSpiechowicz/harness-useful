<script lang="ts">
  import { serialize } from '$lib/seo/jsonld';

  let { data }: { data: unknown } = $props();

  // The closing tag is split so the Svelte parser does not end this script block early.
  const CLOSE_TAG = '</' + 'script>';

  // serialize() escapes "<", so the payload can never close the script element it is embedded in.
  const tag = $derived(`<script type="application/ld+json">${serialize(data)}${CLOSE_TAG}`);
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html tag}
</svelte:head>
