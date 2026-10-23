<script lang="ts">
  interface Props {
    items: string[];
  }

  let { items }: Props = $props();
</script>

<ul>
  {#each items as item (item)}
    <li>{item}</li>
  {/each}
</ul>

<style>
  ul {
    display: grid;
    gap: 10px;
    max-width: 860px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    position: relative;
    padding: 14px 18px 14px 44px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--panel);
    font-size: 16px;
    line-height: 1.6;
    color: var(--text);
  }

  li::before {
    content: '✓';
    position: absolute;
    top: 14px;
    left: 18px;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--accent);
  }
</style>
