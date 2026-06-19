# Part 1 — Data Model & Habit Database

Defines the canonical habit schema, the Drizzle tables, how the two source CSVs merge, and the seed strategy. All Part 2 tables are defined now (so migrations are stable) but only `habits` is **read** in Part 1.

---

## 1. Source CSVs — two files, one merged record

The two CSVs are **complementary**, both keyed on `habit_id` (`H001`…`H054`):

| File | Role | Unique columns it provides |
|------|------|----------------------------|
| `stalio_habits_library_v2.csv` | **Tracking config (canonical)** | richer `tracking_ui_type`, `tracking_min/max/increment`, `custom_target_allowed`, `is_default_bundle`, `notes_for_product` |
| `deepseek_stalio_habits.csv` | **Descriptive content** | `subcategory`, `description_what_to_do_en/cn`, `why_do_it_benefits_en/cn` |

Shared columns (must match across both; `v2` wins on conflict): `habit_name_*`, `category_group_*`, `category_name_*`, `time_of_day`, `estimated_duration_min`, `difficulty`, `two_min_version_*`.

**Merge rule:** left-join `v2` ⨝ `deepseek` on `habit_id`. `v2` is the source of truth for tracking + bundle flags; `deepseek` is the source of truth for prose. The seed script validates that both files contain the same 54 IDs and logs any divergence on shared fields.

> Count: **54 habits** (`H001`–`H054`). The mockup's "48" is stale — see `CONTENT_RECONCILIATION.md`.

---

## 2. Controlled vocabularies (enums)

### `difficulty`
`easy` | `moderate` | `hard`

### `time_of_day`
`Morning` | `Evening` | `Any` | `Throughout day`
*(stored as text; normalize CSV values — note `"Any"`, `"Throughout day"` appear quoted in source.)*

### `tracking_ui_type` (from v2 — drives the expanded-card mini-demo)
`boolean` | `boolean_optional_text` | `number` | `volume` | `duration` | `duration_optional_text` | `time` | `scale` | `scale_optional_text` | `streak` | `text_required` | `multi_text_required`

Each maps to a render component (see Design System §"Tracking mini-demos"). Unknown/new values must fail the seed loudly rather than silently render nothing.

