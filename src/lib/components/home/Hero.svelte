<script lang="ts">
  import Shot from '$lib/components/ui/Shot.svelte';
  import { HERO } from '$lib/content/home';
  import { HERO_IMAGE } from './images';

  const SIZES = '(min-width: 1240px) 700px, (min-width: 900px) 55vw, 100vw';
  const [line1, line2] = HERO.h1;
  const preload = HERO_IMAGE.sources.avif;
</script>

<svelte:head>
  {#if preload}
    <link rel="preload" as="image" type="image/avif" imagesrcset={preload} imagesizes={SIZES} fetchpriority="high" />
  {/if}
</svelte:head>

<section id="top" class="container hero" aria-labelledby="hero-h">
  <div class="copy">
    <p class="eyebrow">{HERO.eyebrow}<span class="blink" aria-hidden="true">_</span></p>

    <h1 id="hero-h">{line1}<br /><span class="accent">{line2}</span></h1>

    <p class="lead">{HERO.lead}</p>

    <div class="ctas">
      <a class="primary" href={HERO.ctas[0].href}>{HERO.ctas[0].label}</a>
      <a class="secondary" href={HERO.ctas[1].href}>{HERO.ctas[1].label}</a>
    </div>

    <dl class="stats">
      {#each HERO.stats as stat (stat.label)}
        <div>
          <dt>{stat.value}</dt>
          <dd>{stat.label}</dd>
        </div>
      {/each}
    </dl>
  </div>

  <div class="visual">
    <Shot src={HERO_IMAGE} alt={HERO.image.alt} sizes={SIZES} eager />

    <div class="chips" aria-hidden="true">
      {#each HERO.chips as chip, index (chip.title)}
        <div class="chip c{index} {chip.tool}">
          <div class="chip-title">{chip.title}</div>
          <div class="chip-text">{chip.text}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .hero {
    display: flex;
    flex-wrap: wrap;
    gap: 48px;
    align-items: center;
    padding-block: 72px 56px;
  }

  .copy {
    flex: 1 1 400px;
    min-width: 0;
  }

  .eyebrow {
    margin-bottom: 20px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  .blink {
    animation: hfBlink 1s steps(1) infinite;
  }

  h1 {
    font-family: var(--font-mono);
    font-size: clamp(34px, 4.6vw, 60px);
    line-height: 1.04;
    letter-spacing: -0.05em;
    font-weight: 800;
    color: var(--text-strong);
  }

  .accent {
    color: var(--accent);
  }

  .lead {
    margin-top: 22px;
    max-width: 520px;
    font-size: 18px;
    line-height: 1.6;
    color: var(--muted);
  }

  .ctas {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .ctas a {
    padding: 14px 20px;
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    text-decoration: none;
  }

  .primary {
    background: var(--accent);
    color: var(--accent-ink);
    font-weight: 700;
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
    color: var(--text-strong);
  }

  .stats {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    font-family: var(--font-mono);
  }

  dt {
    font-size: 28px;
    font-weight: 800;
    color: var(--text-strong);
  }

  dd {
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
  }

  .visual {
    position: relative;
    flex: 1.3 1 520px;
    min-width: 0;
    padding-block: 28px;
  }

  .chip {
    --tone: var(--c-desktop);
    --tone-border: #2c4a5e;

    position: absolute;
    padding: 10px 14px;
    background: var(--panel);
    border: 1px solid var(--tone-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 12px 30px rgb(0 0 0 / 50%);
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.6;
  }

  .chip.memory {
    --tone: var(--c-memory);
    --tone-border: #5a2a63;
  }

  .chip.dashboard {
    --tone: var(--c-dashboard);
    --tone-border: #5e4512;
  }

  .chip.skills {
    --tone: var(--c-skills);
    --tone-border: #34501f;
  }

  .chip-title {
    color: var(--tone);
  }

  .chip-text {
    color: var(--text-strong);
  }

  .c0 {
    left: -18px;
    top: 0;
    animation: hfFloat 6s ease-in-out infinite;
  }

  .c1 {
    right: -14px;
    top: 30%;
    animation: hfFloat 7s ease-in-out -2s infinite;
  }

  .c2 {
    left: 8%;
    bottom: -6px;
    animation: hfFloat 8s ease-in-out -4s infinite;
  }

  .c3 {
    right: 6%;
    bottom: -6px;
    animation: hfFloat 6.5s ease-in-out -1s infinite;
  }

  @media (max-width: 640px) {
    .chips {
      display: none;
    }

    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
