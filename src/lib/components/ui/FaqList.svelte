<script lang="ts">
  import type { Faq } from '$lib/content/types';

  interface Props {
    items: Faq[];
    /** Heading level of each question. */
    headingLevel?: 2 | 3;
    /** How many leading questions start expanded. Every answer is in the DOM either way. */
    openCount?: number;
  }

  let { items, headingLevel = 3, openCount = 3 }: Props = $props();
</script>

<div class="faq">
  {#each items as item, index (item.q)}
    <details open={index < openCount}>
      <summary>
        <svelte:element this={`h${headingLevel}`}>{item.q}</svelte:element>
      </summary>
      <p>{item.a}</p>
    </details>
  {/each}
</div>

<style>
  .faq {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  details {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--panel);
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 18px;
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '+';
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 18px;
    color: var(--accent);
  }

  details[open] > summary::after {
    content: '−';
  }

  summary :global(:is(h2, h3)) {
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: -0.02em;
    color: var(--text-strong);
  }

  p {
    padding: 0 18px 18px;
    max-width: 760px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--muted);
  }
</style>
