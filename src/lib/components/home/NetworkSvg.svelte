<script lang="ts">
  import { NET_COLORS, NET_ENDS } from '$lib/content/home-net';
  import { NET_HEIGHT, NET_LINKS, NET_WIDTH, packetDelays } from './net-paths';

  interface Props {
    /** Index of the link running hot (Hop.link of the current step). */
    link: number;
  }

  let { link }: Props = $props();

  const gradient = (index: number) => `url(#nf-g${index})`;
  const hot = $derived(NET_LINKS[link]);
</script>

<!--
  The family as a living network. Every link is a quiet wire in its sender-to-receiver gradient with two light packets
  drifting along it. The link of the current step is re-mounted on every step: it draws itself from sender to receiver,
  then a bright pulse keeps running along it. Purely decorative: the step text lives outside the SVG.
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
  </defs>

  {#each NET_LINKS as item, index (index)}
    <path class="wire" d={item.d} fill="none" stroke={gradient(index)} stroke-width="1.2" />

    {#each packetDelays(index) as delay (delay)}
      <path
        class="packet"
        d={item.d}
        pathLength="100"
        fill="none"
        stroke={gradient(index)}
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-dasharray="0.01 99.99"
        style:animation-delay={delay}
      />
    {/each}
  {/each}

  {#key link}
    <g class="hot">
      <path
        class="draw"
        d={hot.d}
        pathLength="100"
        fill="none"
        stroke={gradient(link)}
        stroke-width="6"
        opacity=".45"
        filter="url(#nf-soft)"
      />
      <path class="draw" d={hot.d} pathLength="100" fill="none" stroke={gradient(link)} stroke-width="1.8" stroke-linecap="round" />
      <path
        class="pulse"
        d={hot.d}
        pathLength="100"
        fill="none"
        stroke={gradient(link)}
        stroke-width="7"
        stroke-linecap="round"
        stroke-dasharray="0.01 99.99"
        filter="url(#nf-soft)"
      />
      <path
        class="pulse"
        d={hot.d}
        pathLength="100"
        fill="none"
        stroke="#fff"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="0.01 99.99"
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

  .wire {
    opacity: 0.16;
  }

  .packet {
    opacity: 0.55;
    animation: nfTravel 6s linear infinite;
  }

  .hot {
    animation: nfShow 0.35s ease both;
  }

  /* The hot line draws itself from sender to receiver in 0.7s; the receiving card lights up as it lands. */
  .draw {
    stroke-dasharray: 100 100;
    animation: nfDraw 0.7s cubic-bezier(0.3, 0.7, 0.2, 1) both;
  }

  .pulse {
    opacity: 0;
    animation:
      nfTravel 1.5s cubic-bezier(0.45, 0, 0.55, 1) 0.6s infinite,
      nfShow 0.01s linear 0.6s forwards;
  }

  @keyframes nfDraw {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes nfTravel {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes nfShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Reduced motion: no moving light; the hot link is drawn in full and stays lit. */
  @media (prefers-reduced-motion: reduce) {
    .packet,
    .pulse {
      display: none;
    }

    .draw {
      stroke-dasharray: none;
    }
  }
</style>
