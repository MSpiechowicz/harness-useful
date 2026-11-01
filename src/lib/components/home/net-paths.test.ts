import { describe, expect, test } from 'bun:test';
import { NET_ENDS } from '$lib/content/home-net';
import { NET_LINKS, NET_WIRES, pathLength, quietColor, reversePath } from './net-paths';

describe('reversePath', () => {
  test('draws the same cubic from its other end', () => {
    expect(reversePath('M 1 2 C 3 4, 5 6, 7 8')).toBe('M 7 8 C 5 6, 3 4, 1 2');
    expect(reversePath(reversePath(NET_WIRES[3].d))).toBe(NET_WIRES[3].d);
  });

  test('refuses a path that is not one cubic', () => {
    expect(() => reversePath('M 0 0 L 1 1')).toThrow();
  });
});

describe('pathLength', () => {
  test('measures a straight cubic exactly and a curve longer than its chord', () => {
    expect(pathLength('M 0 0 C 30 0, 60 0, 90 0')).toBe(90);
    expect(pathLength('M 0 0 C 0 100, 100 100, 100 0')).toBeGreaterThan(100);
  });
});

describe('quietColor', () => {
  test('mixes a colour into the stage background, fully opaque', () => {
    expect(quietColor('#ffffff', 1)).toBe('rgb(255 255 255)');
    expect(quietColor('#ffffff', 0)).toBe('rgb(8 11 13)');
    expect(quietColor('#5EEAC4')).toBe('rgb(25 56 50)');
  });
});

describe('NET_LINKS', () => {
  test('has one direction per NET_ENDS entry', () => {
    expect(NET_LINKS).toHaveLength(NET_ENDS.length);
  });

  test('a reply rides its request wire backwards', () => {
    NET_ENDS.forEach(([from, to], index) => {
      const reply = NET_ENDS.findIndex(([a, b]) => a === to && b === from);

      if (reply >= 0) {
        expect(NET_LINKS[reply].wire).toBe(NET_LINKS[index].wire);
        expect(NET_LINKS[reply].from).toEqual(NET_LINKS[index].to);
      }
    });
  });

  test('every wire is used, and only two-way wires carry two directions', () => {
    NET_WIRES.forEach((wire, index) => {
      const uses = NET_LINKS.filter((item) => item.wire === index).length;

      expect(uses).toBe(wire.twoWay ? 2 : 1);
    });
  });
});
