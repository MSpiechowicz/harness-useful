<script lang="ts">
  import Logo from '$lib/components/layout/Logo.svelte';
  import { RAIL_GROUPS } from './desktop-data';
  import LucideIcon from './LucideIcon.svelte';
</script>

<div class="rail">
  <span class="logo"><Logo size={22} /></span>

  <span class="search"><LucideIcon name="search" size={12} /></span>

  {#each RAIL_GROUPS as group, groupIndex (groupIndex)}
    {#if groupIndex > 0}<span class="divider"></span>{/if}

    {#each group as item (item.icon)}
      <span class="item" class:active={item.active}>
        <LucideIcon name={item.icon} color={item.active ? '#ededef' : '#b4b4bc'} />
        {#if item.badge}<span class="badge">{item.badge}</span>{/if}
      </span>
    {/each}
  {/each}

  <span class="foot">
    <LucideIcon name="download" size={13} color="#5ea8ff" />
    <span class="status"></span>
  </span>
</div>

<style>
  .rail {
    width: 44px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding-bottom: 10px;
    border-right: 1px solid rgb(255 255 255 / 8%);
  }

  .logo {
    height: 46px;
    display: flex;
    align-items: center;
  }

  .search {
    width: 30px;
    height: 22px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 7px;
    background: #1c1c1f;
  }

  .item {
    position: relative;
    width: 26px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .item.active {
    background: #26262a;
  }

  .badge {
    position: absolute;
    right: -3px;
    top: -3px;
    min-width: 13px;
    height: 13px;
    padding: 0 3px;
    border-radius: 7px;
    background: #f2b84b;
    color: #161618;
    font-size: 8.5px;
    font-weight: 800;
    line-height: 13px;
    text-align: center;
  }

  .divider {
    width: 20px;
    height: 1px;
    margin: 6px 0;
    background: rgb(255 255 255 / 8%);
  }

  .foot {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .status {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3dd6a8;
  }
</style>
