<script lang="ts">
  import { MARQUEE } from '$lib/content/home';

  // The first five entries are the harnesses the family is built around; the rest are tools Dashboard also reads.
  const PRIMARY = 5;
  const COPIES = [0, 1];
</script>

<div class="marquee">
  <ul class="visually-hidden" aria-label="Supported tools">
    {#each MARQUEE as name (name)}<li>{name}</li>{/each}
  </ul>

  <div class="viewport" aria-hidden="true">
    <div class="row">
      {#each COPIES as copy (copy)}
        {#each MARQUEE as name, index (name)}<span class="item" class:primary={index < PRIMARY}>{name}</span>·{/each}
      {/each}
    </div>
  </div>
</div>

<style>
  .marquee {
    position: relative;
    border-block: 1px solid var(--border-soft);
  }

  .viewport {
    overflow: hidden;
    white-space: nowrap;
    padding-block: 14px;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--subtle);
  }

  .row {
    display: inline-block;
    animation: hfMarquee 40s linear infinite;
  }

  .item {
    padding-inline: 22px;
  }

  .item.primary {
    color: var(--text);
  }
</style>
