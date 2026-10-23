<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import { DATA_CONNECTIONS, DATA_LIVES, NET_COLORS, SECTIONS } from '$lib/content/home';
</script>

<Section id="data" title={SECTIONS.local.title} lead={SECTIONS.local.lead}>
  <div class="layout">
    <div class="machine">
      <span class="machine-label">{SECTIONS.local.machine}</span>

      <ul class="cards">
        {#each DATA_LIVES as card (card.name)}
          <li style:--tone={NET_COLORS[card.tool]}>
            <p class="name">{card.name}</p>
            <p class="path">{card.path}</p>
            <p class="text">{card.text}</p>
          </li>
        {/each}
      </ul>
    </div>

    <ul class="outside" aria-label="Connections that leave your machine">
      {#each DATA_CONNECTIONS as connection (connection.name)}
        <li>
          <b>{connection.name}</b>
          <span>{connection.text}</span>
        </li>
      {/each}
    </ul>
  </div>
</Section>

<style>
  .layout {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .machine {
    position: relative;
    flex: 3 1 620px;
    min-width: 0;
    padding: 22px;
    border: 2px dashed #2c4a44;
    border-radius: 18px;
  }

  .machine-label {
    position: absolute;
    top: -12px;
    left: 20px;
    padding: 0 10px;
    background: var(--bg);
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: 1fr;
    gap: 12px;
    align-items: stretch;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .cards li,
  .outside li {
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--panel);
  }

  .name {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--tone);
  }

  .path {
    margin-top: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: #c3cfcb;
  }

  .text {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--muted);
  }

  .outside {
    flex: 2 1 380px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 18px;
    margin: 0;
    padding: 16px 0 16px 28px;
    list-style: none;
  }

  .outside li {
    padding: 16px 18px;
    font-size: 14px;
    line-height: 1.5;
  }

  .outside b {
    display: block;
    color: var(--text-strong);
  }

  .outside span {
    color: var(--muted);
  }

  @media (max-width: 900px) {
    .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .outside {
      padding-left: 0;
    }
  }

  @media (max-width: 560px) {
    .cards {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
