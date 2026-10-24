<script lang="ts">
  import { COLORS } from '$lib/config/site';
  import type { HarnessEntry, Product } from '$lib/content/types';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  // Dashboard reads data from tools; the other products work with harnesses.
  const label = $derived(product.id === 'dashboard' ? `Tools read by ${product.name}` : `Harnesses supported by ${product.name}`);

  /** "Oh My Pi (omp)" → name "Oh My Pi" and the command "omp" shown as a tag. */
  function split(name: string): { title: string; command?: string } {
    const match = /^(.*?) \(([^)]+)\)$/.exec(name);

    return match ? { title: match[1], command: match[2] } : { title: name };
  }

  /** Plain text with paths and file names (~/.omp/agent/mcp.json, opencode.db, **\/*.jsonl) marked as code. */
  const CODE = /(~\/[^\s,]*[^\s,.]|\S*\*\*\S*[^\s,.]|[\w-]+\.(?:jsonl?|toml|db)\b)/;

  function parts(text: string): { text: string; code: boolean }[] {
    return text.split(CODE).map((part, index) => ({ text: part, code: index % 2 === 1 }));
  }

  const body = (entry: HarnessEntry) => entry.note ?? entry.support;
</script>

<ul class="harnesses" aria-label={label} style:--tone={COLORS[product.id]}>
  {#each product.harnesses as entry (entry.name)}
    {@const name = split(entry.name)}
    <li class="card">
      <div class="head">
        <h3>{name.title}</h3>
        {#if name.command}<code class="command">{name.command}</code>{/if}
        {#if entry.status}
          <span class="status" class:partial={entry.status === 'Partly supported'}>{entry.status}</span>
        {/if}
      </div>

      {#if entry.works}
        <ul class="works" aria-label="Works">
          {#each entry.works as item (item)}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}

      <p class="text">
        {#each parts(body(entry)) as part, index (index)}{#if part.code}<code>{part.text}</code>{:else}{part.text}{/if}{/each}
      </p>
    </li>
  {/each}
</ul>

<style>
  .harnesses {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 18px 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  /* Thin accent in the product's colour, as on the homepage tool cards. */
  .card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 2px;
    background: linear-gradient(90deg, var(--tone), transparent 70%);
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-strong);
  }

  .command {
    padding: 2px 7px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--panel-alt);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--tone);
  }

  .status {
    margin-left: auto;
    padding: 3px 9px;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    white-space: nowrap;
  }

  .status.partial {
    border-color: color-mix(in srgb, #fbbf24 40%, var(--border));
    color: #fbbf24;
  }

  .works {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .works li {
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--panel-alt);
    font-size: 12.5px;
    color: var(--text);
  }

  .text {
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted);
  }

  .text code {
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--panel-alt);
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text);
  }
</style>
