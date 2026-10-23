<script lang="ts">
  import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import FaqList from '$lib/components/ui/FaqList.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import { PRODUCT_IDS } from '$lib/config/site';
  import { FAMILY_FAQ } from '$lib/content/faq';
  import { PAGES } from '$lib/content/pages';
  import { PRODUCTS } from '$lib/content/products';

  const groups = PRODUCT_IDS.map((id) => PRODUCTS[id]);
</script>

<Seo route="faq" />

<header class="hero">
  <div class="container">
    <Breadcrumbs items={PAGES.faq.breadcrumbs} />

    <h1>Harness Useful FAQ</h1>
    <p class="intro">
      Harness Useful is a family of four open-source, local tools for coding-agent harnesses: Harness Desktop is the window, Harness Skills
      the workflow, Harness Memory the shared project memory and Harness Dashboard the usage and cost meter. These answers cover what they
      are, where to start, which agents they support, how to install them and where your data lives.
    </p>

    <nav aria-label="FAQ groups">
      <ul class="jump">
        <li><a href="#family">Family</a></li>
        {#each groups as product (product.id)}
          <li><a href="#{product.id}-faq" style:--tool-color={product.color}>{product.name}</a></li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

<Section id="family" title="Harness Useful questions" eyebrow="$ harness-useful --faq">
  <FaqList items={FAMILY_FAQ} headingLevel={3} openCount={FAMILY_FAQ.length} />
</Section>

{#each groups as product (product.id)}
  <Section id="{product.id}-faq" labelledby="{product.id}-faq-title">
    <header class="group" style:--tool-color={product.color}>
      <p class="eyebrow">$ {product.id} --faq</p>
      <h2 id="{product.id}-faq-title"><a href="/{product.id}">{product.name} FAQ</a></h2>
    </header>
    <FaqList items={product.faq} headingLevel={3} openCount={product.faq.length} />
  </Section>
{/each}

<style>
  .hero {
    padding-block: 28px var(--space-7);
    border-bottom: 1px solid var(--border-soft);
  }

  h1 {
    margin-top: 36px;
    font-family: var(--font-mono);
    font-size: clamp(34px, 4.6vw, 60px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: var(--text-strong);
  }

  .intro {
    max-width: 760px;
    margin-top: 24px;
    font-size: clamp(18px, 1.6vw, 21px);
    line-height: 1.55;
    color: var(--text);
  }

  .jump {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 28px 0 0;
    padding: 0;
    list-style: none;
  }

  .jump a {
    display: inline-block;
    padding: 8px 14px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--tool-color, var(--text));
    text-decoration: none;
  }

  .jump a:hover {
    border-color: var(--tool-color, var(--accent));
  }

  .group {
    margin-bottom: 28px;
    padding-left: 16px;
    border-left: 3px solid var(--tool-color);
  }

  .eyebrow {
    margin-bottom: 8px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--tool-color);
  }

  h2 {
    font-family: var(--font-mono);
    font-size: clamp(26px, 3vw, 40px);
    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  h2 a {
    color: var(--text-strong);
    text-decoration: none;
  }

  h2 a:hover {
    color: var(--tool-color);
  }
</style>
