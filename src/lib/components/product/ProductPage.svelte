<script lang="ts">
  import FaqList from '$lib/components/ui/FaqList.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Shot from '$lib/components/ui/Shot.svelte';
  import Video from '$lib/components/ui/Video.svelte';
  import type { ProductId } from '$lib/config/site';
  import { PRODUCTS } from '$lib/content/products';
  import { SHOTS } from './assets';
  import FamilyLinks from './FamilyLinks.svelte';
  import HarnessTable from './HarnessTable.svelte';
  import InstallSteps from './InstallSteps.svelte';
  import PrivacyList from './PrivacyList.svelte';
  import ProductHero from './ProductHero.svelte';

  interface Props {
    id: ProductId;
  }

  let { id }: Props = $props();

  const product = $derived(PRODUCTS[id]);
  const shots = $derived(SHOTS[id]);
  const reads = $derived(id === 'dashboard');

  const accentHover = $derived(`color-mix(in srgb, ${product.color} 55%, white)`);

  // "Chat with approvals" -> "chat with approvals"; acronyms such as "MCP server" keep their case.
  function lowerFirst(text: string) {
    return /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
  }

  function joinList(items: string[]) {
    if (items.length < 2) return items.join('');

    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  // The definition expanded with facts from the product content only: key features, platforms, license.
  const highlights = $derived(joinList(product.features.slice(0, 3).map((feature) => lowerFirst(feature.title))));
</script>

<article class="product" style:--accent={product.color} style:--accent-hover={accentHover}>
  <ProductHero {product} />

  <Section id="what-is" title="What is {product.name}?" eyebrow="$ {id} --about">
    <div class="prose">
      <p>{product.definition}</p>
      <p>
        It includes {highlights}. It runs on {joinList(product.platforms)}, and it is open source under the
        {product.license} license.
      </p>
    </div>
  </Section>

  <Section id="features" title="What does {product.name} do?" eyebrow="$ {id} --features">
    <ul class="features">
      {#each product.features as feature (feature.title)}
        <li>
          <h3>{feature.title}</h3>
          <p>{feature.text}</p>
        </li>
      {/each}
    </ul>
  </Section>

  <Section
    id="harnesses"
    title={reads ? `Which tools does ${product.name} read?` : `Which harnesses does ${product.name} support?`}
    eyebrow="$ {id} --{reads ? 'sources' : 'harnesses'}"
  >
    <HarnessTable {product} />
  </Section>

  <Section id="install" title="How do I install {product.name}?" eyebrow="$ {id} --install">
    <InstallSteps steps={product.install} />
    <p class="note">
      Prefer a download? Every release and its notes are on the
      <a href={product.releases} rel="noopener">{product.name} releases page</a>.
    </p>
  </Section>

  <Section id="privacy" title={product.privacyHeading ?? `Is ${product.name} private? Where does my data live?`} eyebrow="$ {id} --privacy">
    <PrivacyList items={product.privacy} />
  </Section>

  <Section id="family" title="How does {product.name} fit the Harness Useful family?" eyebrow="$ {id} --family">
    <FamilyLinks {id} />
  </Section>

  <Section id="screenshots" title="{product.name} screenshots" eyebrow="$ {id} --screenshots">
    <ul class="shots">
      {#each shots as shot (shot.caption)}
        <li>
          <Shot src={shot.src} alt={shot.alt} caption={shot.caption} sizes="(min-width: 1240px) 600px, (min-width: 800px) 50vw, 100vw" />
        </li>
      {/each}
    </ul>
  </Section>

  {#if product.video}
    <Section id="tour" title="Watch the {product.name} tour" eyebrow="$ {id} --tour">
      <div class="video">
        <Video src={product.video.src} poster={product.video.poster} title={product.video.title}>
          {#snippet caption()}{product.video?.description}{/snippet}
        </Video>
      </div>
    </Section>
  {/if}

  <Section id="faq" title="{product.name} FAQ" eyebrow="$ {id} --faq">
    <FaqList items={product.faq} headingLevel={3} />
  </Section>

  <section class="cta container" aria-label="Get {product.name}">
    <a class="primary" href={product.repo} rel="noopener">{product.name} on GitHub</a>
    <a class="secondary" href={product.releases} rel="noopener">Releases</a>
    <a class="secondary" href="/#products">Back to the family</a>
  </section>
</article>

<style>
  .prose {
    max-width: 760px;
  }

  .prose p {
    margin-bottom: 14px;
    font-size: 17px;
    line-height: 1.65;
    color: var(--muted);
  }

  .prose p:first-child {
    color: var(--text);
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .features li {
    padding: 18px 20px;
    border: 1px solid var(--border);
    border-top: 2px solid var(--accent);
    border-radius: var(--radius-lg);
    background: var(--panel);
  }

  .features h3 {
    margin-bottom: 8px;
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-strong);
  }

  .features p {
    font-size: 15px;
    line-height: 1.6;
    color: var(--muted);
  }

  .note {
    max-width: 760px;
    margin-top: 18px;
    font-size: 15px;
    color: var(--muted);
  }

  .shots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr));
    gap: 24px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding-block: var(--space-6) var(--space-9);
  }

  .cta a {
    padding: 12px 18px;
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-weight: 700;
    text-decoration: none;
  }

  .primary {
    background: var(--accent);
    color: var(--accent-ink);
  }

  .primary:hover {
    background: var(--accent-hover);
    color: var(--accent-ink);
  }

  .secondary {
    border: 1px solid var(--border-strong);
    color: var(--text);
  }

  .secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
