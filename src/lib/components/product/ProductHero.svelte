<script lang="ts">
  import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
  import { PAGES } from '$lib/content/pages';
  import type { Product } from '$lib/content/types';
  import { MARKS } from './assets';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  // "Harness Desktop" → the lockup's dim "harness" and bright "desktop" (shown lowercase, like the app logo).
  const [brand, ...rest] = $derived(product.name.split(' '));
</script>

<header class="hero">
  <div class="container">
    <Breadcrumbs items={PAGES[product.id].breadcrumbs} />

    <!-- The product lockup from harness-useful-logo (renders/<id>/lockup-dark.svg), built from text so the h1 stays real. -->
    <h1 class="lockup">
      <img class="mark" src={MARKS[product.id]} alt="" width="89" height="79" />
      <span class="dim">{brand}</span>
      <span class="name">{rest.join(' ')}</span>
    </h1>

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
    padding-block: var(--section-space);
    border-bottom: 1px solid var(--border-soft);
  }

  /* Lockup proportions (lockup-dark.svg): text 40, mark 79 tall, 23 apart, baseline 20 above the mark's bottom. */
  .lockup {
    margin-top: 36px;
    font-family: var(--font-sans);
    font-size: clamp(30px, 3.6vw, 46px);
    line-height: 1.2;
    letter-spacing: -0.01em;
    text-transform: lowercase;
  }

  .mark {
    display: inline-block;
    height: 1.98em;
    width: auto;
    margin-right: 0.58em;
    vertical-align: -0.5em;
  }

  .dim {
    font-weight: 400;
    color: #8f8f99;
  }

  .name {
    font-weight: 600;
    color: #ececf0;
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
