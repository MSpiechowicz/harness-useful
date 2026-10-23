<script lang="ts" module>
  export interface TabItem {
    id: string;
    label: string;
    /** Secondary line under the label. */
    sub?: string;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  /*
   * Accessible tabs (automatic activation). Keys: Left/Right/Up/Down, Home, End.
   *
   * No-JS behavior: the server renders the selected (first by default) panel only and the tab buttons are inert.
   * Consumers MUST therefore also render every tab's caption/alt text as ordinary content (for example an <ol>
   * next to the demo, or visually-hidden text) so nothing is lost without JavaScript.
   *
   *   <Tabs label="Dashboard views" tabs={TABS} bind:selected color="var(--c-dashboard)">
   *     {#snippet panel(tab)} ...content for tab.id... {/snippet}
   *   </Tabs>
   */
  interface Props {
    /** Accessible name of the tablist. */
    label: string;
    tabs: TabItem[];
    /** Id of the selected tab; defaults to the first tab. */
    selected?: string;
    /** Content of the selected tab. */
    panel: Snippet<[TabItem]>;
    /** `side` puts the tab list in a column left of the panel, `top` in a row above it. */
    layout?: 'side' | 'top';
    /** Accent for the selected tab (any CSS color). */
    color?: string;
  }

  let { label, tabs, selected = $bindable(), panel, layout = 'side', color = 'var(--accent)' }: Props = $props();

  const uid = $props.id();
  const vertical = $derived(layout === 'side');

  const current = $derived(tabs.find((tab) => tab.id === selected) ?? tabs[0]);
  const buttons: Record<string, HTMLButtonElement | undefined> = {};

  function tabId(id: string) {
    return `${uid}-tab-${id}`;
  }

  function panelId(id: string) {
    return `${uid}-panel-${id}`;
  }

  function select(index: number, focus: boolean) {
    const next = tabs[(index + tabs.length) % tabs.length];

    selected = next.id;
    if (focus) buttons[next.id]?.focus();
  }

  function onkeydown(event: KeyboardEvent) {
    const index = tabs.findIndex((tab) => tab.id === current.id);

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') select(index + 1, true);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') select(index - 1, true);
    else if (event.key === 'Home') select(0, true);
    else if (event.key === 'End') select(tabs.length - 1, true);
    else return;

    event.preventDefault();
  }
</script>

<div class="tabs" class:side={vertical} style:--tab-color={color}>
  <div class="list" role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : 'horizontal'}>
    {#each tabs as tab (tab.id)}
      {@const active = tab.id === current.id}
      <button
        bind:this={buttons[tab.id]}
        type="button"
        role="tab"
        id={tabId(tab.id)}
        class="tab"
        class:active
        aria-selected={active}
        aria-controls={panelId(tab.id)}
        tabindex={active ? 0 : -1}
        onclick={() => (selected = tab.id)}
        {onkeydown}
      >
        <span class="tab-label">{tab.label}</span>
        {#if tab.sub}<span class="tab-sub">{tab.sub}</span>{/if}
      </button>
    {/each}
  </div>

  <div class="panel" role="tabpanel" id={panelId(current.id)} aria-labelledby={tabId(current.id)} tabindex="0">
    {@render panel(current)}
  </div>
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .tabs.side {
    flex-flow: row wrap;
    align-items: stretch;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .side .list {
    flex: 1 1 260px;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .tab {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: transparent;
    text-align: left;
    font-family: var(--font-sans);
  }

  .tab:hover {
    border-color: color-mix(in srgb, var(--tab-color) 50%, var(--border));
  }

  .tab.active {
    border-color: var(--tab-color);
    background: color-mix(in srgb, var(--tab-color) 10%, transparent);
  }

  .tab-label {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
  }

  .active .tab-label {
    color: var(--text-strong);
  }

  .tab-sub {
    display: block;
    margin-top: 2px;
    font-size: 13px;
    color: var(--muted);
  }

  .panel {
    min-width: 0;
  }

  .side .panel {
    flex: 3 1 640px;
  }
</style>
