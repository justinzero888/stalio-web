import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const difficultyEnum = pgEnum("difficulty", [
  "easy",
  "moderate",
  "hard",
]);

export const trackingTypeEnum = pgEnum("tracking_type", [
  "boolean",
  "boolean_optional_text",
  "number",
  "volume",
  "duration",
  "duration_optional_text",
  "time",
  "scale",
  "scale_optional_text",
  "streak",
  "text_required",
  "multi_text_required",
]);

export const colorGroupEnum = pgEnum("color_group", [
  "health",
  "mental",
  "productivity",
  "financial",
  "social",
  "home",
]);

export const habits = pgTable("habits", {
  // identity — matches the app's "Add habit" contract (H001..H054)
  habitId: text("habit_id").primaryKey(),

  // names (bilingual; EN surfaced in Phase 1 — ADR-7)
  nameEn: text("name_en").notNull(),
  nameCn: text("name_cn"),

  // taxonomy
  categoryGroupEn: text("category_group_en").notNull(),
  categoryGroupCn: text("category_group_cn"),
  categoryNameEn: text("category_name_en").notNull(),
  categoryNameCn: text("category_name_cn"),
  subcategory: text("subcategory"),
  colorGroup: colorGroupEnum("color_group").notNull(),

  // descriptive content
  whatToDoEn: text("what_to_do_en"),
  whatToDoCn: text("what_to_do_cn"),
  whyItWorksEn: text("why_it_works_en"),
  whyItWorksCn: text("why_it_works_cn"),

  // 2-minute version (Atomic Habits)
  twoMinEn: text("two_min_en"),
  twoMinCn: text("two_min_cn"),

  // habit anatomy (Cue -> Behaviour -> Reward) — PM-filled
  anatomyCueEn: text("anatomy_cue_en"),
  anatomyBehaviourEn: text("anatomy_behaviour_en"),
  anatomyRewardEn: text("anatomy_reward_en"),

  // research backing — PM-filled
  researchBackingEn: text("research_backing_en"),
  researchSourceUrl: text("research_source_url"),

  // tracking config
  trackingType: trackingTypeEnum("tracking_type").notNull(),
  trackingUnit: text("tracking_unit"),
  trackingDefaultTarget: integer("tracking_default_target"),
  trackingMin: integer("tracking_min"),
  trackingMax: integer("tracking_max"),
  trackingIncrement: integer("tracking_increment"),
  customTargetAllowed: boolean("custom_target_allowed").default(false).notNull(),

  // attributes
  timeOfDay: text("time_of_day"),
  estimatedDurationMin: integer("estimated_duration_min"),
  difficulty: difficultyEnum("difficulty").notNull(),
  isDefaultBundle: boolean("is_default_bundle").default(false).notNull(),

  // ops
  notesForProduct: text("notes_for_product"),
  isPublished: boolean("is_published").default(true).notNull(),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
