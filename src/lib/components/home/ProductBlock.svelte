<script lang="ts">
  import type { Snippet } from 'svelte';
  import { PRODUCTS } from '$lib/content/products';
  import type { ProductBlock } from '$lib/content/types';

  interface Props {
    block: ProductBlock;
    /** Put the demo on the left (every second block of the board). */
    reverse?: boolean;
    /** The animated demo (decorative, aria-hidden). */
    demo: Snippet;
  }

  let { block, reverse = false, demo }: Props = $props();

  const name = $derived(PRODUCTS[block.id].name);
</script>

<article class="block" class:reverse style:--tone={block.color} aria-labelledby="{block.id}-h">
  <div class="text">
    <p class="tag"><span class="mark" style:background={block.grad}></span>{block.tag}</p>
    <h2 id="{block.id}-h">{block.title}</h2>
    <p class="lead">{block.lead}</p>

    <ul class="bullets">
      {#each block.bullets as item (item.h)}
        <li>
          <span class="tick" aria-hidden="true">✓</span>
          <span><b>{item.h}</b><span class="detail">{item.p}</span></span>
        </li>
      {/each}
    </ul>

    <p class="links">
      <a href="/{block.id}">Read more about {name}</a>
      <a href={block.href} rel="noopener">README ↗</a>
    </p>
  </div>

  <div class="demo-col">
    <div class="demo-scroll" aria-hidden="true">{@render demo()}</div>
    <p class="note" aria-hidden="true">{block.note}</p>
  </div>
</article>

<style>
  .block {
    display: flex;
    flex-wrap: wrap;
    gap: 48px;
    align-items: center;
  }

  .block.reverse {
    flex-direction: row-reverse;
  }

  .text {
    flex: 1 1 380px;
    min-width: 0;
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--tone);
  }

  .mark {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  h2 {
    font-family: var(--font-mono);
    font-size: clamp(26px, 3vw, 38px);
    line-height: 1.12;
    letter-spacing: -0.04em;
    color: var(--text-strong);
  }

  .lead {
    margin-top: 14px;
    font-size: 17px;
    line-height: 1.6;
    color: var(--muted);
  }

  .bullets {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 26px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    gap: 12px;
  }

  .tick {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    margin-top: 3px;
    border: 1px solid var(--tone);
    border-radius: 5px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--tone);
  }

  b {
    display: block;
    font-size: 15px;
    color: var(--text-strong);
  }

  .detail {
    font-size: 14px;
    line-height: 1.55;
    color: var(--muted);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    margin-top: 26px;
    font-family: var(--font-mono);
    font-size: 14px;
  }

  .demo-col {
    flex: 1.4 1 540px;
    min-width: 0;
  }

  .demo-scroll {
    overflow-x: auto;
  }

  .note {
    margin: 10px 2px 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--subtle);
  }
</style>
