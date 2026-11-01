<script lang="ts">
  import { KNOWLEDGE_FRAMES, TICK, knowledgeFrame } from '$lib/motion/anims';
  import { createTicker } from '$lib/motion/ticker.svelte';

  // Animated Harness Knowledge (example data): the agent searches the imported docs, reads one in full, and proposes a
  // new doc that a person approves. Decorative: the product block beside it has the text.
  const ticker = createTicker({ interval: TICK });

  // Reduced motion: no loop, the last frame shows the approved doc.
  const frame = $derived(knowledgeFrame(ticker.reduced ? KNOWLEDGE_FRAMES - 1 : ticker.tick));

  const FORMATS = ['md', 'html', 'openapi', 'pdf', 'adoc', 'rst'];

  // Pointers only: title, section and a snippet. The full text comes from knowledge_get.
  const POINTERS = [
    { title: 'docs/billing/refunds.md', section: 'Retries', snippet: 'Failed refunds retry three times, backing off…' },
    { title: 'openapi.yaml', section: 'POST /refunds', snippet: 'Idempotency-Key header required; a retry returns…' },
    { title: 'adr/0007-idempotency.md', section: 'Decision', snippet: 'Every write carries a key so a retry is safe…' },
  ];
</script>

<div class="knowledge" {@attach ticker.observe}>
  <div class="bar">
    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    <span class="name">harness-knowledge</span>
    <span class="repo">github.com/useful/payments-api</span>
    <span class="proto">MCP · stdio</span>
  </div>

  <div class="cols">
    <div class="log">
      <div class="session">● prompt · refunds retry twice?</div>
      <div class="hook">+ Check Knowledge first</div>
      <div class="line" class:on={frame.lines[0]}><span class="knowledge-mark">›</span> knowledge_search(</div>
      <div class="line call-end" class:on={frame.lines[0]}>"{frame.query}")</div>
      <div class="line found" class:on={frame.lines[1]}>← 3 pointers · BM25 + vector</div>
      <div class="line" class:on={frame.lines[2]}><span class="agent-mark">›</span> knowledge_get("refunds.md")</div>
      <div class="line crumb" class:on={frame.lines[3]}>Billing › Refunds › Retries</div>
      <div class="line passage" class:on={frame.lines[4]}>Retries back off 1 min, 5 min, 30 min, then flag the refund.</div>
      <div class="line propose" class:on={frame.lines[5]}>
        <span class="knowledge-mark">›</span> knowledge_add → review queue
      </div>

      <div class="proposal" class:on={frame.card}>
        <div class="proposal-head">
          <span class="kind">Review</span><span class="proposal-title">runbook: refund backfill</span>
        </div>
        <p class="waiting">knowledge_add · waiting for a person</p>
        <p class="proposal-body">How to re-run refunds that failed in an outage.</p>
        <div class="buttons">
          <span class="skip" class:gone={frame.newDoc}>Skip</span>
          <span class="approve" class:active={frame.approveActive}>{frame.approveText}</span>
        </div>
      </div>
    </div>

    <div class="docs">
      <p class="docs-title">docs · imported</p>

      <div class="formats">
        {#each FORMATS as format (format)}
          <span class="format">{format}</span>
        {/each}
      </div>

      <div class="fresh" class:on={frame.newDoc}>
        <div class="pointer">
          <span class="pointer-title">runbook: refund backfill</span>
          <span class="snippet">✓ searchable by every agent</span>
        </div>
      </div>

      {#each POINTERS as pointer, index (pointer.title)}
        <div class="result" class:on={frame.results[index]}>
          <div class="pointer" class:hit={index === 0 && frame.hit}>
            <span class="pointer-title">{pointer.title}</span>
            <span class="section">› {pointer.section}</span>
            <span class="snippet">{pointer.snippet}</span>
          </div>
        </div>
      {/each}

      <p class="next" class:on={frame.next}>the next search finds it</p>
    </div>
  </div>
</div>

<style>
  .knowledge {
    position: relative;
    height: 460px;
    min-width: 560px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-xl);
    background: #0b0f10;
    box-shadow: 0 30px 70px rgb(0 0 0 / 50%);
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: #c3cfcb;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    background: #0d1314;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #2a3637;
  }

  .name {
    margin-left: 6px;
    color: var(--text-strong);
  }

  .repo {
    color: var(--subtle);
  }

  .proto {
    margin-left: auto;
    color: var(--c-knowledge);
  }

  .cols {
    flex: 1;
    min-height: 0;
    display: flex;
  }

  .log {
    position: relative;
    flex: 1.25 1 0;
    min-width: 0;
    padding: 14px 16px;
    border-right: 1px solid var(--border);
    line-height: 1.85;
  }

  .session,
  .hook,
  .line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .session {
    color: var(--c-desktop);
  }

  .hook {
    color: var(--muted);
  }

  .line {
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .line.on {
    opacity: 1;
  }

  .knowledge-mark {
    color: var(--c-knowledge);
  }

  .agent-mark {
    color: var(--accent);
  }

  .call-end {
    padding-left: 2ch;
  }

  .found {
    color: var(--c-knowledge);
  }

  .crumb {
    color: var(--muted);
  }

  .passage {
    font-size: 11.5px;
    line-height: 1.55;
    color: #a9b6b2;
    white-space: normal;
  }

  .proposal {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    padding: 14px;
    border: 1px solid #5a4630;
    border-radius: 12px;
    background: #16110b;
    line-height: 1.5;
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }

  .proposal.on {
    opacity: 1;
    transform: none;
  }

  .proposal-head {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }

  .kind {
    flex-shrink: 0;
    padding: 2px 7px;
    border-radius: 5px;
    background: #2a1f12;
    color: var(--c-knowledge);
    font-size: 11px;
  }

  .proposal-title {
    min-width: 0;
    font-weight: 700;
    color: var(--text-strong);
  }

  .waiting {
    margin-top: 6px;
    font-size: 11px;
    color: var(--c-desktop);
  }

  .proposal-body {
    margin-top: 8px;
    font-size: 11.5px;
    line-height: 1.55;
    color: #a9b6b2;
  }

  .buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 10px;
  }

  .skip,
  .approve {
    padding: 5px 10px;
    border-radius: var(--radius-sm);
  }

  .skip {
    max-width: 60px;
    overflow: hidden;
    color: var(--muted);
    transition:
      max-width 0.45s ease,
      padding 0.45s ease,
      opacity 0.45s ease;
  }

  .skip.gone {
    max-width: 0;
    margin-right: -8px;
    padding-inline: 0;
    opacity: 0;
  }

  .approve {
    padding-inline: 12px;
    white-space: nowrap;
    background: #2c2013;
    color: #f0d9bd;
    font-weight: 700;
    transition:
      background 0.45s ease,
      color 0.45s ease;
  }

  .approve.active {
    background: var(--c-knowledge);
    color: #1c1206;
  }

  .docs {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 10px;
  }

  .docs-title {
    margin: 0 0 6px 10px;
    font-size: 11px;
    color: var(--subtle);
  }

  .formats {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 0 0 8px 10px;
  }

  .format {
    padding: 1px 6px;
    border: 1px solid var(--border-strong);
    border-radius: 5px;
    font-size: 10.5px;
    color: var(--muted);
  }

  .fresh {
    max-height: 0;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: rgb(212 163 115 / 14%);
    opacity: 0;
    transition:
      max-height 0.5s ease,
      opacity 0.5s ease;
  }

  .fresh.on {
    max-height: 56px;
    opacity: 1;
  }

  .result {
    opacity: 0;
    transform: translateY(6px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }

  .result.on {
    opacity: 1;
    transform: none;
  }

  .pointer {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: var(--radius-md);
    transition: background 0.5s;
  }

  .pointer.hit {
    background: rgb(212 163 115 / 14%);
  }

  .pointer-title,
  .section,
  .snippet {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pointer-title {
    color: var(--text);
  }

  .section {
    font-size: 11px;
    color: var(--c-knowledge);
  }

  .snippet {
    font-size: 11px;
    color: var(--muted);
  }

  .next {
    margin: auto 0 0 10px;
    font-size: 11.5px;
    color: var(--c-knowledge);
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .next.on {
    opacity: 1;
  }
</style>
