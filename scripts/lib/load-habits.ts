import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { deriveColorGroup } from "@/lib/habits/color-group";
import {
  isTrackingType,
  DIFFICULTIES,
  type Difficulty,
  type TrackingType,
  type ColorGroup,
} from "@/types/tracking";
import type { Habit } from "@/types/habit";

export const CSV_PATH = path.join(
  process.cwd(),
  "docs",
  "stalio_habits_consolidated_v1_F.csv",
);

const TODO = "[TODO-PM]";

function text(v: string | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  if (t === "" || t.toLowerCase() === "null" || t === TODO) return null;
  return t;
}

function int(v: string | undefined): number | null {
  const t = text(v);
  if (t == null) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function bool(v: string | undefined): boolean {
  return (v ?? "").trim().toUpperCase() === "TRUE";
}

export interface LoadResult {
  habits: Habit[];
  errors: string[];
  warnings: string[];
}

export function loadHabits(): LoadResult {
  const raw = readFileSync(CSV_PATH, "utf-8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: false,
  }) as Record<string, string>[];

  const errors: string[] = [];
  const warnings: string[] = [];
  const habits: Habit[] = [];
  const seen = new Set<string>();

  rows.forEach((r, i) => {
    const id = (r.habit_id ?? "").trim();
    const where = id || `row ${i + 2}`;
    if (!id) {
      errors.push(`${where}: missing habit_id`);
      return;
    }
    if (seen.has(id)) errors.push(`${where}: duplicate habit_id`);
    seen.add(id);

    const trackingType = (r.tracking_ui_type ?? "").trim();
    if (!isTrackingType(trackingType)) {
      errors.push(`${where}: invalid tracking_ui_type "${trackingType}"`);
    }
    const difficulty = (r.difficulty ?? "").trim() as Difficulty;
    if (!(DIFFICULTIES as readonly string[]).includes(difficulty)) {
      errors.push(`${where}: invalid difficulty "${difficulty}"`);
    }

    let colorGroup: ColorGroup;
    try {
      colorGroup = deriveColorGroup(
        (r.category_group_en ?? "").trim(),
        text(r.category_group_cn),
      );
      const csvColor = text(r.color_group);
      if (csvColor && csvColor !== colorGroup) {
        warnings.push(
          `${where}: csv color_group "${csvColor}" != derived "${colorGroup}"`,
        );
      }
    } catch (e) {
      errors.push(`${where}: ${(e as Error).message}`);
      colorGroup = "health";
    }

    if (!text(r.habit_name_en)) errors.push(`${where}: missing habit_name_en`);

    // content gaps = warnings (PM still filling), not hard failures
    for (const f of [
      "anatomy_cue_en",
      "anatomy_behaviour_en",
      "anatomy_reward_en",
      "research_backing_en",
    ]) {
      if (!text(r[f])) warnings.push(`${where}: TODO-PM ${f}`);
    }

    habits.push({
      habitId: id,
      nameEn: text(r.habit_name_en) ?? id,
      nameCn: text(r.habit_name_cn),
      categoryGroupEn: (r.category_group_en ?? "").trim(),
      categoryGroupCn: text(r.category_group_cn),
      categoryNameEn: (r.category_name_en ?? "").trim(),
      categoryNameCn: text(r.category_name_cn),
      subcategory: text(r.subcategory),
      colorGroup,
      whatToDoEn: text(r.description_what_to_do_en),
      whatToDoCn: text(r.description_what_to_do_cn),
      whyItWorksEn: text(r.why_it_works_en),
      whyItWorksCn: text(r.why_it_works_cn),
      twoMinEn: text(r.two_min_version_en),
      twoMinCn: text(r.two_min_version_cn),
      anatomyCueEn: text(r.anatomy_cue_en),
      anatomyBehaviourEn: text(r.anatomy_behaviour_en),
      anatomyRewardEn: text(r.anatomy_reward_en),
      researchBackingEn: text(r.research_backing_en),
      researchSourceUrl: text(r.research_source_url),
      trackingType: (isTrackingType(trackingType)
        ? trackingType
        : "boolean") as TrackingType,
      trackingUnit: text(r.tracking_unit),
      trackingDefaultTarget: int(r.tracking_default_target),
      trackingMin: int(r.tracking_min),
      trackingMax: int(r.tracking_max),
      trackingIncrement: int(r.tracking_increment),
      customTargetAllowed: bool(r.custom_target_allowed),
      timeOfDay: text(r.time_of_day),
      estimatedDurationMin: int(r.estimated_duration_min),
      difficulty: ((DIFFICULTIES as readonly string[]).includes(difficulty)
        ? difficulty
        : "easy") as Difficulty,
      isDefaultBundle: bool(r.is_default_bundle),
      notesForProduct: text(r.notes_for_product),
      sortOrder: i,
    });
  });

  return { habits, errors, warnings };
}
