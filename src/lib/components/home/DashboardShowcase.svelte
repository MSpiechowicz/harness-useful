<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import Tabs, { type TabItem } from '$lib/components/ui/Tabs.svelte';
  import { DASHBOARD_POINTS, DTABS, SECTIONS } from '$lib/content/home';
  import { DASHBOARD_IMAGES } from './images';
  import LucideIcon from './LucideIcon.svelte';

  const TABS: TabItem[] = DTABS.map((tab, index) => ({ id: String(index), label: tab.label, sub: tab.sub }));

  let selected = $state(TABS[0].id);

  // Every view sits in the same fixed 16:9 stage, so switching tabs never changes the size or the frame; full-window
  // screenshots and wide chart crops are centred on the screenshots' own background colour.
  const SIZES = '(min-width: 1240px) 860px, 100vw';

  // Warm the cache: once the section is near the viewport, load every view at the stage's size, so a tab click shows
  // its screenshot at once instead of an empty frame while it downloads.
  let preload = $state(false);

  const warm: Attachment<HTMLElement> = (node) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preload = true;
        observer.disconnect();
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  };

  // Plays the muted network loop only while it is on screen and the tab is visible; never for reduced motion.
  const autoplay: Attachment<HTMLVideoElement> = (video) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.controls = true;

      return;
    }

    let onScreen = false;

    function sync() {
      if (onScreen && !document.hidden) video.play().catch(() => {});
      else video.pause();
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    observer.observe(video);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  };
</script>

<section id="dashboard" class="dashboard" aria-labelledby="db-h" {@attach warm}>
  <div class="container inner">
    <p class="tag"><span class="mark"></span>{SECTIONS.dashboard.tag}</p>
    <h2 id="db-h">{SECTIONS.dashboard.title}</h2>
    <p class="lead">{SECTIONS.dashboard.lead}</p>

    <Tabs label="Dashboard views" tabs={TABS} bind:selected color="var(--c-dashboard)">
      {#snippet panel(tab)}
        {@const view = DTABS[Number(tab.id)]}
        <figure class="view">
          <div class="stage">
            {#if view.video}
              <video
                src={view.video.src}
                poster={view.video.poster}
                width="1800"
                height="914"
                muted
                loop
                playsinline
                preload="none"
                aria-label={view.alt}
                {@attach autoplay}
              ></video>
            {:else if view.img && DASHBOARD_IMAGES[view.img]}
              <enhanced:img src={DASHBOARD_IMAGES[view.img]} alt={view.alt} sizes={SIZES} decoding="async" />
            {/if}
          </div>
          <figcaption>{view.label} · {SECTIONS.dashboard.captionSuffix}</figcaption>
        </figure>
      {/snippet}
    </Tabs>

    <!-- Every view as text: the tab panels show one screenshot at a time, and none without JavaScript. -->
    <ul class="visually-hidden" aria-label="Dashboard views">
      {#each DTABS as view (view.label)}
        <li>{view.label}: {view.sub}. {view.alt}</li>
      {/each}
    </ul>

    <ul class="points">
      {#each DASHBOARD_POINTS as point (point.label)}
        <li>
          <span class="point-icon"><LucideIcon name={point.icon} size={16} color="var(--c-dashboard)" /></span>
          <p class="point-label">{point.label}</p>
          <p class="point-text">{point.text}</p>
        </li>
      {/each}
    </ul>

    {#if preload}
      <div class="preload" aria-hidden="true">
        {#each Object.values(DASHBOARD_IMAGES) as picture, index (index)}
          <enhanced:img src={picture} alt="" sizes={SIZES} />
        {/each}
        {#each DTABS.filter((view) => view.video) as view (view.label)}
          <img src={view.video?.poster} alt="" />
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .dashboard {
    border-top: 1px solid #2a2010;
    background: radial-gradient(1200px 500px at 70% 0%, #1a1408, var(--bg) 70%);
  }

  .inner {
    padding-block: var(--section-space);
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--c-dashboard);
  }

  .mark {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: linear-gradient(180deg, #f472b6, #f59e0b);
  }

  h2 {
    max-width: 900px;
    font-family: var(--font-mono);
    font-size: clamp(28px, 3.8vw, 52px);
    line-height: 1.06;
    letter-spacing: -0.045em;
    color: var(--text-strong);
  }

  .lead {
    max-width: 680px;
    margin: 16px 0 40px;
    font-size: 17px;
    line-height: 1.6;
    color: #a99f8c;
  }

  .view {
    margin: 0;
  }

  /* One frame for every view: same size, border and background (#0d0d0d is the screenshots' own background). */
  .stage {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: var(--radius-xl);
    background: #0d0d0d;
    box-shadow: var(--shadow-frame);
  }

  .stage :global(picture) {
    display: block;
    height: 100%;
  }

  .stage :global(img),
  .stage video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* The network video and its poster are drawn on pure black; lighten lets the stage colour show through, so the
     video has no darker band inside the frame. */
  .stage video {
    mix-blend-mode: lighten;
  }

  .preload {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  figcaption {
    padding: 12px 4px 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: #a99f8c;
  }

  .points {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin: 28px 0 0;
    padding: 0;
    list-style: none;
  }

  /* Same card language as the tool cards: page panel, a gradient accent along the top, an icon and a bright title. */
  .points li {
    position: relative;
    overflow: hidden;
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  .points li::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 2px;
    background: linear-gradient(90deg, #f59e0b, #f472b6 60%, transparent);
  }

  .point-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid color-mix(in srgb, var(--c-dashboard) 30%, var(--border));
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--c-dashboard) 8%, transparent);
  }

  .point-label {
    margin-top: 14px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-strong);
  }

  .point-text {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.55;
    color: var(--muted);
  }
</style>
