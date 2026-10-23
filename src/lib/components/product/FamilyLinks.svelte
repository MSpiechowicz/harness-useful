<script lang="ts">
  import { PRODUCT_IDS, type ProductId } from '$lib/config/site';
  import { PRODUCTS } from '$lib/content/products';

  interface Props {
    id: ProductId;
  }

  let { id }: Props = $props();

  // Family roles from the FAMILY_FAQ answers ("What is Harness Useful?", "How do the tools connect to each other?").
  const ROLES: Record<ProductId, string> = {
    desktop: 'the window',
    skills: 'the workflow',
    memory: 'the shared project memory',
    dashboard: 'the usage and cost meter',
  };

  const product = $derived(PRODUCTS[id]);
  const others = $derived(PRODUCT_IDS.filter((other) => other !== id).map((other) => PRODUCTS[other]));
</script>

<p>
  {product.name} is {ROLES[id]} in Harness Useful, a family of four open-source, local tools for coding-agent harnesses. Harness Desktop is the
  window, Harness Skills the workflow, Harness Memory the shared project memory and Harness Dashboard the usage and cost meter.
</p>
<p>
  Each tool works on its own. Harness Desktop’s Recommended setup can install the others after you confirm each part and register their MCP
  servers in each detected harness.
</p>

<ul class="others">
  {#each others as other (other.id)}
    <li style:--tool-color={other.color}>
      <a href="/{other.id}">{other.name}</a>
      <span>{other.tagline}</span>
    </li>
  {/each}
</ul>

<p class="more">
  See <a href="/">the Harness Useful home page</a>, <a href="/#products">all four tools side by side</a> or the
  <a href="/faq">family FAQ</a>.
</p>

<style>
  p {
    max-width: 760px;
    margin-bottom: 14px;
    font-size: 17px;
    line-height: 1.65;
    color: var(--muted);
  }

  .others {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
    margin: 22px 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px 18px;
    border: 1px solid var(--border);
    border-left: 3px solid var(--tool-color);
    border-radius: var(--radius-lg);
    background: var(--panel);
  }

  li a {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--tool-color);
    text-decoration: none;
  }

  li a:hover {
    text-decoration: underline;
  }

  li span {
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
  }

  .more {
    margin-bottom: 0;
    font-size: 15px;
  }
</style>
