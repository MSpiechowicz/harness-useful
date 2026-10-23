<script lang="ts">
  import type { RouteId } from '$lib/config/site';
  import type { PageMeta } from '$lib/content/types';
  import { pageGraph } from '$lib/seo/jsonld';
  import { buildMeta } from '$lib/seo/meta';
  import JsonLd from './JsonLd.svelte';

  interface Props {
    /** A route id (full metadata and JSON-LD graph) or an explicit PageMeta (metadata only). */
    route: RouteId | PageMeta;
    /** Extra JSON-LD documents rendered after the page graph. */
    jsonld?: unknown[];
  }

  let { route, jsonld = [] }: Props = $props();

  const meta = $derived(buildMeta(route));
  const graph = $derived(typeof route === 'string' ? pageGraph(route) : undefined);
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  <meta name="robots" content={meta.robots} />
  <link rel="canonical" href={meta.canonical} />

  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  {#if meta.markdown}
    <link rel="alternate" type="text/markdown" href={meta.markdown} title="Markdown version of this page" />
  {/if}
  <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />

  <meta property="og:type" content={meta.og.type} />
  <meta property="og:site_name" content={meta.og.siteName} />
  <meta property="og:locale" content={meta.og.locale} />
  <meta property="og:title" content={meta.og.title} />
  <meta property="og:description" content={meta.og.description} />
  <meta property="og:url" content={meta.og.url} />
  <meta property="og:image" content={meta.og.image} />
  <meta property="og:image:width" content={String(meta.og.imageWidth)} />
  <meta property="og:image:height" content={String(meta.og.imageHeight)} />
  <meta property="og:image:alt" content={meta.og.imageAlt} />

  <meta name="twitter:card" content={meta.twitter.card} />
  <meta name="twitter:title" content={meta.twitter.title} />
  <meta name="twitter:description" content={meta.twitter.description} />
  <meta name="twitter:image" content={meta.twitter.image} />
  <meta name="twitter:image:alt" content={meta.twitter.imageAlt} />
</svelte:head>

{#if graph}
  <JsonLd data={graph} />
{/if}
{#each jsonld as extra, index (index)}
  <JsonLd data={extra} />
{/each}
