<script lang="ts">
  import CompareTable from '$lib/components/ui/CompareTable.svelte';
  import type { Product } from '$lib/content/types';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  // Dashboard reads data from tools; the other products work with harnesses.
  const reads = $derived(product.id === 'dashboard');

  const columns = $derived([
    { key: 'name', label: reads ? 'Tool' : 'Harness' },
    { key: 'support', label: reads ? 'What it reads' : product.id === 'memory' ? 'How to connect' : 'Support' },
  ]);

  const caption = $derived(reads ? `Tools read by ${product.name}` : `Harnesses supported by ${product.name}`);
</script>

<CompareTable {columns} rows={product.harnesses} {caption} />
