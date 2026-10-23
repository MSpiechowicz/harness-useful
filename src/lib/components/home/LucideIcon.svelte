<script lang="ts">
  import { ICONS, type IconName } from './desktop-icons';

  interface Props {
    name: IconName;
    size?: number;
    color?: string;
  }

  let { name, size = 14, color = '#b4b4bc' }: Props = $props();
</script>

<svg
  class="icon"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  {#each ICONS[name] as [tag, attrs], index (index)}
    <svelte:element this={tag} {...attrs} />
  {/each}
</svg>

<style>
  .icon {
    flex-shrink: 0;
  }
</style>
