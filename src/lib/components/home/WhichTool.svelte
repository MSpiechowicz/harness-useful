<script lang="ts">
  import CompareTable from '$lib/components/ui/CompareTable.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import { COMPARISON } from '$lib/content/home';

  // Answer-first section for "which tool do I need?" (also read by assistants). Facts come from COMPARISON.
  const ANSWER =
    'Start with Harness Desktop, which installs the other three for you, or pick one tool: Skills for the workflow, Memory for shared project notes, Dashboard for token usage and cost.';

  const COLUMNS = [
    { key: 'name', label: 'Tool' },
    { key: 'what', label: 'What it does' },
    { key: 'runsAs', label: 'Runs as' },
    { key: 'platforms', label: 'Platforms' },
    { key: 'worksWith', label: 'Works with' },
    { key: 'dataLives', label: 'Where its data lives' },
    { key: 'license', label: 'License' },
  ];

  const rows = COMPARISON.map((row) => ({ ...row }));
</script>

<Section id="which-tool" title="Which tool do I need?" lead={ANSWER}>
  <CompareTable columns={COLUMNS} {rows} caption="The four Harness Useful tools compared">
    {#snippet cell(value, column, row)}
      {#if column.key === 'name'}
        <a href="/{row.id}">{value}</a>
      {:else}
        {value}
      {/if}
    {/snippet}
  </CompareTable>
</Section>
