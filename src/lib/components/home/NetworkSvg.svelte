<script lang="ts">
  import { fade } from 'svelte/transition';
  import { NET_COLORS, NET_ENDS } from '$lib/content/home-net';
  import { NET_HEIGHT, NET_LINKS, NET_WIDTH, NET_WIRES, quietColor } from './net-paths';

  interface Props {
    /** Index of the link running hot (Hop.link of the current step). */
    link: number;
  }

  let { link }: Props = $props();

  const gradient = (index: number) => `url(#nf-g${index})`;
  const hot = $derived(NET_LINKS[link]);
  const receiver = $derived(NET_COLORS[NET_ENDS[link][1]]);

  // The request direction of each wire colours it; NET_LINKS lists every wire's request before its reply.
  const wireEnds = NET_WIRES.map((_, wire) => NET_ENDS[NET_LINKS.findIndex((item) => item.wire === wire)]);

  // The comet's tail is a stack of streaks that share its head: longer ones are fainter, so the tail fades out behind it.
  // Streaks have a real length; a zero-length round cap turns into a plus or a square once the diagram is scaled down.
  const TAIL = [
    { length: 44, width: 1.6, opacity: 0.12 },
    { length: 28, width: 1.8, opacity: 0.2 },
    { length: 16, width: 2.2, opacity: 0.35 },
    { length: 7, width: 2.6, opacity: 0.6 },
  ];
</script>

<!--
  The family as a quiet network. Every connection is one still wire, drawn opaque in a dimmed request gradient so the dot
  grid never shows through it. Only the link of the current step moves: it lights up at once in its sender-to-receiver
  gradient and a comet runs along it from sender to receiver, so a reply runs back along its request's wire. The link is
  re-mounted on every step, which restarts the comet, and crossfades with the link of the previous step. Purely decorative: the step text lives outside the SVG.
-->
<svg class="net-svg" width={NET_WIDTH} height={NET_HEIGHT} viewBox="0 0 {NET_WIDTH} {NET_HEIGHT}" aria-hidden="true" focusable="false">
  <defs>
    <!-- userSpaceOnUse: a straight path has a zero-height (or zero-width) bounding box, which collapses a bbox-relative blur. -->
    <filter id="nf-soft" filterUnits="userSpaceOnUse" x="0" y="0" width={NET_WIDTH} height={NET_HEIGHT}>
      <feGaussianBlur stdDeviation="3.5" />
    </filter>

    {#each NET_LINKS as item, index (index)}
      {@const [fromKey, toKey] = NET_ENDS[index]}
      <linearGradient id="nf-g{index}" gradientUnits="userSpaceOnUse" x1={item.from[0]} y1={item.from[1]} x2={item.to[0]} y2={item.to[1]}>
        <stop offset="0" stop-color={NET_COLORS[fromKey]} />
        <stop offset="1" stop-color={NET_COLORS[toKey]} />
      </linearGradient>
    {/each}

    {#each NET_WIRES as item, index (index)}
      {@const [fromKey, toKey] = wireEnds[index]}
      <linearGradient id="nf-w{index}" gradientUnits="userSpaceOnUse" x1={item.from[0]} y1={item.from[1]} x2={item.to[0]} y2={item.to[1]}>
        <stop offset="0" stop-color={quietColor(NET_COLORS[fromKey])} />
        <stop offset="1" stop-color={quietColor(NET_COLORS[toKey])} />
      </linearGradient>
    {/each}
  </defs>

  {#each NET_WIRES as item, index (index)}
    <path d={item.d} fill="none" stroke="url(#nf-w{index})" stroke-width="1.4" stroke-linecap="round" />
  {/each}

  {#key link}
    <!-- The link of the previous step fades out while this one fades in, so a step never snaps to the next. -->
    <g style:--len={hot.length} transition:fade={{ duration: 700 }}>
      <path d={hot.d} fill="none" stroke={gradient(link)} stroke-width="5" opacity=".25" filter="url(#nf-soft)" />
      <path d={hot.d} fill="none" stroke={gradient(link)} stroke-width="1.6" stroke-linecap="round" />

      <path
        class="comet"
        d={hot.d}
        fill="none"
        stroke={receiver}
        stroke-width="7"
        stroke-linecap="round"
        stroke-dasharray="10 {hot.length + 60}"
        opacity=".45"
        filter="url(#nf-soft)"
        style:--streak={10}
      />
      {#each TAIL as streak (streak.length)}
        <path
          class="comet"
          d={hot.d}
          fill="none"
          stroke={receiver}
          stroke-width={streak.width}
          stroke-linecap="round"
          stroke-dasharray="{streak.length} {hot.length + 60}"
          opacity={streak.opacity}
          style:--streak={streak.length}
        />
      {/each}
      <path
        class="comet"
        d={hot.d}
        fill="none"
        stroke="#fff"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="2 {hot.length + 60}"
        style:--streak={2}
      />
    </g>
  {/key}
</svg>

<style>
  .net-svg {
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  /* The comet leaves the sender at once, lands in 0.9s (the receiving card lights up over the same time), then waits
     past the end of the wire and runs again. */
  .comet {
    animation: nfComet 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }

  /* The head of a streak of length --streak sits at the start of the wire, then just past its end. */
  @keyframes nfComet {
    from {
      stroke-dashoffset: calc(var(--streak) * 1px);
    }
    56%,
    to {
      stroke-dashoffset: calc((var(--streak) - var(--len) - 52) * 1px);
    }
  }

  /* Reduced motion: no comet; the current link is lit in full and stays lit. */
  @media (prefers-reduced-motion: reduce) {
    .comet {
      display: none;
    }
  }
</style>
