<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Column {
    key: string;
    label: string;
  }

  interface Props {
    columns: Column[];
    /** One record per row, keyed by column key. The first column is the row header. */
    rows: Record<string, string>[];
    caption: string;
    /** Optional custom cell rendering (for example links in the first column). */
    cell?: Snippet<[value: string, column: Column, row: Record<string, string>]>;
  }

  let { columns, rows, caption, cell }: Props = $props();
</script>

<!-- Focusable so keyboard users can scroll the wide table on narrow screens. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section class="scroller" aria-label={caption} tabindex="0">
  <table>
    <caption>{caption}</caption>
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th scope="col">{column.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, rowIndex (rowIndex)}
        <tr>
          {#each columns as column, columnIndex (column.key)}
            {#if columnIndex === 0}
              <th scope="row"
                >{#if cell}{@render cell(row[column.key] ?? '', column, row)}{:else}{row[column.key]}{/if}</th
              >
            {:else}
              <td
                >{#if cell}{@render cell(row[column.key] ?? '', column, row)}{:else}{row[column.key]}{/if}</td
              >
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .scroller {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    font-size: 15px;
    line-height: 1.5;
  }

  caption {
    padding: 14px 16px;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--muted);
  }

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    vertical-align: top;
    border-top: 1px solid var(--border);
  }

  thead th {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--subtle);
  }

  tbody th {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-strong);
    white-space: nowrap;
  }

  td {
    color: var(--muted);
  }
</style>
