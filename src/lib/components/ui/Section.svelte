<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string;
    /** Heading text. Rendered as the section's accessible name. */
    title?: string;
    /** Mono green line above the heading, e.g. `$ harness trace`. */
    eyebrow?: string;
    /** Intro paragraph under the heading. */
    lead?: string;
    /** Heading level of `title`. */
    headingLevel?: 2 | 3;
    /** Id of a heading rendered by the consumer inside `children`; used instead of `title`. */
    labelledby?: string;
    /** `alt` renders the full-width bordered band used by the board's tours section. */
    tone?: 'default' | 'alt';
    children?: Snippet;
  }

  let { id, title, eyebrow, lead, headingLevel = 2, labelledby, tone = 'default', children }: Props = $props();

  const uid = $props.id();
  const headingId = `section-h-${uid}`;
  const labelId = $derived(labelledby ?? (title ? headingId : undefined));
</script>

<section {id} aria-labelledby={labelId} class:alt={tone === 'alt'}>
  <div class="container">
    {#if eyebrow || title || lead}
      <header>
        {#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
        {#if title}
          <svelte:element this={`h${headingLevel}`} id={headingId} class="title">{title}</svelte:element>
        {/if}
        {#if lead}<p class="lead">{lead}</p>{/if}
      </header>
    {/if}

    {@render children?.()}
  </div>
</section>

<style>
  section {
    padding-block: var(--section-space);
  }

  section.alt {
    border-top: 1px solid var(--border-soft);
    background: var(--panel-alt);
  }

  header {
    margin-bottom: 28px;
  }

  .eyebrow {
    margin-bottom: 10px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  .title {
    max-width: 900px;
    font-family: var(--font-mono);
    font-size: clamp(26px, 3vw, 40px);
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: var(--text-strong);
  }

  /* A title that opens the section: trim the space above its capitals so the gap under the section's top edge reads
     the same as the gap above its bottom edge. */
  header > .title:first-child {
    text-box: trim-start cap alphabetic;
  }

  .lead {
    max-width: 640px;
    margin-top: 12px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--muted);
  }
</style>
