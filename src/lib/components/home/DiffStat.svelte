<script lang="ts">
  import { DIFFS, SECTIONS } from '$lib/content/home';
</script>

<section class="band" aria-labelledby="diff-h">
  <div class="container inner">
    <h2 id="diff-h">{SECTIONS.diff.title}</h2>
    <p class="lead">{SECTIONS.diff.lead}</p>

    <ul class="rows">
      {#each DIFFS as row (row.before)}
        <li class="row" style:--tone={row.color}>
          <div class="before">
            <span class="sign" aria-hidden="true">−</span>
            <span class="text"><span class="visually-hidden">Before: </span>{row.before}</span>
          </div>
          <div class="after">
            <span class="sign" aria-hidden="true">+</span>
            <span class="text"><span class="visually-hidden">After: </span>{row.after}</span>
            <span class="tool">{row.tool}</span>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .band {
    background: var(--panel-alt);
    border-block: 1px solid var(--border-soft);
  }

  .inner {
    padding-block: 88px;
  }

  h2 {
    margin-bottom: 8px;
    font-family: var(--font-mono);
    font-size: clamp(26px, 3vw, 38px);
    letter-spacing: -0.04em;
    color: var(--text-strong);
  }

  .lead {
    margin-bottom: 36px;
    font-size: 16px;
    color: var(--muted);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .row {
    display: grid;
    gap: 14px;
    align-items: stretch;
    grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  }

  .before,
  .after {
    display: flex;
    gap: 14px;
    align-items: center;
    min-height: 56px;
    padding: 10px 16px;
    border-radius: var(--radius-lg);
  }

  .before {
    background: #140e0c;
    border: 1px solid #2a1c17;
  }

  .after {
    background: #0b1517;
    border: 1px solid #173238;
  }

  .sign {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 800;
  }

  .before .sign {
    color: #f97316;
  }

  .after .sign {
    color: #38bdf8;
  }

  .text {
    font-size: 15px;
    line-height: 1.5;
  }

  .before .text {
    color: #b7a79f;
  }

  .after .text {
    flex: 1;
    color: #e6f1ee;
  }

  .tool {
    padding: 4px 8px;
    border: 1px solid var(--tone);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--tone);
    white-space: nowrap;
  }
</style>
