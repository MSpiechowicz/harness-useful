// Product data lives in one file per product (README facts with source comments); this file collects them.
import type { ProductId } from '$lib/config/site';
import { DASHBOARD } from './product-dashboard';
import { CODE } from './product-code';
import { DESKTOP } from './product-desktop';
import { KNOWLEDGE } from './product-knowledge';
import { MEMORY } from './product-memory';
import { SKILLS } from './product-skills';
import type { Product } from './types';

export const PRODUCTS: Record<ProductId, Product> = {
  desktop: DESKTOP,
  skills: SKILLS,
  memory: MEMORY,
  knowledge: KNOWLEDGE,
  code: CODE,
  dashboard: DASHBOARD,
};
