<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** URL of the mp4 (served from static/media). */
    src: string;
    /** Poster image URL; the video itself is not fetched until played (preload="none"). */
    poster: string;
    /** Accessible name and download-link text. */
    title: string;
    width?: number;
    height?: number;
    /** Optional figcaption content, rendered below the player inside the frame. */
    caption?: Snippet;
  }

  let { src, poster, title, width = 1280, height = 720, caption }: Props = $props();
</script>

<figure class="video">
  <!-- Tour videos are silent screen recordings: there is no audio to caption. -->
  <!-- svelte-ignore a11y_media_has_caption -->
  <video {src} {poster} {width} {height} controls preload="none" playsinline aria-label={title}>
    <p>Your browser cannot play this video. <a href={src} download>Download “{title}” (mp4)</a>.</p>
  </video>
  {#if caption}<figcaption>{@render caption()}</figcaption>{/if}
</figure>

<style>
  .video {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  video {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
  }

  p {
    padding: 16px;
  }

  figcaption {
    padding: 14px 16px;
    font-family: var(--font-mono);
    font-size: 13px;
  }
</style>
