<script lang="ts">
  import type { DesktopFrame } from '$lib/motion/anims';
  import { DIFF_LINES } from './desktop-data';
  import LucideIcon from './LucideIcon.svelte';

  interface Props {
    frame: DesktopFrame;
  }

  let { frame }: Props = $props();

  const MARKERS = { ctx: '', del: '-', add: '+', gap: '' };
</script>

<div class="diff">
  <div class="head">
    <b>lib.rs</b>
    <span class="chip">Modified</span>
    <span class="add">+15</span>
    <span class="del">−3</span>
    <span class="hint">Click a line to comment · Shift+click a second line for a range</span>
  </div>

  {#each DIFF_LINES as line, index (index)}
    {#if line.type === 'gap'}
      <div class="gap">{line.segs[0][0]}</div>
    {:else}
      <div class="line {line.type}" style:box-shadow={line.anchor ? `inset 0 0 0 1px ${frame.selLine}` : undefined}>
        <span class="num">{line.old ?? ''}</span>
        <span class="num">{line.next ?? ''}</span>
        <span class="marker">{MARKERS[line.type]}</span>
        <span class="code"
          >{#each line.segs as [text, kind], segIndex (segIndex)}<span class={kind}>{text}</span>{/each}</span
        >
      </div>
    {/if}

    {#if line.anchor && frame.isComposing}
      <div class="comment composing">
        <span class="where">Line 7 (new)</span>
        <div class="field">
          {frame.comment}<span class="caret"></span>
        </div>
        <div class="actions">
          <span>Ctrl ↵ to send · Esc to cancel</span>
          <span class="cancel">Cancel</span>
          <span class="send" class:glow={frame.commentGlow}>Comment</span>
        </div>
      </div>
    {/if}

    {#if line.anchor && frame.isSaved}
      <div class="comment saved">
        <div class="saved-text">
          <span class="where">Line 7 (new)</span>
          <div class="body">Keep the message: Error::Parse(String)</div>
        </div>
        <span class="tool"><LucideIcon name="pencil" size={12} /></span>
        <span class="tool danger"><LucideIcon name="trash" size={12} color="#F87171" /></span>
      </div>
    {/if}
  {/each}
</div>

<style>
  .diff {
    flex: 1;
    min-width: 0;
    position: relative;
    overflow: hidden;
    background: #0e0f11;
    font-family: var(--font-mono);
    font-size: 11.5px;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    border-bottom: 1px solid #1e1f23;
  }

  .head b {
    color: #f4f4f5;
  }

  .chip {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3a2e0e;
    color: #e9b949;
    font-family: var(--font-sans);
    font-size: 10px;
  }

  .add {
    color: #4ade80;
  }

  .del {
    color: #f87171;
  }

  .hint {
    margin-left: auto;
    font-family: var(--font-sans);
    font-size: 10px;
    color: #787b83;
  }

  .line {
    display: flex;
    height: 20px;
    align-items: center;
    white-space: pre;
    transition: box-shadow 0.4s ease;
  }

  .line.del {
    background: #3a1b1e;
  }

  .line.add {
    background: #12301f;
  }

  .num {
    width: 30px;
    text-align: right;
    color: #787b84;
  }

  .del .num {
    background: #4a2125;
    color: #91949d;
  }

  .add .num {
    background: #173b27;
    color: #999ca5;
  }

  .marker {
    width: 18px;
    text-align: center;
    color: #5a5d66;
  }

  .del .marker {
    color: #f87171;
  }

  .add .marker {
    color: #4ade80;
  }

  .code {
    color: #d4d4d8;
  }

  .kw {
    color: #e879a8;
  }

  .fn {
    color: #9cc3ff;
  }

  .ty {
    color: #67d4e8;
  }

  .cm {
    color: #7c7f88;
  }

  .gap {
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #15161a;
    color: #7c7f87;
    font-family: var(--font-sans);
    font-size: 10.5px;
  }

  .comment {
    margin: 6px 12px 8px 60px;
    border: 1px solid #26272c;
    border-radius: 10px;
    background: #141518;
    font-family: var(--font-sans);
    animation: hfFadeA 0.35s ease both;
  }

  .composing {
    padding: 10px;
  }

  .saved {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
  }

  .saved-text {
    flex: 1;
  }

  .where {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 5px;
    background: #13233f;
    color: #7fb2ff;
    font-size: 10.5px;
  }

  .field {
    margin-top: 8px;
    min-height: 40px;
    padding: 8px 10px;
    border: 1.5px solid #3b82f6;
    border-radius: 8px;
    background: #0f1012;
    color: #f4f4f5;
  }

  .caret {
    display: inline-block;
    width: 1.5px;
    height: 13px;
    margin-left: 1px;
    vertical-align: -2px;
    background: #f4f4f5;
    animation: hfBlink 1s steps(1) infinite;
  }

  .actions {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10.5px;
    color: #7c7f87;
  }

  .cancel {
    margin-left: auto;
    color: #d4d4d8;
  }

  .send {
    padding: 5px 12px;
    border-radius: 6px;
    background: #2563eb;
    color: #fff;
    font-weight: 600;
    transition: box-shadow 0.4s ease;
  }

  .send.glow {
    box-shadow: 0 0 0 3px rgb(59 130 246 / 45%);
  }

  .body {
    margin-top: 6px;
    color: #e4e4e7;
  }

  .tool {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: #1e1f24;
    color: #8a8d96;
  }

  .tool.danger {
    background: #3a1b1e;
    color: #f87171;
  }
</style>
