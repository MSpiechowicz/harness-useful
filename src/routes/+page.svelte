<script lang="ts">
  import Seo from '$lib/components/seo/Seo.svelte';
  import FaqList from '$lib/components/ui/FaqList.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import { FAMILY_FAQ } from '$lib/content/faq';
  import { BLOCKS } from '$lib/content/home';
  import DashboardShowcase from '$lib/components/home/DashboardShowcase.svelte';
  import DataLives from '$lib/components/home/DataLives.svelte';
  import DesktopDemo from '$lib/components/home/DesktopDemo.svelte';
  import DiffStat from '$lib/components/home/DiffStat.svelte';
  import Hero from '$lib/components/home/Hero.svelte';
  import Install from '$lib/components/home/Install.svelte';
  import LifeOfPrompt from '$lib/components/home/LifeOfPrompt.svelte';
  import Marquee from '$lib/components/home/Marquee.svelte';
  import MemoryDemo from '$lib/components/home/MemoryDemo.svelte';
  import ProductBlock from '$lib/components/home/ProductBlock.svelte';
  import SkillsDemo from '$lib/components/home/SkillsDemo.svelte';
  import Tours from '$lib/components/home/Tours.svelte';
  import WhichTool from '$lib/components/home/WhichTool.svelte';
</script>

<Seo route="home" />

<Hero />
<Marquee />
<LifeOfPrompt />
<WhichTool />
<DiffStat />

<section id="products" class="container products" aria-label="Products">
  {#each BLOCKS as block, index (block.id)}
    <ProductBlock {block} reverse={index % 2 === 1}>
      {#snippet demo()}
        {#if block.id === 'desktop'}
          <DesktopDemo />
        {:else if block.id === 'skills'}
          <SkillsDemo />
        {:else}
          <MemoryDemo />
        {/if}
      {/snippet}
    </ProductBlock>
  {/each}
</section>

<DashboardShowcase />
<DataLives />
<Tours />
<Install />

<Section id="faq" title="Questions about the family" headingLevel={2}>
  <FaqList items={FAMILY_FAQ.slice(0, 4)} headingLevel={3} openCount={0} />
  <p class="more"><a href="/faq">All questions and answers</a></p>
</Section>

<style>
  .products {
    display: flex;
    flex-direction: column;
    gap: 112px;
    padding-block: 96px 24px;
  }

  .more {
    margin-top: 20px;
    font-family: var(--font-mono);
    font-size: 14px;
  }
</style>
