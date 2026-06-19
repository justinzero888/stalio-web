import type { ColorGroup, Difficulty, TrackingType } from "@/types/tracking";

/**
 * Canonical habit record. Source of truth is the consolidated CSV
 * (docs/stalio_habits_consolidated_v1.csv), compiled to JSON at build time.
 * No database in Part 1 — see docs/plan/01_REVISED_TECH_STACK.md (ADR-8).
 */
export interface Habit {
  habitId: string;
  nameEn: string;
  nameCn: string | null;
  categoryGroupEn: string;
  categoryGroupCn: string | null;
  categoryNameEn: string;
  categoryNameCn: string | null;
  subcategory: string | null;
  colorGroup: ColorGroup;
  whatToDoEn: string | null;
  whatToDoCn: string | null;
  whyItWorksEn: string | null;
  whyItWorksCn: string | null;
  twoMinEn: string | null;
  twoMinCn: string | null;
  anatomyCueEn: string | null;
  anatomyBehaviourEn: string | null;
  anatomyRewardEn: string | null;
  researchBackingEn: string | null;
  researchSourceUrl: string | null;
  trackingType: TrackingType;
  trackingUnit: string | null;
  trackingDefaultTarget: number | null;
  trackingMin: number | null;
  trackingMax: number | null;
  trackingIncrement: number | null;
  customTargetAllowed: boolean;
  timeOfDay: string | null;
  estimatedDurationMin: number | null;
  difficulty: Difficulty;
  isDefaultBundle: boolean;
  notesForProduct: string | null;
  sortOrder: number;
}
