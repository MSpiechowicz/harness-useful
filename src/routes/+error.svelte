<script lang="ts">
  import { page } from '$app/state';
  import { ALL_LINKS } from '$lib/components/layout/nav';

  const notFound = $derived(page.status === 404);
  const heading = $derived(notFound ? 'Page not found' : 'Something went wrong');
  const detail = $derived(
    notFound ? 'That page does not exist (or moved). Pick one of the pages below.' : (page.error?.message ?? 'Unexpected error.'),
  );
</script>

<svelte:head>
  <title>{page.status} · {heading} · Harness Useful</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="container error">
  <p class="eyebrow">$ exit {page.status}<span class="cursor">_</span></p>
  <h1>{heading}</h1>
  <p class="detail">{detail}</p>

  <nav aria-label="Pages">
    <ul>
      {#each ALL_LINKS as link (link.href)}
        <li><a href={link.href}>{link.label}</a></li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .error {
    padding-block: var(--space-9);
  }

  .eyebrow {
    margin-bottom: 20px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
  }

  .cursor {
    animation: hfBlink 1s steps(1) infinite;
  }

  h1 {
    font-family: var(--font-mono);
    font-size: clamp(34px, 4.6vw, 60px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: var(--text-strong);
  }

  .detail {
    max-width: 520px;
    margin-top: 22px;
    font-size: 18px;
    line-height: 1.6;
    color: var(--muted);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 30px 0 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: inline-block;
    padding: 12px 18px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    color: var(--text);
    font-family: var(--font-mono);
    text-decoration: none;
  }

  a:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