### Category structure
- **`category_group_en`** (5): `Health & Body`, `Social & Relationship`, `Productivity & Growth`, `Financial`, `Home & Environment`.
- **`category_name_en`** (11): `Health`, `Fitness`, `Nutrition`, `Sleep`, `Mind`, `Reflection`, `Connection`, `Restraint`, `Growth`, `Financial`, `Environment`.
- **Visual color group (6)** — the design splits `Health & Body` into **Body** and **Mind/Mental** (the CSV's `category_group_cn` already does this: 身 vs 心). Color groups: `health (身)`, `mental (心)`, `productivity (长)`, `financial (财)`, `social (缘)`, `home (居)`. The mapping table lives in the Design System doc.

> **Filter design (PRD library sidebar):** the "Category filter (7 options)" in the PRD does not match the 5 `category_group_en` or 11 `category_name_en` exactly. **Confirm the canonical filter taxonomy** (recommend: filter by the 6 visual color groups + an "All") — tracked in `CONTENT_RECONCILIATION.md`.

---

## 3. `habits` table (read in Part 1)

```ts
// db/schema/habits.ts
import { pgTable, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const difficultyEnum = pgEnum('difficulty', ['easy', 'moderate', 'hard']);
export const trackingTypeEnum = pgEnum('tracking_type', [
  'boolean', 'boolean_optional_text', 'number', 'volume', 'duration',
  'duration_optional_text', 'time', 'scale', 'scale_optional_text',
  'streak', 'text_required', 'multi_text_required',
]);

export const habits = pgTable('habits', {
  // identity
  habitId: text('habit_id').primaryKey(),            // H001..H054 (matches app contract)
  // names (bilingual; EN surfaced in Phase 1 — ADR-7)
  nameEn: text('name_en').notNull(),
  nameCn: text('name_cn'),
  // taxonomy
  categoryGroupEn: text('category_group_en').notNull(),
  categoryGroupCn: text('category_group_cn'),
  categoryNameEn: text('category_name_en').notNull(),
  categoryNameCn: text('category_name_cn'),
  subcategory: text('subcategory'),                   // from deepseek
  colorGroup: text('color_group').notNull(),          // derived: health|mental|productivity|financial|social|home
  // descriptive content (from deepseek)
  whatToDoEn: text('what_to_do_en'),
  whatToDoCn: text('what_to_do_cn'),
  whyItWorksEn: text('why_it_works_en'),
  whyItWorksCn: text('why_it_works_cn'),
  // 2-minute version (Atomic Habits)
  twoMinEn: text('two_min_en'),
  twoMinCn: text('two_min_cn'),
  // tracking config (from v2)
  trackingType: trackingTypeEnum('tracking_type').notNull(),
  trackingUnit: text('tracking_unit'),
  trackingDefaultTarget: integer('tracking_default_target'),
  trackingMin: integer('tracking_min'),
  trackingMax: integer('tracking_max'),
  trackingIncrement: integer('tracking_increment'),
  customTargetAllowed: boolean('custom_target_allowed').default(false).notNull(),
  // attributes
  timeOfDay: text('time_of_day'),
  estimatedDurationMin: integer('estimated_duration_min'),
  difficulty: difficultyEnum('difficulty').notNull(),
  isDefaultBundle: boolean('is_default_bundle').default(false).notNull(),
  // ops
  notesForProduct: text('notes_for_product'),         // internal, not rendered
  isPublished: boolean('is_published').default(true).notNull(),
  sortOrder: integer('sort_order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

**Notes**
- `tracking_default_target/min/max/increment` are nullable — many habits (`time`, `text_required`, `streak`) use `null` in source; the seed must coerce CSV literal `"null"` → SQL `NULL`.
- "Habit anatomy" (Cue → Behaviour → Reward) is **not** a column in either CSV. Decide: derive at render time from `whatToDo`/`twoMin`, author separately, or add `cue/behaviour/reward` columns later. Tracked as a content gap.
- `research backing` section: no source column → see `CONTENT_RECONCILIATION.md` D4.

**Derived `colorGroup` rule (seed):** map `category_group_cn` 身→`health`, 心→`mental`; otherwise map `category_group_en`: `Productivity & Growth`→`productivity`, `Financial`→`financial`, `Social & Relationship`→`social`, `Home & Environment`→`home`.

---

## 4. RLS (defense-in-depth, ADR-1)

```sql
alter table habits enable row level security;
create policy "habits_anon_read_published"
  on habits for select to anon
  using (is_published = true);
-- no insert/update/delete policy for anon; writes happen server-side via Drizzle (service role)
```

Part 1 uses only this read policy. In practice the static build reads via Drizzle (service role) at build/ISR time; the anon policy guards any direct client read.

---

## 5. Part 2 tables (defined now, unused in Part 1)

Created in the same initial migration set so the schema is stable and Part 2 is purely additive.

```ts
// habit_submissions — community-submitted habits awaiting moderation
habitSubmissions: id (uuid pk), name_en, category_group_en, what_to_do_en,
  why_it_works_en, two_min_en, tracking_type, submitter_name (nullable),
  ip_hash (salted sha-256), status ('pending'|'approved'|'rejected'),
  created_at, reviewed_at, reviewed_by

// community_posts
communityPosts: id (uuid pk), author_name (nullable), days_on_stalio (int),
  post_type ('story'|'question'|...), related_habit_ids (text[]), body,
  like_count (int default 0), status ('pending'|'published'|'rejected'),
  ip_hash, created_at, reviewed_at

// post_likes — dedup at API (1/IP/post/24h), salted-hash IP
postLikes: id (uuid pk), post_id (fk), ip_hash, created_at
  unique (post_id, ip_hash)
```

These ship as empty tables in Part 1; no API reads/writes them until Part 2.

---

## 6. Seed strategy (ADR-3, PRD open question #3)

**Migration-based, repeatable** (recommended in PRD). Not admin-UI seeding.

1. `scripts/seed-habits.ts` reads both CSVs from `docs/`, validates the 54-ID set, merges per §1.
2. Coerces types: `"TRUE"/"FALSE"`→boolean, `"null"`→NULL, quoted enums normalized.
3. Computes `colorGroup` and `sortOrder` (by `habit_id`).
4. Upserts on `habit_id` (idempotent — safe to re-run).
5. Run via `pnpm db:seed`; wired into CI for preview DBs and documented for production.

A `pnpm db:check` validates row count = 54, every `tracking_type` is in the enum, and no required prose field is empty (warn-only for `why_it_works`).

---

## 7. Querying in Part 1

- **Library list & detail:** read all published habits at build via Drizzle, render statically (`generateStaticParams` + ISR). No per-request DB calls.
- **Search/filter:** client-side over the statically-shipped dataset (54 rows is tiny — full-text search in memory, filter by `colorGroup`/`trackingType`/`difficulty`/`isDefaultBundle`, state in URL params).
- **No write endpoints exist in Part 1.**
