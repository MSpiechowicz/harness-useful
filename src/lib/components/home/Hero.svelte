<script lang="ts">
  import Shot from '$lib/components/ui/Shot.svelte';
  import { HERO } from '$lib/content/home';
  import { createTicker } from '$lib/motion/ticker.svelte';
  import type { TransitionConfig } from 'svelte/transition';
  import { HERO_IMAGE } from './images';

  // 646px = the image inside the 648px visual (1px frame border each side) at full container width; see images.ts.
  const SIZES = '(min-width: 1240px) 646px, (min-width: 900px) 55vw, 100vw';
  const [line1, line2] = HERO.h1;
  const preload = HERO_IMAGE.sources.avif;

  // Live feed: on every tick the next chip (in prompt order) swaps in its next event and its border flashes. The chips
  // never move, so their text stays sharp over the screenshot.
  const ORDER: readonly number[] = HERO.chipOrder;
  const ticker = createTicker({ interval: 2200 });

  /** How many times the chip has been updated, wrapped to its event list (0 = the static frame). */
  function eventIndex(chip: number): number {
    const position = ORDER.indexOf(chip);

    return Math.floor((ticker.tick + ORDER.length - 1 - position) / ORDER.length) % HERO.chips[chip].events.length;
  }

  const wipe: (node: Element) => TransitionConfig = () => ({
    duration: 350,
    css: (t: number) => `opacity: ${t}; clip-path: inset(0 ${(1 - t) * 100}% 0 0)`,
  });

  /** Border flash: fades in over the first fifth, then out. */
  const flash: (node: Element) => TransitionConfig = () => ({
    duration: 1400,
    css: (t: number) => `opacity: ${t < 0.2 ? t / 0.2 : (1 - t) / 0.8}`,
  });
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

  <div class="visual" {@attach ticker.observe}>
    <Shot src={HERO_IMAGE} alt={HERO.image.alt} sizes={SIZES} eager />

    <div class="chips" aria-hidden="true">
      {#each HERO.chips as chip, index (chip.tool)}
        {@const step = eventIndex(index)}
        {@const event = chip.events[step]}
        <div class="chip c{index} {chip.tool}">
          <!-- Key on the number: an object key counts as changed on every tick and would replay every chip at once. -->
          {#key step}
            <span class="flash" in:flash></span>
            <div in:wipe>
              <div class="chip-title">{event.title}</div>
              <div class="chip-text">{event.text}</div>
            </div>
          {/key}
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
    padding-block: 64px;
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
    display: flex;
    flex-wrap: wrap;
    gap: 16px 40px;
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
    box-shadow: 0 4px 12px rgb(0 0 0 / 35%);
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
    white-space: nowrap;
  }

  .flash {
    position: absolute;
    inset: -1px;
    border: 1px solid var(--tone);
    border-radius: inherit;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone) 18%, transparent);
    opacity: 0;
    pointer-events: none;
  }

  .c0 {
    left: -18px;
    top: 0;
    animation: chipIn 0.6s ease-out 0.2s backwards;
  }

  .c1 {
    right: -14px;
    top: 30%;
    animation: chipIn 0.6s ease-out 0.35s backwards;
  }

  .c2 {
    left: 8%;
    bottom: -6px;
    animation: chipIn 0.6s ease-out 0.5s backwards;
  }

  .c3 {
    right: 6%;
    bottom: -6px;
    animation: chipIn 0.6s ease-out 0.65s backwards;
  }

  @keyframes chipIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  /* Full container width: a fixed visual width keeps the screenshot at exactly its built size (no resampling). */
  @media (min-width: 1240px) {
    .visual {
      flex: 0 0 648px;
    }
  }

  @media (max-width: 640px) {
    .chips {
      display: none;
    }
  }
</style>
