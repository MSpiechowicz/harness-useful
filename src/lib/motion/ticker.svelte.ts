// Pausable interval utilities for the homepage demos (Svelte 5 runes). SSR-safe: nothing touches window at import
// time, and the browser listeners are created in an $effect, which never runs during server rendering.
//
// A ticker advances only while all of these hold:
//   - the user has not paused it (autoplay stops when prefers-reduced-motion is set),
//   - the tab is visible (document.hidden is false),
//   - at least one observed element is on screen (or nothing is observed).
//
// Call createTicker/createStepper during component initialisation; everything is cleaned up when it is destroyed.
//
//   const ticker = createTicker({ interval: 650 });
//   <div {@attach ticker.observe}>{ticker.tick}</div>
import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { SvelteSet } from 'svelte/reactivity';

export interface RunConditions {
  playing: boolean;
  hidden: boolean;
  visible: boolean;
}

/** Whether the interval should be ticking for the given conditions. */
export function shouldRun({ playing, hidden, visible }: RunConditions): boolean {
  return playing && !hidden && visible;
}

/** Wraps `index` into `0..count-1`, also for negative values; an empty range yields 0. */
export function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0;

  return ((index % count) + count) % count;
}

/** Tracks whether any observed element intersects the viewport. Visible by default (SSR, no observed nodes). */
function createVisibility() {
  let observed = $state(0);
  let observer: IntersectionObserver | undefined;
  const inView = new SvelteSet<Element>();

  function onEntries(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) inView.add(entry.target);
      else inView.delete(entry.target);
    }
  }

  const observe: Attachment<Element> = (node) => {
    if (typeof IntersectionObserver === 'undefined') return;

    observer ??= new IntersectionObserver(onEntries);
    observer.observe(node);

    // Attachments run inside an effect: `observed += 1` also reads it, which would make the attachment depend on
    // the counter it increments and re-run forever (effect_update_depth_exceeded). Mutate it untracked.
    untrack(() => (observed += 1));

    return () => {
      observer?.unobserve(node);

      untrack(() => {
        inView.delete(node);
        observed -= 1;

        if (observed === 0) {
          observer?.disconnect();
          observer = undefined;
        }
      });
    };
  };

  return {
    get visible() {
      return observed === 0 || inView.size > 0;
    },
    observe,
  };
}

export interface TickerOptions {
  /** Milliseconds between ticks. */
  interval: number;
  /** Start playing (ignored when the user prefers reduced motion). Default true. */
  autoplay?: boolean;
  /** Called with the step size on every tick (1) and on `step(n)`. */
  onTick?: (delta: number) => void;
}

export interface Ticker {
  /** Number of steps taken so far (reactive). */
  readonly tick: number;
  /** User intent: true after play(), false after pause(). */
  readonly playing: boolean;
  /** Actually ticking right now (playing, tab visible and on screen). */
  readonly running: boolean;
  /** The user prefers reduced motion: consumers should render a final, static frame. */
  readonly reduced: boolean;
  play(): void;
  pause(): void;
  toggle(): void;
  /** Advances by `n` (negative allowed) and restarts the interval so the next tick is a full interval away. */
  step(n?: number): void;
  /** Restarts the interval timer without advancing. */
  restart(): void;
  /** Attachment: `{@attach ticker.observe}` pauses the ticker while the element is off-screen. */
  observe: Attachment<Element>;
}

export function createTicker({ interval, autoplay = true, onTick }: TickerOptions): Ticker {
  let tick = $state(0);
  let playing = $state(autoplay);
  let reduced = $state(false);
  let hidden = $state(false);
  let epoch = $state(0);
  const visibility = createVisibility();

  const running = $derived(shouldRun({ playing, hidden, visible: visibility.visible }));

  // Environment: reduced motion and tab visibility. Runs before the interval effect on mount.
  $effect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncMotion() {
      reduced = motion.matches;
      if (motion.matches) playing = false;
    }

    function syncVisibility() {
      hidden = document.hidden;
    }

    syncMotion();
    syncVisibility();
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      motion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  });

  function advance(delta: number) {
    tick += delta;
    onTick?.(delta);
  }

  $effect(() => {
    void epoch;
    if (!running) return;

    const id = setInterval(() => advance(1), interval);

    return () => clearInterval(id);
  });

  function restart() {
    epoch += 1;
  }

  function play() {
    playing = true;
    restart();
  }

  function pause() {
    playing = false;
  }

  return {
    get tick() {
      return tick;
    },
    get playing() {
      return playing;
    },
    get running() {
      return running;
    },
    get reduced() {
      return reduced;
    },
    play,
    pause,
    toggle() {
      if (playing) pause();
      else play();
    },
    step(n = 1) {
      advance(n);
      restart();
    },
    restart,
    observe: visibility.observe,
  };
}

export interface StepperOptions {
  /** Number of positions (for example the 9 hops of a prompt). */
  count: number;
  /** Milliseconds between automatic steps. */
  interval: number;
  autoplay?: boolean;
}

export interface Stepper {
  /** Current position, `0..count-1` (reactive). */
  readonly index: number;
  readonly playing: boolean;
  readonly running: boolean;
  readonly reduced: boolean;
  /** Moves forward, wrapping to 0 after the last position. */
  next(): void;
  /** Moves back, wrapping to the last position. */
  prev(): void;
  /** Jumps to a position (clamped by wrapping). */
  go(index: number): void;
  play(): void;
  pause(): void;
  toggle(): void;
  observe: Attachment<Element>;
}

/** A looping position counter on top of a ticker with the same pause rules. */
export function createStepper({ count, interval, autoplay = true }: StepperOptions): Stepper {
  let index = $state(0);

  const ticker = createTicker({
    interval,
    autoplay,
    onTick: (delta) => {
      index = wrapIndex(index + delta, count);
    },
  });

  return {
    get index() {
      return index;
    },
    get playing() {
      return ticker.playing;
    },
    get running() {
      return ticker.running;
    },
    get reduced() {
      return ticker.reduced;
    },
    next: () => ticker.step(1),
    prev: () => ticker.step(-1),
    go(target) {
      index = wrapIndex(target, count);
      ticker.restart();
    },
    play: ticker.play,
    pause: ticker.pause,
    toggle: ticker.toggle,
    observe: ticker.observe,
  };
}
