<script lang="ts">
  import CodeBlock from '$lib/components/ui/CodeBlock.svelte';
  import { INSTALL } from '$lib/content/home';
</script>

<section id="install" class="container install" aria-labelledby="install-h">
  <div class="copy">
    <h2 id="install-h">{INSTALL.title}</h2>
    <p class="lead">{INSTALL.lead}</p>
  </div>

  <div class="commands">
    {#each INSTALL.commands as item (item.label)}
      <CodeBlock
        code={item.command}
        label={item.label.replace(/^# /, '')}
        prompt={item.prompt}
        lang={item.prompt === '>' ? 'powershell' : 'sh'}
      />
    {/each}
  </div>
</section>

<style>
  /* Stacked: copy on top, then both commands across the full width so each fits on one line at desktop width
     (narrower screens wrap them instead of scrolling). */
  .install {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding-block: var(--section-space);
  }

  .copy {
    max-width: 760px;
  }

  h2 {
    font-family: var(--font-mono);
    font-size: clamp(28px, 3.4vw, 46px);
    line-height: 1.08;
    letter-spacing: -0.045em;
    color: var(--text-strong);
  }

  .lead {
    margin-top: 14px;
    font-size: 17px;
    line-height: 1.6;
    color: var(--muted);
  }

  .commands {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
