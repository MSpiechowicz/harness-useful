import { describe, expect, test } from 'bun:test';
import { shouldRun, wrapIndex } from './ticker.svelte';

describe('wrapIndex', () => {
  test('keeps in-range values', () => {
    expect(wrapIndex(0, 9)).toBe(0);
    expect(wrapIndex(8, 9)).toBe(8);
  });

  test('wraps forward past the last position', () => {
    expect(wrapIndex(9, 9)).toBe(0);
    expect(wrapIndex(10, 9)).toBe(1);
  });

  test('wraps backward from the first position', () => {
    expect(wrapIndex(-1, 9)).toBe(8);
    expect(wrapIndex(-10, 9)).toBe(8);
  });

  test('an empty range yields 0', () => {
    expect(wrapIndex(3, 0)).toBe(0);
  });
});

describe('shouldRun', () => {
  const base = { playing: true, hidden: false, visible: true };

  test('runs only when playing, tab visible and on screen', () => {
    expect(shouldRun(base)).toBe(true);
    expect(shouldRun({ ...base, playing: false })).toBe(false);
    expect(shouldRun({ ...base, hidden: true })).toBe(false);
    expect(shouldRun({ ...base, visible: false })).toBe(false);
  });
});
