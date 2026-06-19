# Part 1 — Content Reconciliation (Open Items)

Discrepancies between the PRD/mockups and the production CSVs that need a **business-owner decision** before public launch. None block engineering from starting; all affect launch copy or content completeness. Cross-referenced in `02_ACCOUNTS_AND_CONFIG.md` (items A2, A3, D4).

---

## R1 — Habit count: 48 (mockup) vs 54 (CSV) → **use 54**

- PRD §6.1 and `stalio_website.html` hero say **"48 habits."**
- Both CSVs contain **54 habits** (`H001`–`H054`), described as "mapped to the actual production habits in the Stalio app."
- **Recommendation:** 54 is production truth. Update hero stats row, any "48" copy, and the library count. The number should be derived from the DB at build time, not hardcoded, so it stays correct.
- **Owner action (A2):** confirm 54 is the launch number, or specify a curated subset if the web library is intentionally smaller than the app.

---

## R2 — Default bundle: "6 pre-loaded" (PRD) vs 9 flagged (CSV)

- PRD/mockup: **"6 pre-loaded universal habits."**
- `stalio_habits_library_v2.csv` marks **9** habits `is_default_bundle = TRUE`:

  | ID | Habit | ID | Habit | ID | Habit |
  |----|-------|----|-------|----|-------|
  | H001 | Drink water | H010 | Eat vegetables | H038 | No-spend day |
  | H003 | Step outside | H023 | Write a note | H051 | Make the bed |
  | H004 | Floss | H033 | No phone in bed | H009 | Eat one good meal |

- **Impact:** homepage stat "N pre-loaded" + the library "show only the pre-loaded habits" toggle.
- **Recommendation:** make the website **derive the number from `is_default_bundle`** so web and app never disagree. Then decide whether the true bundle is 6 or 9.
- **Owner action (A3):** confirm the real default-bundle set/count, or trim the CSV flags to match the app's actual day-one bundle.

---

## R3 — Category filter taxonomy: "7 options" (PRD) vs CSV groupings

- PRD §6.2: "Category filter with live counts **(7 options)**."
- CSV has **5** `category_group_en`, **11** `category_name_en`, and the design implies **6** visual color groups (Body/Mind split).
- None equals 7.
- **Recommendation:** filter by the **6 color groups + "All" = 7 options** — this reconciles the PRD's "7" with the design's color system and the CSV's `category_group_cn` Body/Mind split.
- **Owner action:** approve the 6-group taxonomy (and the Body vs Mind split) as the canonical library filter, or supply the intended 7 categories.

---

## R4 — Habit anatomy (Cue → Behaviour → Reward) has no source data

- PRD §6.2 expanded card requires an **anatomy bar: Cue → Behaviour → Reward** (Atomic Habits).
- Neither CSV contains cue/behaviour/reward fields.
- **Options:** (a) author 54×3 short strings; (b) derive a reasonable default at render time from `what_to_do` + `two_min_version`; (c) add `cue/behaviour/reward` columns and backfill.
- **Recommendation:** add the three optional columns now (cheap), launch with (b)-style sensible defaults, and let Part 2 admin edit them.
- **Owner action (D4-adjacent):** decide author-now vs derive-now-edit-later.

---

## R5 — "Research backing" section has no source data

- PRD §6.2 expanded card lists a **"research backing"** section.
- CSVs provide `why_do_it_benefits_*` (benefits prose) but **no citations/research field**.
- **Options:** (a) repurpose `why_it_works` as the research-informed rationale and **drop the separate "research backing" section** for Part 1; (b) author per-habit research notes.
- **Recommendation (a)** for Part 1 to avoid blocking launch; add curated research in a later content pass.
- **Owner action (D4):** approve dropping/merging the research section for Part 1.

---

## R6 — Bilingual content (EN/CN) present; Phase 1 is EN-only

- Both CSVs carry full Chinese (`*_cn`) content.
- PRD scopes i18n to v2.
- **Decision (ADR-7):** store both languages, render **English only** in Part 1/2. No action needed now; flagged so the Chinese content isn't mistaken for in-scope launch copy.

---

## R7 — Minor data hygiene (handled by the seed script, no owner action)

- `time_of_day` includes quoted values `"Any"`, `"Throughout day"` — normalize.
- Many tracking fields use the literal string `"null"` → coerce to SQL `NULL`.
- `is_default_bundle` is `"TRUE"/"FALSE"` strings → coerce to boolean.
- `category_group_cn` splits `身`/`心` within `Health & Body` — used to derive `colorGroup` (intended, not an error).
- The two CSVs must agree on shared fields; the seed validates and logs any divergence (v2 wins).

---

## Summary of owner decisions needed before public launch

| Ref | Decision | Blocks |
|-----|----------|--------|
| R1 / A2 | Confirm 54 habits (or curated subset) | Launch copy |
| R2 / A3 | Confirm default-bundle set/count | Homepage stat + library toggle |
| R3 | Approve 6-group (+All) filter taxonomy | Library sidebar |
| R4 | Anatomy: author vs derive | Expanded card completeness |
| R5 / D4 | Research section: drop/merge vs author | Expanded card completeness |

R6 and R7 need no owner action.
