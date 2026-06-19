# Habit Content — Consolidated File & PM Fill-In Guide

**File:** `docs/stalio_habits_consolidated_v1.csv`
**Rows:** 54 production habits (`H001`–`H054`)
**Built from:** `stalio_habits_library_v2.csv` (tracking config) + `deepseek_stalio_habits.csv` (descriptions), merged on `habit_id`. Where the two disagreed on shared fields, the v2 tracking file won.

This single file is now the source of truth for the website habit library. It already contains everything the two CSVs had, **plus empty columns for content that existed in neither file** and must be supplied by the PM.

---

## What's already complete (no action)

Populated from the source CSVs for all 54 habits:
`habit_name_en/cn`, `category_group_en/cn`, `category_name_en/cn`, `subcategory`, `color_group` (auto-derived), `is_default_bundle`, `difficulty`, `time_of_day`, `estimated_duration_min`, all `tracking_*` fields, `custom_target_allowed`, `two_min_version_en/cn`, `description_what_to_do_en/cn`, `why_it_works_en/cn`, `notes_for_product`.

---

## What the PM must fill in (missing from both CSVs)

Every row currently shows `[TODO-PM]` in these columns. The `data_status` column lists exactly which fields are missing per row (filter on it in Excel/Sheets).

| Column | Required? | What to write | Example (H001 Drink water) |
|--------|-----------|---------------|-----------------------------|
| `anatomy_cue_en` | **Required** | The trigger that starts the habit (Atomic Habits "Cue") | "Finish a meal / sit down at desk" |
| `anatomy_behaviour_en` | **Required** | The action itself (the "Behaviour/Routine") | "Drink a full glass of water" |
| `anatomy_reward_en` | **Required** | The payoff felt right after (the "Reward") | "Feel refreshed and clear-headed" |
| `research_backing_en` | **Required** | 1–2 sentences of evidence/why it's credible | "Mild dehydration of ~1–2% body water impairs concentration and mood (Ganio et al., 2011)." |
| `research_source_url` | Optional | A citation link if available | study / article URL |

**Counts:** all **54 rows** need `anatomy_cue_en`, `anatomy_behaviour_en`, `anatomy_reward_en`, and `research_backing_en`. `research_source_url` is optional.

### Fill-in rules
- Keep `habit_id` untouched — it links to the app's "Add habit" identifiers.
- English only for now (Phase 1 is EN-only; Chinese for these new fields is **not** needed yet).
- Anatomy entries should be short (a phrase, not a paragraph) — they render in a compact `Cue → Behaviour → Reward` bar.
- `research_backing_en` is 1–2 sentences max — it renders as a small "why it works" support note.
- Replace the literal `[TODO-PM]` text with the real content. Leaving it as-is keeps the row flagged `MISSING` in `data_status`.

---

## How completion is tracked

The `data_status` column auto-summarises each row:
- `COMPLETE` — all required content present.
- `MISSING: anatomy_cue_en; research_backing_en; …` — lists the fields still empty.

When the PM returns the file, engineering re-runs the validator; a row only counts as launch-ready when `data_status = COMPLETE`.

---

## Two content decisions that affect copy (need owner/PM sign-off)

These are not per-row fill-ins but global decisions (see `CONTENT_RECONCILIATION.md`):

1. **Habit count = 54.** The mockup says "48"; the production CSVs have 54. Confirm the website shows 54 (or specify a curated subset).
2. **Default bundle.** The PRD says "6 pre-loaded"; the CSV marks **9** habits `is_default_bundle=TRUE` (H001, H003, H004, H009, H010, H023, H033, H038, H051). Confirm the real day-one bundle — trim the flags or update the "pre-loaded" number.

> Optional simplification: if authoring `research_backing_en` for 54 habits is too heavy before next week's launch, we can launch Part 1 with the existing `why_it_works_en` text in place of a separate research section and add formal research notes in a later content pass. Let us know your preference.
