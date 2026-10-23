import { describe, expect, test } from 'bun:test';
import { DESKTOP_COMMENT, SKILLS_FRAMES, desktopFrame, memoryFrame, netFrame, skillsFrame, skillsStage, typed } from './anims';

// Expectations come from the approved board (TerminalStory.dc.html, anims(t) and net(step)).

describe('typed', () => {
  test('reveals a rounded share of the text and clamps', () => {
    expect(typed('abcd', 0.5)).toBe('ab');
    expect(typed('abcd', -1)).toBe('');
    expect(typed('abcd', 2)).toBe('abcd');
  });
});

describe('desktopFrame', () => {
  test('selects line 7 from frame 2 to 6', () => {
    expect(desktopFrame(1).selLine).toBe('transparent');
    expect(desktopFrame(2).selLine).toBe('#3B82F6');
    expect(desktopFrame(6).selLine).toBe('#3B82F6');
    expect(desktopFrame(7).selLine).toBe('transparent');
  });

  test('composes in frames 3-6, types the comment, then saves it', () => {
    expect(desktopFrame(2).isComposing).toBe(false);
    expect(desktopFrame(3).isComposing).toBe(true);
    expect(desktopFrame(3).comment.length).toBeGreaterThan(0);
    expect(desktopFrame(3).comment.length).toBeLessThan(DESKTOP_COMMENT.length);
    expect(desktopFrame(5).comment).toBe(DESKTOP_COMMENT);
    expect(desktopFrame(6).isComposing).toBe(true);
    expect(desktopFrame(7).isComposing).toBe(false);
    expect(desktopFrame(7).isSaved).toBe(true);
    expect(desktopFrame(6).isSaved).toBe(false);
  });

  test('shows the review prompt modal in frames 10-12 only', () => {
    const modal = Array.from({ length: 16 }, (_, f) => desktopFrame(f).isModal);

    expect(modal.map((on, f) => (on ? f : -1)).filter((f) => f >= 0)).toEqual([10, 11, 12]);
  });

  test('toast appears at 13 and the cost moves from $7.88 to $7.91 at 14', () => {
    expect(desktopFrame(12).toastVisible).toBe(false);
    expect(desktopFrame(13).toastVisible).toBe(true);
    expect(desktopFrame(13).cost).toBe('$7.88');
    expect(desktopFrame(14).cost).toBe('$7.91');
  });

  test('loops every 16 ticks', () => {
    expect(desktopFrame(16 + 7)).toEqual(desktopFrame(7));
  });
});

describe('skillsFrame', () => {
  test('active stage index per frame matches the board', () => {
    const stages = Array.from({ length: SKILLS_FRAMES }, (_, g) => skillsStage(g));

    expect(stages).toEqual([0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5]);
    expect(Array.from({ length: SKILLS_FRAMES }, (_, g) => skillsFrame(g).stage)).toEqual(stages);
  });

  test('only the active stage animates its line, with names alternating per stage', () => {
    const names = [0, 3, 6, 10, 13, 16].map((g) => {
      const frame = skillsFrame(g);
      const animated = frame.stages.filter((stage) => stage.barAnim !== null);

      expect(animated).toHaveLength(1);

      return animated[0].barAnim;
    });

    expect(names).toEqual(['hfFillA', 'hfFillB', 'hfFillA', 'hfFillB', 'hfFillA', 'hfFillB']);
  });

  test('finished stages are full and ticked, upcoming stages empty', () => {
    const { stages } = skillsFrame(10);

    expect(stages.map((stage) => stage.bar)).toEqual(['100%', '100%', '100%', '0', '0', '0']);
    expect(stages.map((stage) => stage.mark)).toEqual(['✓', '✓', '✓', '·', '·', '·']);
  });

  test('stage line lasts as long as the stage', () => {
    expect(skillsFrame(0).stages[0].barMs).toBe(3 * 650);
    expect(skillsFrame(6).stages[2].barMs).toBe(4 * 650);
    expect(skillsFrame(16).stages[5].barMs).toBe(2 * 650);
  });

  test('plan is approved from frame 5, review repairs at 11, security fails at 14', () => {
    expect(skillsFrame(4).approved).toBe(false);
    expect(skillsFrame(5).approved).toBe(true);
    expect(skillsFrame(10).reviewText).toBe('finding · limit resets on restart');
    expect(skillsFrame(11).reviewText).toBe('→ back to implement · repaired');
    expect(skillsFrame(12).reviewText).toBe('✓ passed after repair');
    expect(skillsFrame(14).securityText).toBe('finding · token printed in debug output');
  });

  test('workers reach 100% by frame 9', () => {
    expect(skillsFrame(6).workers.map((worker) => worker.width)).toEqual(['30%', '20%', '40%']);
    expect(skillsFrame(9).workers.map((worker) => worker.width)).toEqual(['100%', '100%', '100%']);
  });
});

describe('memoryFrame', () => {
  test('saves the proposed note at frame 12', () => {
    expect(memoryFrame(11).saveText).toBe('Save');
    expect(memoryFrame(11).saveActive).toBe(true);
    expect(memoryFrame(12).saveText).toBe('✓ Saved');
    expect(memoryFrame(12).newNote).toBe(true);
    expect(memoryFrame(13).next).toBe(true);
  });

  test('types the query, recalls notes at 3 and highlights the hit until 7', () => {
    expect(memoryFrame(0).query).toBe('');
    expect(memoryFrame(2).query.length).toBeGreaterThan(0);
    expect(memoryFrame(2).lines).toEqual([true, false, false, false, false]);
    expect(memoryFrame(3).lines[1]).toBe(true);
    expect(memoryFrame(3).hit).toBe(true);
    expect(memoryFrame(7).hit).toBe(true);
    expect(memoryFrame(8).hit).toBe(false);
  });

  test('the proposal card shows from frame 9', () => {
    expect(memoryFrame(8).card).toBe(false);
    expect(memoryFrame(9).card).toBe(true);
  });
});

describe('netFrame', () => {
  test('hop 1 runs link 0 from you to Desktop', () => {
    const frame = netFrame(0);

    expect(frame.link).toBe(0);
    expect(frame.num).toBe('01');
    expect(frame.total).toBe('09');
    expect(frame.progress).toBe('11.1%');
    expect(frame.caption).toMatchObject({ title: 'you → Harness Desktop', color: '#F2F7F5', anim: 'nfCapA' });
    expect(frame.nodes.desktop.ring).toBe(true);
    expect(frame.nodes.you.ring).toBe(false);
    expect(frame.nodes.desktop.glow).toBe('0 0 0 1px #7DD3FC55, 0 0 40px #7DD3FC40');
    expect(frame.nodes.you.glow).toBe('0 0 24px #F2F7F530');
    expect(frame.nodes.cli.glow).toBe('0 10px 30px rgba(0,0,0,.4)');
  });

  test('caption animation alternates and the last hop fills the progress bar', () => {
    expect(netFrame(1).caption.anim).toBe('nfCapB');
    expect(netFrame(8).progress).toBe('100.0%');
    expect(netFrame(8).link).toBe(7);
  });

  test('wraps around the nine hops', () => {
    expect(netFrame(9)).toEqual(netFrame(0));
  });
});
