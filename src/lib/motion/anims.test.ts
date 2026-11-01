import { describe, expect, test } from 'bun:test';
import {
  DESKTOP_COMMENT,
  SKILLS_FRAMES,
  codeFrame,
  desktopFrame,
  knowledgeFrame,
  memoryFrame,
  netFrame,
  skillsFrame,
  skillsStage,
  typed,
} from './anims';

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

    expect(stages).toEqual([0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6]);
    expect(Array.from({ length: SKILLS_FRAMES }, (_, g) => skillsFrame(g).stage)).toEqual(stages);
  });

  test('only the active stage animates its line, with names alternating per stage', () => {
    const names = [0, 3, 6, 10, 13, 16, 18].map((g) => {
      const frame = skillsFrame(g);
      const animated = frame.stages.filter((stage) => stage.barAnim !== null);

      expect(animated).toHaveLength(1);

      return animated[0].barAnim;
    });

    expect(names).toEqual(['hfFillA', 'hfFillB', 'hfFillA', 'hfFillB', 'hfFillA', 'hfFillB', 'hfFillA']);
  });

  test('finished stages are full and ticked, upcoming stages empty', () => {
    const { stages } = skillsFrame(10);

    expect(stages.map((stage) => stage.bar)).toEqual(['100%', '100%', '100%', '0', '0', '0', '0']);
    expect(stages.map((stage) => stage.mark)).toEqual(['✓', '✓', '✓', '·', '·', '·', '·']);
  });

  test('stage line lasts as long as the stage', () => {
    expect(skillsFrame(0).stages[0].barMs).toBe(3 * 650);
    expect(skillsFrame(6).stages[2].barMs).toBe(4 * 650);
    expect(skillsFrame(16).stages[5].barMs).toBe(2 * 650);
    expect(skillsFrame(18).stages[6].barMs).toBe(2 * 650);
  });

  test('plan is approved from frame 5, review repairs at 11, security fails at 14', () => {
    expect(skillsFrame(4).approved).toBe(false);
    expect(skillsFrame(5).approved).toBe(true);
    expect(skillsFrame(10).reviewText).toBe('finding · limit resets on restart');
    expect(skillsFrame(11).reviewText).toBe('→ back to build · repaired');
    expect(skillsFrame(12).reviewText).toBe('✓ passed after repair');
    expect(skillsFrame(14).securityText).toBe('finding · token printed in debug output');
    expect(skillsFrame(16).assessment).toBeNull();
    expect(skillsFrame(17).assessment).toBe('Tier: T3 Moderate · Confidence: High');
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

describe('knowledgeFrame', () => {
  test('types the query, then reveals the three pointers one by one from frame 3', () => {
    expect(knowledgeFrame(0).query).toBe('');
    expect(knowledgeFrame(2).query).toBe('how are refunds retried');
    expect(knowledgeFrame(2).results).toEqual([false, false, false]);
    expect(knowledgeFrame(3).results).toEqual([true, false, false]);
    expect(knowledgeFrame(4).results).toEqual([true, true, false]);
    expect(knowledgeFrame(5).results).toEqual([true, true, true]);
  });

  test('highlights the top hit from 3 until the passage is read at 8', () => {
    expect(knowledgeFrame(2).hit).toBe(false);
    expect(knowledgeFrame(3).hit).toBe(true);
    expect(knowledgeFrame(8).hit).toBe(true);
    expect(knowledgeFrame(9).hit).toBe(false);
  });

  test('reads the passage, then proposes a doc that waits for review', () => {
    expect(knowledgeFrame(5).lines[2]).toBe(false);
    expect(knowledgeFrame(6).lines[2]).toBe(true);
    expect(knowledgeFrame(8).lines).toEqual([true, true, true, true, true, false]);
    expect(knowledgeFrame(9).lines[5]).toBe(true);
    expect(knowledgeFrame(9).card).toBe(false);
    expect(knowledgeFrame(10).card).toBe(true);
    expect(knowledgeFrame(10).newDoc).toBe(false);
  });

  test('approving at frame 13 makes the new doc searchable', () => {
    expect(knowledgeFrame(12).approveText).toBe('Approve');
    expect(knowledgeFrame(12).approveActive).toBe(true);
    expect(knowledgeFrame(13).approveText).toBe('✓ Approved · searchable');
    expect(knowledgeFrame(13).newDoc).toBe(true);
    expect(knowledgeFrame(14).next).toBe(true);
  });

  test('wraps around the sixteen frames', () => {
    expect(knowledgeFrame(16)).toEqual(knowledgeFrame(0));
    expect(knowledgeFrame(-1)).toEqual(knowledgeFrame(15));
  });
});

describe('codeFrame', () => {
  test('strikes out the grep once the indexed hint shows at frame 2', () => {
    expect(codeFrame(1).lines).toEqual([true, false, false, false]);
    expect(codeFrame(1).struck).toBe(false);
    expect(codeFrame(2).lines[1]).toBe(true);
    expect(codeFrame(2).struck).toBe(true);
  });

  test('types the code_path query over frames 3 and 4', () => {
    expect(codeFrame(2).query).toBe('');
    expect(codeFrame(3).query.length).toBeGreaterThan(0);
    expect(codeFrame(3).query.length).toBeLessThan('handle empty config'.length);
    expect(codeFrame(4).query).toBe('handle empty config');
  });

  test('reveals the four hops one by one from frame 5', () => {
    expect(codeFrame(4).hops).toEqual([false, false, false, false]);
    expect(codeFrame(5).hops).toEqual([true, false, false, false]);
    expect(codeFrame(7).hops).toEqual([true, true, true, false]);
    expect(codeFrame(8).hops).toEqual([true, true, true, true]);
  });

  test('summarises the impact in a card whose rows follow at 12 and 13', () => {
    expect(codeFrame(10).lines[3]).toBe(true);
    expect(codeFrame(10).card).toBe(false);
    expect(codeFrame(11).card).toBe(true);
    expect(codeFrame(11).impact).toEqual([false, false]);
    expect(codeFrame(12).impact).toEqual([true, false]);
    expect(codeFrame(13).impact).toEqual([true, true]);
    expect(codeFrame(14).next).toBe(true);
  });

  test('wraps around the sixteen frames', () => {
    expect(codeFrame(16)).toEqual(codeFrame(0));
    expect(codeFrame(-1)).toEqual(codeFrame(15));
  });
});

describe('netFrame', () => {
  test('hop 1 runs link 0 from you to Desktop', () => {
    const frame = netFrame(0);

    expect(frame.link).toBe(0);
    expect(frame.num).toBe('01');
    expect(frame.total).toBe('14');
    expect(frame.caption).toMatchObject({ title: 'you → Harness Desktop', color: '#F2F7F5', anim: 'nfCapA' });
    expect(frame.nodes.desktop.role).toBe('to');
    expect(frame.nodes.you.role).toBe('from');
    expect(frame.nodes.cli.role).toBeNull();
  });

  test('caption animation alternates and the last hop runs link 7', () => {
    expect(netFrame(1).caption.anim).toBe('nfCapB');
    expect(netFrame(13).link).toBe(7);
  });

  test('Knowledge answers after Memory, and Code after Skills plan', () => {
    expect(netFrame(4).nodes.knowledge.role).toBe('to');
    expect(netFrame(5).nodes.knowledge.role).toBe('from');
    expect(netFrame(7).nodes.code.role).toBe('to');
    expect(netFrame(8).nodes.code.role).toBe('from');
  });

  test('the plan travels back through Desktop before you approve it', () => {
    expect(netFrame(9).nodes.cli.role).toBe('from');
    expect(netFrame(9).nodes.desktop.role).toBe('to');
    expect(netFrame(10).nodes.desktop.role).toBe('from');
    expect(netFrame(10).nodes.you.role).toBe('to');
  });

  test('wraps around the fourteen hops', () => {
    expect(netFrame(14)).toEqual(netFrame(0));
  });
});
