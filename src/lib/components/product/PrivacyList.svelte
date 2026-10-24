<script lang="ts">
  interface Props {
    items: string[];
  }

  let { items }: Props = $props();
</script>

<ul>
  {#each items as item (item)}
    <li>
      <svg class="tick" width="14" height="14" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5.2 4.2 7.4 8 2.8" /></svg>
      <span>{item}</span>
    </li>
  {/each}
</ul>

<style>
  /* Every row as tall as the tallest (1fr rows), text centred, so short and two-line points line up as one block. */
  ul {
    display: grid;
    grid-auto-rows: 1fr;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--panel);
    font-size: 16px;
    line-height: 1.6;
    color: var(--text);
  }

  .tick {
    flex-shrink: 0;
    fill: none;
    stroke: var(--accent);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
