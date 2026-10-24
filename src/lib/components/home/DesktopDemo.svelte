<script lang="ts">
  import { DESKTOP_FRAMES, TICK, desktopFrame } from '$lib/motion/anims';
  import { createTicker } from '$lib/motion/ticker.svelte';
  import DesktopDiff from './DesktopDiff.svelte';
  import DesktopFiles from './DesktopFiles.svelte';
  import DesktopRail from './DesktopRail.svelte';
  import LucideIcon from './LucideIcon.svelte';

  // Animated recreation of Harness Desktop's Changes view (example data): click line 7, write a comment, open the
  // review, send it to the agent as one prompt. Decorative: the product block beside it carries the real text.
  const ticker = createTicker({ interval: TICK });

  // Reduced motion: no loop, the last frame shows the finished review.
  const frame = $derived(desktopFrame(ticker.reduced ? DESKTOP_FRAMES - 1 : ticker.tick));
</script>

<div class="desktop" {@attach ticker.observe}>
  <div class="layout">
    <DesktopRail />

    <div class="main">
      <div class="topbar">
        <span class="mode"><LucideIcon name="gitCompare" size={14} color="#79b8ff" /></span>
        <span class="title">Changes</span>
        <span class="subtitle">5 changed files</span>

        <span class="review" class:on={frame.reviewVisible} class:glow={frame.reviewGlow}>
          <LucideIcon name="messageSquare" size={13} color="#f2b84b" />Review<span class="count">1</span>
        </span>

        <span class="searchbox">
          <LucideIcon name="search" size={13} color="#8b8b95" />
          <span class="placeholder">Search files and contents</span>
          <span class="key">F</span>
        </span>

        <span class="toggle">
          <span class="on"><LucideIcon name="rows" size={12} color="#ededef" />Unified</span>
          <span><LucideIcon name="columns" size={12} color="#8b8b95" />Split</span>
        </span>

        <span class="box panel"><LucideIcon name="panelLeft" color="#ededef" /></span>
        <span class="more"><LucideIcon name="ellipsis" size={15} /></span>
      </div>

      <div class="body">
        <DesktopFiles {frame} />
        <DesktopDiff {frame} />
      </div>
    </div>
  </div>

  {#if frame.isModal}
    <div class="overlay">
      <div class="modal">
        <div class="modal-head"><b>Review prompt</b><LucideIcon name="x" color="#8b8b95" /></div>
        <p class="sub">This exact text is sent to the agent.</p>
        <p class="meta">1 comment · 1 file · 204 bytes</p>
        <div class="prompt">
          Please address these review comments on the current changes.<br /><b>src/lib.rs</b><br />• Line 7 (new): Keep the message:
          Error::Parse(String)
        </div>
        <p class="send-to">Send to</p>
        <div class="target">
          <span class="target-name"><span class="chat">Handle empty config input</span><br /><span class="idle">Idle</span></span>
          <span class="tick">✓</span>
        </div>
        <div class="modal-actions">
          <span class="cancel">Cancel</span>
          <span class="send" class:glow={frame.sendGlow}>Send to agent</span>
        </div>
      </div>
    </div>
  {/if}

  <div class="toast" class:on={frame.toastVisible}>✓ Review sent to “Handle empty config input”</div>
</div>

<style>
  .desktop {
    position: relative;
    height: 460px;
    /* Fits the ~670px demo column at full desktop width; narrower columns scale it down (ProductBlock). */
    min-width: 660px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: var(--radius-xl);
    background: #0f0f11;
    box-shadow: 0 30px 70px rgb(0 0 0 / 50%);
    font-family: var(--font-sans);
    font-size: 12px;
    color: #d4d4d8;
  }

  .layout {
    flex: 1;
    min-height: 0;
    display: flex;
  }

  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    height: 46px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    min-width: 0;
    overflow: hidden;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  .mode,
  .box,
  .searchbox,
  .toggle,
  .review {
    height: 30px;
    display: flex;
    align-items: center;
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: var(--radius-md);
    background: #161618;
  }

  .mode {
    width: 30px;
    justify-content: center;
  }

  .title {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 500;
    color: #ededef;
    white-space: nowrap;
  }

  .subtitle {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #8b8b95;
    white-space: nowrap;
  }

  .review {
    margin-left: auto;
    flex-shrink: 0;
    gap: 6px;
    padding: 0 9px;
    border-color: transparent;
    background: rgb(242 184 75 / 12%);
    color: #f2b84b;
    white-space: nowrap;
    opacity: 0;
    transition:
      opacity 0.4s ease,
      box-shadow 0.4s ease;
  }

  .review.on {
    opacity: 1;
  }

  .review.glow {
    box-shadow: 0 0 0 3px rgb(245 196 81 / 45%);
  }

  .count {
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgb(242 184 75 / 28%);
    font-size: 10px;
    font-weight: 700;
  }

  .searchbox {
    flex: 1 1 90px;
    min-width: 0;
    max-width: 180px;
    gap: 6px;
    padding: 0 8px;
    color: #8b8b95;
  }

  .placeholder {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .key {
    padding: 1px 5px;
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 4px;
    font-size: 9.5px;
    color: #b4b4bc;
  }

  .toggle {
    flex-shrink: 0;
    gap: 2px;
    padding: 2px;
  }

  .toggle span {
    height: 24px;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 9px;
    border-radius: var(--radius-sm);
    color: #8b8b95;
  }

  .toggle .on {
    background: #26262a;
    color: #ededef;
  }

  .box {
    width: 28px;
    flex-shrink: 0;
    justify-content: center;
    background: #26262a;
  }

  .more {
    width: 18px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
  }

  .body {
    flex: 1;
    min-height: 0;
    display: flex;
  }

  .overlay {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 55%);
    animation: hfFadeA 0.3s ease both;
  }

  .modal {
    width: 400px;
    padding: 16px;
    border: 1px solid #2a2b30;
    border-radius: 12px;
    background: #141518;
    box-shadow: 0 24px 60px rgb(0 0 0 / 60%);
  }

  .modal-head {
    display: flex;
    justify-content: space-between;
  }

  .modal-head b {
    font-size: 15px;
    color: #f4f4f5;
  }

  .sub {
    margin-top: 3px;
    color: #8a8d96;
  }

  .meta {
    margin: 10px 0 6px;
    font-size: 10.5px;
    color: #7c7f87;
  }

  .prompt {
    padding: 10px 12px;
    border: 1px solid #222328;
    border-radius: var(--radius-md);
    background: #101113;
    line-height: 1.6;
  }

  .prompt b {
    color: #f4f4f5;
  }

  .send-to {
    margin: 10px 0 6px;
    color: #d4d4d8;
  }

  .target {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: 1px solid #2b4c80;
    border-radius: var(--radius-md);
    background: #15213a;
  }

  .target-name {
    flex: 1;
  }

  .chat {
    color: #f4f4f5;
  }

  .idle {
    font-size: 10.5px;
    color: #8a8d96;
  }

  .tick {
    color: #7fb2ff;
  }

  .modal-actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .cancel {
    padding: 6px 12px;
    border: 1px solid #2a2b30;
    border-radius: var(--radius-sm);
    color: #d4d4d8;
  }

  .send {
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    background: #2563eb;
    color: #fff;
    font-weight: 600;
    transition: box-shadow 0.4s ease;
  }

  .send.glow {
    box-shadow: 0 0 0 3px rgb(59 130 246 / 50%);
  }

  .toast {
    position: absolute;
    right: 14px;
    bottom: 14px;
    z-index: 6;
    padding: 8px 12px;
    border: 1px solid #1f4d33;
    border-radius: var(--radius-md);
    background: #0f2219;
    color: #86efac;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;
  }

  .toast.on {
    opacity: 1;
    transform: none;
  }
</style>
