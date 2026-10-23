<script lang="ts">
  import CodeBlock from '$lib/components/ui/CodeBlock.svelte';
  import type { InstallStep } from '$lib/content/types';

  interface Props {
    steps: InstallStep[];
  }

  let { steps }: Props = $props();

  // PowerShell commands get a PowerShell prompt; shell commands keep the default `$`.
  function promptFor(step: InstallStep) {
    return step.platform === 'windows' ? 'PS>' : '$';
  }
</script>

<ol>
  {#each steps as step (step.platform)}
    <li>
      <CodeBlock label={step.label} code={step.command} lang={step.platform === 'windows' ? 'powershell' : 'sh'} prompt={promptFor(step)} />
    </li>
  {/each}
</ol>

<style>
  ol {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    min-width: 0;
  }
</style>
