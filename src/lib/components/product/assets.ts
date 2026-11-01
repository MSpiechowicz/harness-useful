// Static imports for product pages: brand marks (asset URLs).
import type { ProductId } from '$lib/config/site';
import dashboardMark from '$lib/assets/brand/dashboard/mark.svg';
import desktopMark from '$lib/assets/brand/desktop/mark.svg';
import codeMark from '$lib/assets/brand/code/mark.svg';
import knowledgeMark from '$lib/assets/brand/knowledge/mark.svg';
import memoryMark from '$lib/assets/brand/memory/mark.svg';
import skillsMark from '$lib/assets/brand/skills/mark.svg';

export const MARKS: Record<ProductId, string> = {
  desktop: desktopMark,
  skills: skillsMark,
  memory: memoryMark,
  knowledge: knowledgeMark,
  code: codeMark,
  dashboard: dashboardMark,
};
