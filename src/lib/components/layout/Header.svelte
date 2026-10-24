<script lang="ts">
  import { page } from '$app/state';
  import { ORG } from '$lib/config/site';
  import Logo from './Logo.svelte';
  import { ALL_LINKS } from './nav';

  const pathname = $derived(page.url.pathname);

  function current(href: string): 'page' | undefined {
    return pathname === href ? 'page' : undefined;
  }
</script>

<header class="site-header">
  <div class="container bar">
    <a class="brand" href="/">
      <Logo />
      <span><span class="brand-dim">harness</span> useful</span>
    </a>

    <nav aria-label="Main">
      <ul>
        {#each ALL_LINKS as link (link.href)}
          <li><a href={link.href} aria-current={current(link.href)}>{link.label}</a></li>
        {/each}
        <li><a href={ORG.github} rel="noopener">GitHub</a></li>
        <li><a class="install" href="/#install">Install</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: relative;
    z-index: 2;
    border-bottom: 1px solid var(--border-soft);
  }

  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-block: 16px;
    font-family: var(--font-mono);
    font-size: 14px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    text-decoration: none;
  }

  .brand:hover {
    color: var(--text-strong);
  }

  .brand-dim {
    color: var(--subtle);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 22px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  nav a {
    color: var(--muted);
    text-decoration: none;
  }

  nav a:hover,
  nav a[aria-current='page'] {
    color: var(--text-strong);
  }

  nav a[aria-current='page'] {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-underline-offset: 6px;
  }

  nav a.install {
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    background: var(--accent);
    color: var(--accent-ink);
    font-weight: 700;
  }

  nav a.install:hover {
    background: var(--accent-hover);
    color: var(--accent-ink);
  }
</style>
