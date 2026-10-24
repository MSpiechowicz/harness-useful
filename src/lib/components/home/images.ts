// Responsive pictures of the homepage (build-time processed by @sveltejs/enhanced-img).
import type { Picture } from '@sveltejs/enhanced-img';
import dbCalendar from '$lib/assets/img/db-calendar.webp?enhanced';
import dbCompactions from '$lib/assets/img/db-compactions.webp?enhanced';
import dbFlow from '$lib/assets/img/db-flow.webp?enhanced';
import dbLive from '$lib/assets/img/db-live.webp?enhanced';
import dbProjectTiles from '$lib/assets/img/db-project-tiles.webp?enhanced';
import dbPromptDetail from '$lib/assets/img/db-prompt-detail.webp?enhanced';
import dbSessionMap from '$lib/assets/img/db-session-map.webp?enhanced';
// Screenshot of small UI text: any browser resampling or the default AVIF quality smears it. Build it at exactly the
// width the hero draws it (Hero.svelte: 646px, 2x for retina) and at a higher quality, so it is shown 1:1.
import hero from '$lib/assets/img/d-hero-chat-2026.webp?enhanced&w=1292;646&quality=90';

export const HERO_IMAGE: Picture = hero;

/** Dashboard tab screenshots, keyed by the file names used in content/home.ts (DTABS). */
export const DASHBOARD_IMAGES: Record<string, Picture> = {
  'db-flow.webp': dbFlow,
  'db-session-map.webp': dbSessionMap,
  'db-project-tiles.webp': dbProjectTiles,
  'db-calendar.webp': dbCalendar,
  'db-prompt-detail.webp': dbPromptDetail,
  'db-live.webp': dbLive,
  'db-compactions.webp': dbCompactions,
};
