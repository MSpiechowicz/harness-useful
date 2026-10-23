<script lang="ts">
  import { MEMORY_FRAMES, TICK, memoryFrame } from '$lib/motion/anims';
  import { createTicker } from '$lib/motion/ticker.svelte';

  // Animated Harness Memory (example data): the agent searches notes at session start, works, and at turn end proposes
  // a new note that you save. Decorative: the product block beside it has the text.
  const ticker = createTicker({ interval: TICK });

  // Reduced motion: no loop, the last frame shows the saved note.
  const frame = $derived(memoryFrame(ticker.reduced ? MEMORY_FRAMES - 1 : ticker.tick));

  const NOTES = [
    { kind: 'Fix', text: 'Tauri window stayed blank after a hot reload' },
    { kind: 'Decision', text: 'Notes are read through the Memory CLI' },
    { kind: 'Location', text: 'Where the notes view keeps its state' },
    { kind: 'Outcome', text: 'Virtualising the session list cut the first paint' },
  ];
</script>

<div class="memory" {@attach ticker.observe}>
  <div class="bar">
    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    <span class="name">harness-memory</span>
    <span class="repo">github.com/useful/harness-desktop</span>
    <span class="proto">MCP · stdio</span>
  </div>

  <div class="cols">
    <div class="log">
      <div class="session">● new chat · sessionStart</div>
      <div class="hook">+ Search Harness Memory first</div>
      <div class="line" class:on={frame.lines[0]}><span class="memory-mark">›</span> note_search("{frame.query}")</div>
      <div class="line recalled" class:on={frame.lines[1]}>← 2 notes recalled</div>
      <div class="line" class:on={frame.lines[2]}><span class="agent-mark">›</span> edit .github/workflows/release.yml</div>
      <div class="line detail" class:on={frame.lines[3]}>timeout-minutes: 10 → 30</div>
      <div class="line turn-end" class:on={frame.lines[4]}>● turnEnd · Save what you learned</div>

      <div class="proposal" class:on={frame.card}>
        <div class="proposal-head">
          <span class="kind fix">Fix</span><span class="proposal-title">Notarytool needs a 30-minute job timeout</span>
        </div>
        <p class="waiting">waiting in your Harness Desktop chat</p>
        <p class="proposal-body">
          notarytool waits 10 minutes by default and Apple can be slower. release.yml now sets timeout-minutes: 30.
        </p>
        <div class="buttons">
          <span class="skip">Skip</span>
          <span class="edit">Edit</span>
          <span class="save" class:active={frame.saveActive}>{frame.saveText}</span>
        </div>
      </div>
    </div>

    <div class="notes">
      <p class="notes-title">notes · this repository</p>

      <div class="fresh" class:on={frame.newNote}>
        <div class="note">
          <span class="kind fix">Fix</span><span class="text">Notarytool needs a 30-minute job timeout</span>
        </div>
      </div>

      <div class="hit" class:on={frame.hit}>
        <div class="note">
          <span class="kind problem">Problem</span><span class="text">The release build fails on macOS when notarytool…</span>
        </div>
      </div>

      {#each NOTES as note (note.text)}
        <div class="note">
          <span class="kind {note.kind.toLowerCase()}">{note.kind}</span><span class="text">{note.text}</span>
        </div>
      {/each}

      <p class="next" class:on={frame.next}>next session, in any harness, starts here</p>
    </div>
  </div>
</div>

<style>
  .memory {
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
    color: var(--c-memory);
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

  .memory-mark {
    color: var(--c-memory);
  }

  .agent-mark {
    color: var(--accent);
  }

  .recalled {
    color: #f0abfc;
  }

  .detail {
    color: var(--muted);
  }

  .turn-end {
    color: var(--c-desktop);
  }

  .proposal {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    padding: 14px;
    border: 1px solid #5a2a63;
    border-radius: 12px;
    background: #140d16;
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
    align-items: center;
  }

  .proposal-title {
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
  .edit,
  .save {
    padding: 5px 10px;
    border-radius: var(--radius-sm);
  }

  .skip {
    color: var(--muted);
  }

  .edit {
    border: 1px solid var(--border-strong);
    color: var(--text);
  }

  .save {
    padding-inline: 12px;
    background: #2a1630;
    color: #f5d0fe;
    font-weight: 700;
    transition:
      background 0.45s ease,
      color 0.45s ease;
  }

  .save.active {
    background: var(--c-memory);
    color: #1a0620;
  }

  .notes {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 10px;
  }

  .notes-title {
    margin: 0 0 6px 10px;
    font-size: 11px;
    color: var(--subtle);
  }

  .fresh {
    max-height: 0;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: rgb(232 121 249 / 14%);
    opacity: 0;
    transition:
      max-height 0.5s ease,
      opacity 0.5s ease;
  }

  .fresh.on {
    max-height: 44px;
    opacity: 1;
  }

  .hit {
    border-radius: var(--radius-md);
    transition: background 0.5s;
  }

  .hit.on {
    background: rgb(232 121 249 / 14%);
  }

  .note {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border-radius: var(--radius-md);
  }

  .text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text);
  }

  .kind {
    flex-shrink: 0;
    padding: 2px 7px;
    border-radius: 5px;
    font-size: 11px;
  }

  .fix {
    background: #0f2219;
    color: #86efac;
  }

  .problem {
    background: #2a1416;
    color: #fca5a5;
  }

  .decision {
    background: #0f1b2e;
    color: #93c5fd;
  }

  .location {
    background: #1e2328;
    color: #cbd5e1;
  }

  .outcome {
    background: #0c1f2a;
    color: #7dd3fc;
  }

  .next {
    margin: auto 0 0 10px;
    font-size: 11.5px;
    color: #f0abfc;
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .next.on {
    opacity: 1;
  }
</style>
