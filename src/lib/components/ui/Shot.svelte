<script lang="ts">
  import type { Picture } from '@sveltejs/enhanced-img';

  /*
   * Framed screenshot.
   *
   * Preferred (responsive AVIF/WebP + intrinsic size, from the build): import the file with `?enhanced`
   *   import chat from '$lib/assets/img/d-chat.webp?enhanced';
   *   <Shot src={chat} alt="..." caption="..." sizes="(min-width: 1240px) 700px, 100vw" />
   * Fallback for a URL string (e.g. from static/): pass `width` and `height` so the layout does not shift.
   *   <Shot src="/media/poster.webp" width={1280} height={720} alt="..." />
   * Set `eager` for the LCP image only: loading=eager and fetchpriority=high (lazy + async decode otherwise).
   */
  interface Props {
    src: Picture | string;
    alt: string;
    caption?: string;
    /** LCP image: load immediately with high fetch priority. */
    eager?: boolean;
    sizes?: string;
    /** Intrinsic size; required for string sources. */
    width?: number;
    height?: number;
  }

  let { src, alt, caption, eager = false, sizes, width, height }: Props = $props();

  const loading = $derived(eager ? 'eager' : 'lazy');
  const fetchpriority = $derived(eager ? 'high' : undefined);
</script>

<figure class="shot">
  <div class="frame">
    {#if typeof src === 'string'}
      <img {src} {alt} {width} {height} {sizes} {loading} {fetchpriority} decoding="async" />
    {:else}
      <enhanced:img {src} {alt} {sizes} {loading} {fetchpriority} decoding="async" />
    {/if}
  </div>
  {#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>

<style>
  .shot {
    min-width: 0;
  }

  .frame {
    overflow: hidden;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-xl);
    background: var(--panel);
    box-shadow: var(--shadow-frame);
  }

  .frame :global(img) {
    width: 100%;
    height: auto;
  }

  figcaption {
    margin-top: 12px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--muted);
  }
</style>
