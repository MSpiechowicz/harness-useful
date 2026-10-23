<script lang="ts">
  import { NET_COLORS, NET_HOPS, NET_MS, NET_NODES, SECTIONS } from '$lib/content/home';
  import { netFrame } from '$lib/motion/anims';
  import { createStepper } from '$lib/motion/ticker.svelte';
  import NetworkSvg from './NetworkSvg.svelte';
  import { NET_HEIGHT, NET_NODE_POS, NET_WIDTH } from './net-paths';

  const stepper = createStepper({ count: NET_HOPS.length, interval: NET_MS });

  const frame = $derived(netFrame(stepper.index));
  const hop = $derived(NET_HOPS[stepper.index]);

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

    <div class="controls">
      <button type="button" class="step" aria-label="Previous hop" onclick={stepper.prev}>←</button>
      <button type="button" class="play" onclick={stepper.toggle}>
        <span aria-hidden="true">{stepper.playing ? '❚❚' : '▶'}</span>
        {stepper.playing ? 'Pause' : 'Play'}
      </button>
      <button type="button" class="step" aria-label="Next hop" onclick={stepper.next}>→</button>
    </div>
  </header>

  <div class="progress" aria-hidden="true"><div class="bar" style:width={frame.progress}></div></div>

  <!-- The diagram is decorative; the current hop is announced in the panel below and every hop is listed after it. -->
  <div class="stage" aria-hidden="true" style:--s={scale} bind:clientWidth={stageWidth} {@attach stepper.observe}>
    <div class="dots"></div>

    <div class="canvas" style:width="{NET_WIDTH}px" style:height="{NET_HEIGHT}px">
      <NetworkSvg link={frame.link} />

      {#each NET_NODES as node (node.key)}
        {@const look = frame.nodes[node.key]}
        {@const pos = NET_NODE_POS[node.key]}
        <div
          class="node"
          style:left="{pos.left}px"
          style:top="{pos.top}px"
          style:--tone={NET_COLORS[node.key]}
          style:--b1={look.b1}
          style:--b2={look.b2}
          style:box-shadow={look.glow}
        >
          <div class="name"><span class="swatch"></span>{node.name}</div>
          <div class="sub">{node.sub}</div>
          <span class="ring" class:on={look.ring}></span>
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
        <p class="count" style:color={frame.caption.color}>hop {frame.num} / {frame.total}</p>
        <h3>{hop.title}</h3>
        <p class="body">{hop.body}</p>
      </div>
      <p class="benefit"><span class="check" aria-hidden="true">✓</span><span>{hop.benefit}</span></p>
    {/key}
  </article>

  <!-- Every hop as text: the full journey for readers without JavaScript, crawlers and assistants. -->
  <div class="all">
    <h3>All {NET_HOPS.length} hops in order</h3>
    <ol>
      {#each NET_HOPS as item, index (item.title)}
        <li aria-current={index === stepper.index ? 'step' : undefined}>
          <strong>{item.title}</strong>
          <span class="route">{item.t}</span>
          <span class="detail">{item.body} {item.benefit}</span>
        </li>
      {/each}
    </ol>
  </div>
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

  .controls {
    display: flex;
    gap: 8px;
  }

  .controls button {
    height: 44px;
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
  }

  .step {
    width: 44px;
    border: 1px solid var(--border-strong);
    background: var(--panel);
    color: var(--text);
    font-size: 16px;
  }

  .step:hover {
    border-color: var(--accent);
  }

  .play {
    min-width: 112px;
    border: 0;
    background: var(--accent);
    color: var(--accent-ink);
    font-size: 14px;
    font-weight: 700;
  }

  .play:hover {
    background: var(--accent-hover);
  }

  .progress {
    height: 3px;
    margin: -8px 0 18px;
    border-radius: 3px;
    background: #142021;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    background: var(--accent);
    transition: width 0.6s ease;
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
    top: calc(10px * var(--s));
    transform: translateX(-50%) scale(var(--s));
    transform-origin: top center;
  }

  .node {
    position: absolute;
    z-index: 2;
    width: 172px;
    height: 54px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 12px;
    background:
      linear-gradient(#0e1314, #0b0f10) padding-box,
      linear-gradient(135deg, var(--b1), rgb(255 255 255 / 6%) 55%, var(--b2)) border-box;
    font-family: var(--font-mono);
    transition: box-shadow 0.7s ease;
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

  .ring {
    position: absolute;
    inset: -1px;
    border-radius: 12px;
    color: var(--tone);
    opacity: 0;
  }

  .ring.on {
    animation: nfRing 1.6s ease-out 0.9s infinite;
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

  .panel {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    align-items: flex-start;
    margin-top: 16px;
    padding: 20px 22px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  .text {
    flex: 1.3 1 380px;
    min-width: 0;
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

  .benefit {
    flex: 1 1 280px;
    align-self: center;
    display: flex;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-strong);
    animation: hfFadeA 0.5s ease both;
  }

  .check {
    color: var(--accent);
  }

  .all {
    margin-top: 28px;
  }

  .all h3 {
    margin-bottom: 14px;
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 600;
    color: var(--muted);
  }

  ol {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: hop;
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 14px 12px 44px;
    position: relative;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    counter-increment: hop;
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
  }

  li::before {
    content: counter(hop);
    position: absolute;
    left: 14px;
    top: 12px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--subtle);
  }

  li[aria-current='step'] {
    border-color: var(--accent);
  }

  li strong {
    font-size: 15px;
    color: var(--text-strong);
  }

  .route {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--subtle);
  }

  @media (max-width: 640px) {
    .flow {
      padding-block: 72px 56px;
    }
  }
</style>
