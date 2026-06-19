import type { Habit } from "@/types/habit";
import type { ColorGroup, Difficulty } from "@/types/tracking";
import { trackingBucket, type TrackingBucket } from "@/lib/habits/tracking";
import { COLOR_GROUP_ORDER } from "@/lib/habits/category";

export type SortKey = "default" | "az" | "za" | "easy" | "hard" | "bundle";

export interface Filters {
  search: string;
  colorGroup: ColorGroup | "all";
  bucket: TrackingBucket | "all";
  difficulty: Difficulty | "all";
  bundleOnly: boolean;
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  colorGroup: "all",
  bucket: "all",
  difficulty: "all",
  bundleOnly: false,
  sort: "default",
};

const DIFF_ORDER: Record<Difficulty, number> = { easy: 0, moderate: 1, hard: 2 };

function matchesSearch(h: Habit, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [
    h.nameEn,
    h.categoryNameEn,
    h.categoryGroupEn,
    h.whatToDoEn,
    h.whyItWorksEn,
  ]
    .filter(Boolean)
    .some((s) => (s as string).toLowerCase().includes(needle));
}

/** Apply every filter except colorGroup (used for live category counts). */
function passesExceptCategory(h: Habit, f: Filters): boolean {
  if (f.bundleOnly && !h.isDefaultBundle) return false;
  if (f.bucket !== "all" && trackingBucket(h.trackingType) !== f.bucket)
    return false;
  if (f.difficulty !== "all" && h.difficulty !== f.difficulty) return false;
  if (!matchesSearch(h, f.search)) return false;
  return true;
}

export function filterHabits(habits: Habit[], f: Filters): Habit[] {
  const list = habits.filter(
    (h) =>
      passesExceptCategory(h, f) &&
      (f.colorGroup === "all" || h.colorGroup === f.colorGroup),
  );

  switch (f.sort) {
    case "az":
      return [...list].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    case "za":
      return [...list].sort((a, b) => b.nameEn.localeCompare(a.nameEn));
    case "easy":
      return [...list].sort(
        (a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty],
      );
    case "hard":
      return [...list].sort(
        (a, b) => DIFF_ORDER[b.difficulty] - DIFF_ORDER[a.difficulty],
      );
    case "bundle":
      return [...list].sort(
        (a, b) => Number(b.isDefaultBundle) - Number(a.isDefaultBundle),
      );
    default:
      return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export interface CategoryCounts {
  all: number;
  byGroup: Record<ColorGroup, number>;
}

export function categoryCounts(habits: Habit[], f: Filters): CategoryCounts {
  const base = habits.filter((h) => passesExceptCategory(h, f));
  const byGroup = Object.fromEntries(
    COLOR_GROUP_ORDER.map((g) => [g, 0]),
  ) as Record<ColorGroup, number>;
  for (const h of base) byGroup[h.colorGroup] += 1;
  return { all: base.length, byGroup };
}
