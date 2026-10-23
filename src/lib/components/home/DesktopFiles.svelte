<script lang="ts">
  import type { DesktopFrame } from '$lib/motion/anims';
  import { FILE_GROUPS } from './desktop-data';
  import LucideIcon from './LucideIcon.svelte';

  interface Props {
    frame: DesktopFrame;
  }

  let { frame }: Props = $props();
</script>

<div class="files">
  {#each FILE_GROUPS as group (group.title)}
    <div class="group"><span>⌄ {group.title}</span><span>{group.files.length}</span></div>

    {#each group.files as file (file.dir + file.name)}
      <div class="file" class:selected={file.selected}>
        <span class="status {file.status}">{file.status}</span>
        <span class="path"><span class="dir">{file.dir}</span><span class="name">{file.name}</span></span>
        {#if file.selected}<span class="badge" class:on={frame.badgeVisible}>1</span>{/if}
        <span class="add">+{file.add}</span>
        <span class="del">−{file.del}</span>
      </div>
    {/each}
  {/each}

  <span class="cost"><LucideIcon name="coins" size={12} color="#8b8b95" />{frame.cost}</span>
</div>

<style>
  .files {
    width: 206px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 4px 6px 8px;
    border-right: 1px solid #1e1f23;
  }

  .group {
    display: flex;
    justify-content: space-between;
    padding: 8px 8px 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #8a8d96;
  }

  .file {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 8px;
    border: 1px solid transparent;
    border-radius: 6px;
  }

  .file.selected {
    border-color: #2b4c80;
    background: #172033;
  }

  .status {
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 700;
  }

  .M {
    background: #3a2e0e;
    color: #e9b949;
  }

  .R {
    background: #142a4a;
    color: #6ea8fe;
  }

  .A,
  .U {
    background: #133222;
    color: #4ade80;
  }

  .path {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dir {
    color: #8a8d96;
  }

  .name {
    color: #e4e4e7;
  }

  .badge {
    padding: 0 5px;
    border-radius: 4px;
    background: #13233f;
    color: #7fb2ff;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .badge.on {
    opacity: 1;
  }

  .add,
  .del {
    font-size: 10.5px;
  }

  .add {
    color: #4ade80;
  }

  .del {
    color: #f87171;
  }

  .cost {
    margin-top: auto;
    padding: 0 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #b4b4bc;
    font-size: 11.5px;
  }
</style>
