<script lang="ts">
  import type { Breadcrumb } from '$lib/content/types';

  let { items }: { items: Breadcrumb[] } = $props();
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    {#each items as item, index (item.path)}
      <li>
        {#if index === items.length - 1}
          <span aria-current="page">{item.name}</span>
        {:else}
          <a href={item.path}>{item.name}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumbs ol {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--subtle);
  }

  li:not(:last-child)::after {
    content: '/';
    margin-left: 6px;
    color: var(--subtle);
  }

  a {
    color: var(--muted);
    text-decoration: none;
  }

  a:hover {
    color: var(--accent);
  }

  [aria-current='page'] {
    color: var(--text);
  }
</style>
