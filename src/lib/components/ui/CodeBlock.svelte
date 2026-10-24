<script lang="ts">
  interface Props {
    /** Raw text to display and copy (one command per line, no prompt characters). */
    code: string;
    /** Caption line shown above the code, e.g. `macOS · Linux`. */
    label?: string;
    /** Language hint, exposed as `class="language-<lang>"` on the code element. */
    lang?: string;
    /** Decorative prompt shown before each line and excluded from selection and copy. */
    prompt?: string;
    /** Wrap long lines instead of scrolling sideways (the copied text is unchanged). On by default. */
    wrap?: boolean;
  }

  let { code, label, lang = 'sh', prompt = '$', wrap = true }: Props = $props();

  const lines = $derived(code.split('\n'));

  // The copy button only exists once hydrated: without JS it would do nothing.
  let hydrated = $state(false);
  let status = $state('');
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    hydrated = true;

    return () => clearTimeout(resetTimer);
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      status = 'Copied';
    } catch {
      status = 'Copy failed';
    }

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (status = ''), 2000);
  }
</script>

<div class="code-block" class:wrap>
  {#if label}<p class="label"># {label}</p>{/if}

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code class="language-{lang}"
      >{#each lines as line, index (index)}{#if prompt}<span class="prompt" aria-hidden="true">{prompt} </span>{/if}{line}{index <
        lines.length - 1
          ? '\n'
          : ''}{/each}</code
    ></pre>

  {#if hydrated}
    <button type="button" class="copy" onclick={copy} aria-label={label ? `Copy ${label} code` : undefined}>
      {status === 'Copied' ? 'Copied' : 'Copy'}
    </button>
  {/if}

  <span class="visually-hidden" role="status" aria-live="polite">{status}</span>
</div>

<style>
  .code-block {
    position: relative;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    font-family: var(--font-mono);
    /* 13px fits the longest one-line install command (about 140 characters) across the full container. */
    font-size: 13px;
  }

  .label {
    padding: 14px 84px 0 18px;
    color: var(--subtle);
  }

  pre {
    margin: 0;
    padding: 16px 18px;
    overflow-x: auto;
    white-space: pre;
  }

  .wrap pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .label + pre {
    padding-top: 0;
  }

  code {
    font-family: inherit;
  }

  .prompt {
    color: var(--accent);
    user-select: none;
  }

  .copy {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .copy:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
