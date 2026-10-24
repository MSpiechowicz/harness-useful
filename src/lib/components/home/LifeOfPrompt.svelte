<script lang="ts">
  import { NET_COLORS, NET_ENDS, NET_HOPS, NET_MS, NET_NODES, SECTIONS } from '$lib/content/home';
  import { netFrame } from '$lib/motion/anims';
  import { createStepper } from '$lib/motion/ticker.svelte';
  import NetworkSvg from './NetworkSvg.svelte';
  import { NET_HEIGHT, NET_NODE_POS, NET_WIDTH } from './net-paths';

  const stepper = createStepper({ count: NET_HOPS.length, interval: NET_MS });

  const frame = $derived(netFrame(stepper.index));
  const hop = $derived(NET_HOPS[stepper.index]);

  const NODE_NAMES = Object.fromEntries(NET_NODES.map((node) => [node.key, node.name]));
  const ends = $derived(NET_ENDS[hop.link].map((key) => ({ name: NODE_NAMES[key], color: NET_COLORS[key] })));

  // The 1120 x 560 diagram scales down to fit narrow screens; without JS it scrolls sideways instead.
  let stageWidth = $state(NET_WIDTH);
  const scale = $derived(Math.min(1, stageWidth / NET_WIDTH));
</script>

<section id="flow" class="container flow" aria-labelledby="flow-h">
  <header class="head">
    <div class="intro">
      <p class="eyebrow">{SECTIONS.flow.prompt}</p>
      <h2 id="flow-h">{SECTIONS.flow.title}</h2>
      <p class="lead">{SECTIONS.flow.lead}</p>
    </div>
  </header>

  <!-- The diagram is decorative; the current step is announced in the panel below. -->
  <div class="stage" aria-hidden="true" style:--s={scale} bind:clientWidth={stageWidth} {@attach stepper.observe}>
    <div class="dots"></div>

    <div class="canvas" style:width="{NET_WIDTH}px" style:height="{NET_HEIGHT}px">
      <NetworkSvg link={frame.link} />

      {#each NET_NODES as node (node.key)}
        {@const look = frame.nodes[node.key]}
        {@const pos = NET_NODE_POS[node.key]}
        <div
          class="node"
          class:from={look.role === 'from'}
          class:to={look.role === 'to'}
          style:left="{pos.left}px"
          style:top="{pos.top}px"
          style:--tone={NET_COLORS[node.key]}
        >
          <div class="name"><span class="swatch"></span>{node.name}</div>
          <div class="sub">{node.sub}</div>
          {#if look.role === 'to'}
            <!-- Keyed by step so the bloom replays even when the same card receives two steps in a row. -->
            {#key stepper.index}<span class="bloom"></span>{/key}
          {/if}
        </div>
      {/each}
    </div>

    <div class="caption-row">
      {#key stepper.index}
        <div class="caption" style:animation-name={frame.caption.anim}>
          <span class="dot" style:background={frame.caption.color} style:box-shadow="0 0 10px {frame.caption.color}"></span>
          <span class="caption-title">{frame.caption.title}</span>
          <span class="caption-sub">{frame.caption.sub}</span>
        </div>
      {/key}
    </div>
  </div>

  <article class="panel" aria-live={stepper.playing ? 'off' : 'polite'}>
    {#key stepper.index}
      <div class="text">
        <p class="count" style:color={frame.caption.color}>step {frame.num} / {frame.total}</p>
        <h3>{hop.title}</h3>
        <p class="body">{hop.body}</p>
      </div>

      <dl class="trace">
        <div>
          <dt>from</dt>
          <dd><span class="end" style:--tone={ends[0].color}></span>{ends[0].name}</dd>
        </div>
        <div>
          <dt>to</dt>
          <dd><span class="end" style:--tone={ends[1].color}></span>{ends[1].name}</dd>
        </div>
        <div>
          <dt>sends</dt>
          <dd class="code">{hop.s}</dd>
        </div>
        <div>
          <dt>result</dt>
          <dd class="result">{hop.benefit}</dd>
        </div>
      </dl>
    {/key}
  </article>
</section>

<style>
  .flow {
    padding-block: 96px 72px;
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .intro {
    flex: 1 1 520px;
  }

  .eyebrow {
    margin-bottom: 10px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  h2 {
    font-family: var(--font-mono);
    font-size: clamp(28px, 3.4vw, 44px);
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: var(--text-strong);
  }

  .lead {
    margin-top: 12px;
    max-width: 640px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--muted);
  }

  /* Stage: a 600px panel holding the 1120 x 560 diagram; --s shrinks it on narrow screens. */
  .stage {
    --s: 1;

    position: relative;
    height: calc(534px * var(--s) + 66px);
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 6%);
    border-radius: 22px;
    background: radial-gradient(900px 420px at 60% 45%, rgb(94 179 255 / 7%), transparent 70%), #07090b;
  }

  .dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgb(255 255 255 / 6%) 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: radial-gradient(75% 75% at 55% 50%, #000 35%, transparent 100%);
  }

  .canvas {
    position: absolute;
    left: 50%;
    /* Pulled up into the empty band above the top card, so the lowest line keeps clear of the caption. */
    top: calc(-10px * var(--s));
    transform: translateX(-50%) scale(var(--s));
    transform-origin: top center;
  }

  .node {
    position: absolute;
    z-index: 2;
    width: 172px;
    height: 54px;
    padding: 8px 12px;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 12px;
    background: linear-gradient(#0e1314, #0b0f10);
    box-shadow: 0 10px 30px rgb(0 0 0 / 40%);
    font-family: var(--font-mono);
    transition:
      border-color 0.4s ease,
      box-shadow 0.4s ease;
  }

  .node.from {
    border-color: color-mix(in srgb, var(--tone) 55%, transparent);
    box-shadow:
      0 0 18px color-mix(in srgb, var(--tone) 18%, transparent),
      0 10px 30px rgb(0 0 0 / 40%);
  }

  /* The receiver lights up fully when the hot line lands on it (the line draws in 0.7s; see NetworkSvg). */
  .node.to {
    border-color: var(--tone);
    box-shadow:
      0 0 0 1px var(--tone),
      0 0 22px color-mix(in srgb, var(--tone) 55%, transparent),
      0 0 64px color-mix(in srgb, var(--tone) 28%, transparent);
    transition-delay: 0.55s;
  }

  .name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text-strong);
    white-space: nowrap;
  }

  .swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: var(--tone);
    box-shadow: 0 0 8px var(--tone);
  }

  .sub {
    margin-top: 4px;
    font-size: 10.5px;
    color: #8a9a96;
    white-space: nowrap;
  }

  .bloom {
    position: absolute;
    inset: -1px;
    border-radius: 12px;
    color: var(--tone);
    opacity: 0;
    pointer-events: none;
    animation: nfRing 0.9s ease-out 0.55s;
  }

  .caption-row {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 22px;
    display: flex;
    justify-content: center;
    padding-inline: 12px;
  }

  .caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px 12px;
    padding: 10px 18px;
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: 999px;
    background: rgb(12 16 17 / 92%);
    font-family: var(--font-mono);
    font-size: 13.5px;
    animation: 0.5s ease both;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .caption-title {
    font-weight: 700;
    color: var(--text-strong);
  }

  .caption-sub {
    color: #8a9a96;
  }

  /* Fixed height: every step gets the same card, whatever the length of its text. */
  .panel {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    height: 196px;
    margin-top: 16px;
    padding: 22px 26px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  .text,
  .trace {
    animation: hfFadeA 0.5s ease both;
  }

  .count {
    margin-bottom: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
  }

  h3 {
    font-size: 22px;
    line-height: 1.25;
    color: var(--text-strong);
  }

  .body {
    margin-top: 8px;
    font-size: 15px;
    line-height: 1.6;
    color: #a9b6b2;
  }

  /* Trace readout of the step: who talks to whom, what travels, what you get. */
  .trace {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--panel-alt);
    font-family: var(--font-mono);
    font-size: 12.5px;
  }

  .trace div {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 12px;
    align-items: baseline;
  }

  dt {
    color: var(--subtle);
  }

  dd {
    margin: 0;
    color: var(--text-strong);
  }

  .end {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 8px;
    border-radius: 2px;
    background: var(--tone);
    box-shadow: 0 0 8px var(--tone);
  }

  .code {
    color: var(--accent);
  }

  .result {
    color: #a9b6b2;
  }

  @media (max-width: 900px) {
    .panel {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
      align-items: start;
      height: auto;
      min-height: 420px;
    }
  }

  @media (max-width: 640px) {
    .flow {
      padding-block: 72px 56px;
    }
  }
</style>
