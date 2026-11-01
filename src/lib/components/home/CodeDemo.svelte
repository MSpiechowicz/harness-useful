<script lang="ts">
  import { CODE_FRAMES, TICK, codeFrame } from '$lib/motion/anims';
  import { createTicker } from '$lib/motion/ticker.svelte';

  // Animated Harness Code (example data): the agent is nudged from grep to the code graph, follows a call path hop by
  // hop and checks what depends on the function it will change. Decorative: the product block beside it has the text.
  const ticker = createTicker({ interval: TICK });

  // Reduced motion: no loop, the last frame shows the whole path and the impact card.
  const frame = $derived(codeFrame(ticker.reduced ? CODE_FRAMES - 1 : ticker.tick));

  // One hop per line: the symbol, where it is defined, and the line of code that calls the next hop.
  const HOPS = [
    { name: 'run_cli', where: 'src/main.rs:41', site: 'let cfg = load_config(&args)?;' },
    { name: 'load_config', where: 'src/config/mod.rs:88', site: 'let text = read_source(&path)?;' },
    { name: 'read_source', where: 'src/config/source.rs:23', site: 'parse_toml(&text)' },
    { name: 'parse_toml', where: 'src/config/parse.rs:12', site: 'pub fn parse_toml(text: &str)' },
  ];

  // The ranked code map beside the log; the files on the path light up as the hops appear.
  const MAP = [
    { file: 'main.rs', signature: 'fn run_cli(args: Args)', hop: 0 },
    { file: 'mod.rs', signature: 'fn load_config(path: &Path)', hop: 1 },
    { file: 'source.rs', signature: 'fn read_source(path: &Path)', hop: 2 },
    { file: 'parse.rs', signature: 'fn parse_toml(text: &str)', hop: 3 },
    { file: 'args.rs', signature: 'struct Args', hop: -1 },
    { file: 'lib.rs', signature: 'pub mod config', hop: -1 },
  ];
</script>

<div class="code" {@attach ticker.observe}>
  <div class="bar">
    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    <span class="name">harness-code</span>
    <span class="repo">github.com/useful/harness-cli</span>
    <span class="proto">MCP · stdio</span>
  </div>

  <div class="cols">
    <div class="log">
      <div class="line grep" class:on={frame.lines[0]} class:struck={frame.struck}>
        <span class="agent-mark">›</span> <span class="grep-text">grep -rn "load_config"</span>
      </div>
      <div class="line hint" class:on={frame.lines[1]}>+ load_config is indexed → code_symbol</div>
      <div class="line call" class:on={frame.lines[2]}>
        <span class="code-mark">›</span> code_path("{frame.query}",
      </div>
      <div class="line call-end" class:on={frame.lines[2]}>"parse_toml")</div>

      <div class="hops">
        {#each HOPS as hop, index (hop.name)}
          <div class="hop" class:on={frame.hops[index]}>
            <div class="hop-head"><span class="symbol">{hop.name}</span><span class="where">{hop.where}</span></div>
            <div class="site">└ {hop.site}</div>
          </div>
        {/each}
      </div>

      <div class="line impact-call" class:on={frame.lines[3]}>
        <span class="code-mark">›</span> code_impact(parse_toml)
      </div>

      <div class="summary" class:on={frame.card}>
        <div class="summary-head">
          <span class="kind">Impact</span><span class="summary-title">parse_toml</span>
          <span class="counts">3 callers · 2 tests</span>
        </div>
        <div class="summary-row" class:on={frame.impact[0]}>
          <p>depth 1 · load_config, read_manifest</p>
          <p>depth 2 · run_cli</p>
        </div>
        <div class="summary-row" class:on={frame.impact[1]}>
          <p>tests · empty_config, roundtrip</p>
        </div>
      </div>
    </div>

    <div class="map">
      <p class="map-title">code map · ranked</p>

      {#each MAP as entry (entry.file)}
        <div class="entry" class:on={entry.hop >= 0 && frame.hops[entry.hop]}>
          <span class="file">{entry.file}</span>
          <span class="signature">{entry.signature}</span>
        </div>
      {/each}

      <p class="next" class:on={frame.next}>the index refreshes on every call</p>
    </div>
  </div>
</div>

<style>
  .code {
    position: relative;
    height: 460px;
    min-width: 560px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-xl);
    background: #0b0f10;
    box-shadow: 0 30px 70px rgb(0 0 0 / 50%);
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: #c3cfcb;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    background: #0d1314;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #2a3637;
  }

  .name {
    margin-left: 6px;
    color: var(--text-strong);
  }

  .repo {
    color: var(--subtle);
  }

  .proto {
    margin-left: auto;
    color: var(--c-code);
  }

  .cols {
    flex: 1;
    min-height: 0;
    display: flex;
  }

  .log {
    position: relative;
    flex: 1.4 1 0;
    min-width: 0;
    padding: 14px 16px;
    border-right: 1px solid var(--border);
    line-height: 1.7;
  }

  .line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .line.on {
    opacity: 1;
  }

  .agent-mark {
    color: var(--accent);
  }

  .code-mark {
    color: var(--c-code);
  }

  .grep-text {
    transition:
      color 0.45s ease,
      text-decoration-color 0.45s ease;
  }

  .grep.struck .grep-text {
    color: var(--subtle);
    text-decoration: line-through;
  }

  .hint {
    color: var(--c-desktop);
  }

  .call-end {
    padding-left: 12ch;
  }

  .hops {
    margin: 2px 0 4px;
  }

  .hop {
    opacity: 0;
    transform: translateY(6px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }

  .hop.on {
    opacity: 1;
    transform: none;
  }

  .hop-head,
  .site {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hop-head {
    line-height: 1.5;
  }

  .symbol {
    margin-right: 10px;
    font-weight: 700;
    color: var(--text-strong);
  }

  .where {
    color: var(--c-code);
  }

  .site {
    padding-left: 14px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--muted);
  }

  .summary {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    padding: 12px 14px;
    border: 1px solid #5c2a2a;
    border-radius: 12px;
    background: #170d0d;
    line-height: 1.5;
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }

  .summary.on {
    opacity: 1;
    transform: none;
  }

  .summary-head {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    align-items: baseline;
  }

  .kind {
    flex-shrink: 0;
    padding: 2px 7px;
    border-radius: 5px;
    background: #2a1414;
    color: var(--c-code);
    font-size: 11px;
  }

  .summary-title {
    font-weight: 700;
    color: var(--text-strong);
  }

  .counts {
    margin-left: auto;
    color: var(--c-code);
  }

  .summary-row {
    margin-top: 4px;
    font-size: 11px;
    line-height: 1.45;
    color: #a9b6b2;
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .summary-row.on {
    opacity: 1;
  }

  .map {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 10px;
  }

  .map-title {
    margin: 0 0 6px 10px;
    font-size: 11px;
    color: var(--subtle);
  }

  .entry {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 6px 10px;
    border-radius: var(--radius-md);
    transition: background 0.5s;
  }

  .entry.on {
    background: rgb(248 113 113 / 14%);
  }

  .file,
  .signature {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file {
    color: var(--text);
  }

  .signature {
    font-size: 11px;
    color: var(--muted);
  }

  .summary-row p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .next {
    margin: auto 0 0 10px;
    font-size: 11px;
    color: var(--c-code);
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .next.on {
    opacity: 1;
  }
</style>
