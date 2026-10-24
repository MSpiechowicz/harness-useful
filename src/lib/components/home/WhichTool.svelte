<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import { COLORS } from '$lib/config/site';
  import { COMPARISON } from '$lib/content/home';

  // Answer-first section for "which tool do I need?" (also read by assistants). Facts come from COMPARISON.
  const ANSWER =
    'Start with Harness Desktop, which installs the other three for you, or pick one tool: Skills for the workflow, Memory for shared project notes, Dashboard for token usage and cost.';

  /** "Any MCP client, including Claude Code, Codex" → ["Any MCP client", "Claude Code", "Codex"]. */
  const tags = (list: string) => list.replace('including ', '').split(', ');
</script>

<Section id="which-tool" title="Which tool do I need?" lead={ANSWER}>
  <div class="cards">
    {#each COMPARISON as tool (tool.id)}
      <article class="card" style:--tone={COLORS[tool.id]} aria-labelledby="tool-{tool.id}">
        <header>
          <h3 id="tool-{tool.id}"><a href="/{tool.id}"><span class="swatch" aria-hidden="true"></span>{tool.name}</a></h3>
          <span class="license">{tool.license}</span>
        </header>

        <p class="what">{tool.what}</p>

        <dl>
          <dt>runs as</dt>
          <dd>{tool.runsAs}</dd>
          <dt>platforms</dt>
          <dd>{tool.platforms}</dd>
          <dt>works with</dt>
          <dd>
            <ul class="tags">
              {#each tags(tool.worksWith) as name (name)}
                <li>{name}</li>
              {/each}
            </ul>
          </dd>
          <dt>data lives</dt>
          <dd>{tool.dataLives}</dd>
        </dl>
      </article>
    {/each}
  </div>
</Section>

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(520px, 100%), 1fr));
    gap: 16px;
  }

  .card {
    position: relative;
    overflow: hidden;
    padding: 24px 26px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--panel);
  }

  /* Thin accent in the tool's colour along the top edge. */
  .card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 2px;
    background: linear-gradient(90deg, var(--tone), transparent 70%);
  }

  header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 12px;
  }

  /* The name never splits; on a narrow card the license badge wraps under it instead. */
  h3 {
    font-family: var(--font-mono);
    font-size: 17px;
    white-space: nowrap;
  }

  h3 a {
    color: var(--text-strong);
    text-decoration: none;
  }

  h3 a:hover {
    color: var(--tone);
  }

  .swatch {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 10px;
    border-radius: 2px;
    background: var(--tone);
    box-shadow: 0 0 10px var(--tone);
  }

  .license {
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
  }

  .what {
    margin: 10px 0 18px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--text);
  }

  dl {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr);
    gap: 10px 16px;
    margin: 0;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    font-size: 14px;
    line-height: 1.5;
  }

  dt {
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.9;
    color: var(--subtle);
  }

  dd {
    margin: 0;
    color: var(--text);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tags li {
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--panel-alt);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  @media (max-width: 640px) {
    .card {
      padding: 20px 16px;
    }

    /* Sized so the longest name ("Harness Dashboard") and its badge share one row from 360px up, like every card. */
    header {
      gap: 8px;
    }

    h3 {
      font-size: clamp(13px, 3.7vw, 17px);
    }

    .swatch {
      margin-right: 8px;
    }

    .license {
      padding: 2px 6px;
      font-size: 10px;
    }

    dl {
      grid-template-columns: minmax(0, 1fr);
      gap: 4px;
    }

    dd + dt {
      margin-top: 8px;
    }
  }
</style>
