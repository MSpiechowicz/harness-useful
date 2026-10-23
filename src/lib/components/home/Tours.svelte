<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Video from '$lib/components/ui/Video.svelte';
  import { COLORS } from '$lib/config/site';
  import { SECTIONS, TOURS } from '$lib/content/home';
  import { PRODUCTS } from '$lib/content/products';
</script>

<Section id="tours" tone="alt" title={SECTIONS.tours.title}>
  <div class="grid">
    {#each TOURS as tour (tour.id)}
      {@const video = PRODUCTS[tour.id].video}
      {#if video}
        <Video src={video.src} poster={video.poster} title={video.title}>
          {#snippet caption()}
            <span style:color={COLORS[tour.id]}>{tour.id}</span>
            <span class="detail">{tour.caption}</span>
          {/snippet}
        </Video>
      {/if}
    {/each}
  </div>
</Section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
    gap: 16px;
  }

  .detail {
    color: var(--muted);
  }
</style>
