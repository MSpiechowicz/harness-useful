<script lang="ts">
  import { NET_COLORS, NET_ENDS } from '$lib/content/home-net';
  import { COMET_DELAYS, COMET_LAYERS, NET_HEIGHT, NET_LINKS, NET_WIDTH, idleDelays } from './net-paths';

  interface Props {
    /** Index of the link running hot (Hop.link of the current hop). */
    link: number;
  }

  let { link }: Props = $props();

  const gradient = (index: number) => `url(#nf-g${index})`;
</script>

<!--
  The family as a living network (board: gen_net2.py). Every link carries slow idle comets; the link of the current hop
  fades up (opacity .7s) as a hot layer with a lit track and two tapered comets. Purely decorative: the hop text lives
  outside the SVG.
-->
<svg class="net-svg" width={NET_WIDTH} height={NET_HEIGHT} viewBox="0 0 {NET_WIDTH} {NET_HEIGHT}" aria-hidden="true" focusable="false">
  <defs>
    <filter id="nf-blur" x="-10%" y="-60%" width="120%" height="220%">
      <feGaussianBlur stdDeviation="4" />
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
    <path d={item.d} pathLength="100" fill="none" stroke="rgba(255,255,255,.075)" stroke-width="1.4" />
  {/each}

  {#each NET_LINKS as item, index (index)}
    {#each idleDelays(index) as delay (delay)}
      <path
        class="idle"
        d={item.d}
        pathLength="100"
        fill="none"
        stroke={gradient(index)}
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-dasharray="9 91"
        style:animation-delay="{delay}s"
      />
    {/each}
  {/each}

  {#each NET_LINKS as item, index (index)}
    <g class="hot" class:on={index === link}>
      <path d={item.d} pathLength="100" fill="none" stroke={gradient(index)} stroke-width="1.6" opacity=".45" />

      {#each COMET_DELAYS as delay (delay)}
        {#each COMET_LAYERS as layer, layerIndex (layerIndex)}
          <path
            class="comet"
            d={item.d}
            pathLength="100"
            fill="none"
            stroke={layer.white ? '#FFFFFF' : gradient(index)}
            stroke-width={layer.width}
            stroke-linecap="round"
            stroke-dasharray="{layer.length} {100 - layer.length}"
            filter={layer.blur ? 'url(#nf-blur)' : undefined}
            opacity={layer.opacity}
            style:animation-name="nfDash{layer.length}"
            style:animation-delay={delay}
          />
        {/each}
      {/each}
    </g>
  {/each}
</svg>

<style>
  .net-svg {
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  .idle {
    opacity: 0.32;
    animation: nfDash9 5.2s linear infinite;
  }

  /* Hidden links keep their comets running (so the crossfade never restarts them) but are not painted. */
  .hot {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.7s ease,
      visibility 0s linear 0.7s;
  }

  .hot.on {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 0.7s ease,
      visibility 0s;
  }

  .comet {
    animation-duration: 1.6s;
    animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
    animation-iteration-count: infinite;
  }

  /* Reduced motion: no moving light, the hot link stays lit as a plain line. */
  @media (prefers-reduced-motion: reduce) {
    .idle,
    .comet {
      display: none;
    }
  }
</style>
