<script lang="ts">
  import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
  import { GRADIENTS } from '$lib/config/site';
  import { PAGES } from '$lib/content/pages';
  import type { Product } from '$lib/content/types';
  import { MARKS } from './assets';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  const gradient = $derived(GRADIENTS[product.id]);
</script>

<header class="hero">
  <div class="container">
    <Breadcrumbs items={PAGES[product.id].breadcrumbs} />

    <div class="title-row" style:--bar="linear-gradient(180deg, {gradient[1]}, {gradient[0]})">
      <img class="mark" src={MARKS[product.id]} alt="" width="89" height="79" />
      <h1>{product.name}</h1>
    </div>

    <p class="definition">{product.definition}</p>
    <p class="tagline">{product.tagline}</p>

    <ul class="facts">
      <li>{product.license}</li>
      <li>{product.platforms.join(' · ')}</li>
    </ul>

    <p class="actions">
      <a class="primary" href="#install">Install {product.name}</a>
      <a class="secondary" href={product.repo} rel="noopener">View on GitHub</a>
      <a class="secondary" href={product.releases} rel="noopener">Releases</a>
    </p>
  </div>
</header>

<style>
  .hero {
    padding-block: 28px var(--space-7);
    border-bottom: 1px solid var(--border-soft);
  }

  .title-row {
    display: flex;
    align-items: stretch;
    gap: 18px;
    margin-top: 36px;
  }

  .title-row::before {
    content: '';
    width: 4px;
    border-radius: 2px;
    background: var(--bar);
  }

  .mark {
    align-self: center;
    width: 56px;
    height: auto;
  }

  h1 {
    align-self: center;
    font-family: var(--font-mono);
    font-size: clamp(34px, 4.6vw, 60px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: var(--text-strong);
  }

  .definition {
    max-width: 760px;
    margin-top: 24px;
    font-size: clamp(18px, 1.6vw, 21px);
    line-height: 1.55;
    color: var(--text);
  }

  .tagline {
    margin-top: 14px;
    font-family: var(--font-mono);
    font-size: 15px;
    color: var(--accent);
  }

  .tagline::before {
    content: '$ ';
    color: var(--subtle);
  }

  .facts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 22px 0 0;
    padding: 0;
    list-style: none;
  }

  .facts li {
    padding: 4px 10px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .actions a {
    padding: 12px 18px;
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-weight: 700;
    text-decoration: none;
  }

  .primary {
    background: var(--accent);
    color: var(--accent-ink);
  }

  .primary:hover {
    background: var(--accent-hover);
    color: var(--accent-ink);
  }

  .secondary {
    border: 1px solid var(--border-strong);
    color: var(--text);
  }

  .secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
