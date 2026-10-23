<script lang="ts">
  import { SKILLS_FRAMES, TICK, skillsFrame } from '$lib/motion/anims';
  import { createTicker } from '$lib/motion/ticker.svelte';

  // Animated Harness Skills workflow (example data): research, plan approved by you, three workers building, review
  // sending a finding back, security review and a pull request. Decorative: the product block beside it has the text.
  const ticker = createTicker({ interval: TICK });

  // Reduced motion: no loop, the last frame shows the delivered pull request.
  const frame = $derived(skillsFrame(ticker.reduced ? SKILLS_FRAMES - 1 : ticker.tick));
</script>

<div class="skills" {@attach ticker.observe}>
  <div class="bar">
    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    <span class="prompt">&gt; Add rate limiting to the API</span>
    <span class="skill">us-run-workflow</span>
  </div>

  <div class="stages">
    {#each frame.stages as stage (stage.label)}
      <div class="stage" style:border-color={stage.border} style:background={stage.bg} style:color={stage.fg}>
        {stage.mark}
        {stage.label}
        <span
          class="line"
          style:width={ticker.reduced && stage.barAnim ? '100%' : stage.bar}
          style:animation={stage.barAnim ? `${stage.barAnim} ${stage.barMs}ms linear forwards` : 'none'}
        ></span>
      </div>
    {/each}
  </div>

  <div class="panels">
    {#if frame.stage === 0}
      <div class="card">
        <p class="card-head"><span>research</span><span class="role">scout · read-only</span></p>
        <p class="step" class:on={frame.researchLines[0]}>› reading src/api/router.ts</p>
        <p class="step" class:on={frame.researchLines[1]}>› conventions from AGENTS.md</p>
        <p class="step" class:on={frame.researchLines[2]}>› 3 callers of the router found</p>
        <p class="memory">› note_search → 2 notes from Harness Memory</p>
      </div>
    {:else if frame.stage === 1}
      <div class="card">
        <p class="card-head"><span>Plan · rate limiting</span><span class="role">planner</span></p>
        <p class="item"><span class="n">1</span> Token-bucket limiter in src/middleware/</p>
        <p class="item"><span class="n">2</span> Wire it into api/router.ts</p>
        <p class="item"><span class="n">3</span> Return 429 with Retry-After</p>
        <p class="item last"><span class="n">4</span> Tests for limits and reset</p>
        <span class="approve" class:done={frame.approved}>{frame.approved ? '✓ approved by you' : 'Approve'}</span>
      </div>
    {:else if frame.stage === 2}
      <div class="build">
        <p class="budget">› limits() and budget_status() checked with Harness Dashboard</p>
        {#each frame.workers as worker (worker.role)}
          <div class="card worker">
            <div class="worker-head"><span class="worker-role">{worker.role}</span><span class="task">{worker.task}</span></div>
            <div class="track"><div class="fill" style:width={worker.width}></div></div>
          </div>
        {/each}
      </div>
    {:else if frame.stage === 3}
      <div class="card review">
        <p class="card-head"><span>Review</span><span class="role">fresh reviewer · correctness</span></p>
        <p class="scope">plan, callers and edge cases</p>
        <p class="result" style:color={frame.reviewColor}>{frame.reviewText}</p>
      </div>
    {:else if frame.stage === 4}
      <div class="card review">
        <p class="card-head"><span>Security review</span><span class="role">fresh reviewer</span></p>
        <p class="scope">trust boundaries, inputs, secrets</p>
        <p class="result" style:color={frame.securityColor}>{frame.securityText}</p>
      </div>
    {:else}
      <div class="card delivered">
        <p class="pr-head"><span class="open">Open</span><span class="num">#42</span></p>
        <p class="pr-title">feat: rate limiting for the API</p>
        <p class="pr-branch">feature/rate-limiting → main</p>
        <p class="pr-note">opened only when you ask for delivery</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .skills {
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

  .prompt {
    margin-left: 6px;
    color: var(--text-strong);
  }

  .skill {
    margin-left: auto;
    color: var(--c-skills);
  }

  .stages {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 6px;
    padding: 14px;
  }

  .stage {
    position: relative;
    overflow: hidden;
    padding: 9px 6px;
    border: 1px solid;
    border-radius: var(--radius-md);
    text-align: center;
    transition:
      background 0.45s ease,
      color 0.45s ease;
  }

  .line {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    background: var(--c-skills);
  }

  .panels {
    flex: 1;
    min-height: 0;
    padding: 4px 18px 18px;
  }

  .card {
    padding: 16px 18px;
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    background: #0d1314;
    animation: hfFadeA 0.4s ease both;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    color: var(--text-strong);
  }

  .role {
    font-size: 11px;
    color: var(--subtle);
  }

  .step {
    margin-bottom: 8px;
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .step.on {
    opacity: 1;
  }

  .memory {
    color: #f0abfc;
  }

  .item {
    margin-bottom: 7px;
  }

  .item.last {
    margin-bottom: 14px;
  }

  .n {
    color: var(--subtle);
  }

  .approve {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 7px;
    background: #1f2b1a;
    color: #d9f99d;
    font-weight: 700;
    transition:
      background 0.45s ease,
      color 0.45s ease;
  }

  .approve.done {
    background: var(--c-skills);
    color: #0b1406;
  }

  .build {
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: hfFadeA 0.4s ease both;
  }

  .budget {
    color: var(--c-dashboard);
  }

  .worker {
    padding: 14px 16px;
    animation: none;
  }

  .worker-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .worker-role {
    font-weight: 700;
    color: var(--text-strong);
  }

  .task {
    color: var(--muted);
  }

  .track {
    height: 6px;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 6px;
    background: #16201a;
  }

  .fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #a3e635);
    transition: width 0.6s ease;
  }

  .review {
    padding: 18px;
  }

  .review .card-head {
    margin-bottom: 14px;
  }

  .scope {
    margin-bottom: 10px;
    color: var(--muted);
  }

  .result {
    font-size: 14px;
    transition: color 0.45s ease;
  }

  .delivered {
    padding: 20px;
    border-color: #34501f;
    background: #0e150c;
  }

  .pr-head {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .open {
    padding: 3px 10px;
    border-radius: 999px;
    background: #1e3a12;
    color: var(--c-skills);
  }

  .num {
    color: var(--subtle);
  }

  .pr-title {
    margin-top: 14px;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-strong);
  }

  .pr-branch {
    margin-top: 8px;
    color: var(--muted);
  }

  .pr-note {
    margin-top: 16px;
    font-size: 11.5px;
    color: var(--subtle);
  }
</style>
