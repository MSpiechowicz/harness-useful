<script lang="ts">
  import Seo from '$lib/components/seo/Seo.svelte';
  import { PRODUCT_IDS } from '$lib/config/site';
  import { NOT_FOUND_PAGE } from '$lib/content/pages';
  import { PRODUCTS } from '$lib/content/products';
</script>

<Seo route={NOT_FOUND_PAGE} />

<div class="container missing">
  <p class="eyebrow">$ exit 404<span class="cursor">_</span></p>
  <h1>Page not found</h1>
  <p class="detail">That page does not exist or has moved. Start from the home page, pick a tool or read the FAQ.</p>

  <p class="actions">
    <a class="primary" href="/">Home</a>
    <a href="/#products">Products</a>
    <a href="/faq">FAQ</a>
  </p>

  <nav aria-label="Products">
    <ul>
      {#each PRODUCT_IDS as id (id)}
        <li><a href="/{id}" style:--tool-color={PRODUCTS[id].color}>{PRODUCTS[id].name}</a></li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .missing {
    padding-block: var(--space-9);
  }

  .eyebrow {
    margin-bottom: 20px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  .cursor {
    animation: hfBlink 1s steps(1) infinite;
  }

  h1 {
    font-family: var(--font-mono);
    font-size: clamp(34px, 4.6vw, 60px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: var(--text-strong);
  }

  .detail {
    max-width: 520px;
    margin-top: 22px;
    font-size: 18px;
    line-height: 1.6;
    color: var(--muted);
  }

  .actions,
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 30px 0 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: inline-block;
    padding: 12px 18px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    color: var(--tool-color, var(--text));
    font-family: var(--font-mono);
    text-decoration: none;
  }

  a:hover {
    border-color: var(--tool-color, var(--accent));
    color: var(--tool-color, var(--accent));
  }

  .primary {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-ink);
    font-weight: 700;
  }

  .primary:hover {
    background: var(--accent-hover);
    color: var(--accent-ink);
  }
</style>
