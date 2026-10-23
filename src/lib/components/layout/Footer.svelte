<script lang="ts">
  import { page } from '$app/state';
  import { ORG, PRODUCT_IDS, REPOS, SITE_REPO } from '$lib/config/site';
  import { ALL_LINKS, PAGE_LINKS } from './nav';

  // Evaluated at build time (static site).
  const year = new Date().getFullYear();

  const repoLinks = PRODUCT_IDS.map((id) => ({
    href: REPOS[id],
    label: PAGE_LINKS.find((link) => link.href === `/${id}`)?.label ?? id,
  }));

  const pathname = $derived(page.url.pathname);
</script>

<footer class="site-footer">
  <div class="container inner">
    <div class="about">
      <p class="tagline">exit 0 · harness useful family · open source</p>
      <p>
        <small>
          © {year}
          <a href={ORG.url}>Harness Useful</a>
          · GPL-3.0-or-later · No analytics, no cookies.
        </small>
      </p>
    </div>

    <nav aria-label="Footer">
      <p class="heading" aria-hidden="true">pages</p>
      <ul>
        {#each ALL_LINKS as link (link.href)}
          <li><a href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</a></li>
        {/each}
      </ul>
    </nav>

    <nav aria-label="Source code">
      <p class="heading" aria-hidden="true">source</p>
      <ul>
        {#each repoLinks as repo (repo.href)}
          <li><a href={repo.href} rel="noopener">{repo.label} <span class="visually-hidden">on GitHub</span></a></li>
        {/each}
        <li><a href={SITE_REPO} rel="noopener">this site</a></li>
      </ul>
    </nav>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: auto;
    border-top: 1px solid var(--border-soft);
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--subtle);
  }

  .inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 24px 48px;
    padding-block: 24px;
  }

  .about {
    flex: 1 1 280px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tagline {
    color: var(--muted);
  }

  .heading {
    margin-bottom: 8px;
    color: var(--subtle);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    max-width: 360px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: var(--muted);
  }

  a:hover,
  a[aria-current='page'] {
    color: var(--accent);
  }
</style>
