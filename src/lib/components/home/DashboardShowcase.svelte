<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import Shot from '$lib/components/ui/Shot.svelte';
  import Tabs, { type TabItem } from '$lib/components/ui/Tabs.svelte';
  import { DASHBOARD_POINTS, DTABS, SECTIONS } from '$lib/content/home';
  import { DASHBOARD_IMAGES } from './images';

  const TABS: TabItem[] = DTABS.map((tab, index) => ({ id: String(index), label: tab.label, sub: tab.sub }));

  let selected = $state(TABS[0].id);

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

<section id="dashboard" class="dashboard" aria-labelledby="db-h">
  <div class="container inner">
    <p class="tag"><span class="mark"></span>{SECTIONS.dashboard.tag}</p>
    <h2 id="db-h">{SECTIONS.dashboard.title}</h2>
    <p class="lead">{SECTIONS.dashboard.lead}</p>

    <Tabs label="Dashboard views" tabs={TABS} bind:selected color="var(--c-dashboard)">
      {#snippet panel(tab)}
        {@const view = DTABS[Number(tab.id)]}
        {#if view.video}
          <figure class="video">
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
            <figcaption>{view.label} {SECTIONS.dashboard.captionSuffix}</figcaption>
          </figure>
        {:else if view.img && DASHBOARD_IMAGES[view.img]}
          <Shot
            src={DASHBOARD_IMAGES[view.img]}
            alt={view.alt}
            caption="{view.label} · {SECTIONS.dashboard.captionSuffix}"
            sizes="(min-width: 1240px) 760px, 100vw"
          />
        {/if}
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
          <p class="point-label">{point.label}</p>
          <p class="point-text">{point.text}</p>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .dashboard {
    margin-top: 112px;
    border-top: 1px solid #2a2010;
    background: radial-gradient(1200px 500px at 70% 0%, #1a1408, var(--bg) 70%);
  }

  .inner {
    padding-block: 96px;
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

  .video {
    margin: 0;
  }

  video {
    width: 100%;
    height: auto;
    border-radius: var(--radius-2xl);
    background: transparent;
    mix-blend-mode: lighten;
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

  .points li {
    padding: 18px;
    border: 1px solid #2a2010;
    border-radius: 12px;
  }

  .point-label {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--c-dashboard);
  }

  .point-text {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.55;
    color: #cfc6b4;
  }
</style>
