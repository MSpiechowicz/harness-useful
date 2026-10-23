// Static imports for product pages: brand marks (asset URLs) and enhanced screenshots (responsive picture sources).
import type { Picture } from '@sveltejs/enhanced-img';
import type { ProductId } from '$lib/config/site';
import dashboardMark from '$lib/assets/brand/dashboard/mark.svg';
import desktopMark from '$lib/assets/brand/desktop/mark.svg';
import memoryMark from '$lib/assets/brand/memory/mark.svg';
import skillsMark from '$lib/assets/brand/skills/mark.svg';
import dbFlow from '$lib/assets/img/db-flow.webp?enhanced';
import dbPromptDetail from '$lib/assets/img/db-prompt-detail.webp?enhanced';
import dChanges from '$lib/assets/img/d-changes.webp?enhanced';
import dSessions from '$lib/assets/img/d-sessions.webp?enhanced';
import mMemorySave from '$lib/assets/img/m-memory-save.webp?enhanced';
import mNotes from '$lib/assets/img/m-notes.webp?enhanced';
import sPlan from '$lib/assets/img/s-plan.webp?enhanced';
import sReview from '$lib/assets/img/s-review.webp?enhanced';

export interface ProductShot {
  src: Picture;
  alt: string;
  caption: string;
}

export const MARKS: Record<ProductId, string> = {
  desktop: desktopMark,
  skills: skillsMark,
  memory: memoryMark,
  dashboard: dashboardMark,
};

export const SHOTS: Record<ProductId, ProductShot[]> = {
  desktop: [
    {
      src: dChanges,
      alt: 'Harness Desktop Changes view: a unified diff of the working tree with review comments on individual lines',
      caption: 'Changes · comment on any line',
    },
    {
      src: dSessions,
      alt: 'Harness Desktop Sessions view: a saved session with its branch tree and transcript, ready to resume or fork',
      caption: 'Sessions · branch tree, resume or fork',
    },
  ],
  skills: [
    {
      src: sPlan,
      alt: 'Harness Skills tour: the us-plan stage shows a plan with concrete acceptance and an Approve button',
      caption: 'Plan · approved by you',
    },
    {
      src: sReview,
      alt: 'Harness Skills tour: a fresh review reports a correctness finding that goes back to the build stage for repair',
      caption: 'Review · back to Build for repair',
    },
  ],
  memory: [
    {
      src: mNotes,
      alt: 'Harness Memory Notes view in Harness Desktop: a list of typed, linked project notes with one note open',
      caption: 'Notes · typed, linked, recalled',
    },
    {
      src: mMemorySave,
      alt: 'Harness Desktop chat with proposed Harness Memory notes, each with Skip, Edit and Save buttons',
      caption: 'Chat · save, edit or skip',
    },
  ],
  dashboard: [
    {
      src: dbFlow,
      alt: 'Harness Dashboard flow chart: spend flowing from AI coding tools to models to projects',
      caption: 'Flow · tool, model and project in one chart',
    },
    {
      src: dbPromptDetail,
      alt: 'Harness Dashboard prompt detail: the cost of every call in one prompt, subagent calls included',
      caption: 'Prompt detail · call by call, subagents included',
    },
  ],
};
