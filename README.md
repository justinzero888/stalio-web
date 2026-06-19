# Stalio Web

Marketing site + public habit library for **Stalio** (Orbace Technologies LLC).
Repo: `justinzero888/stalio-web`. Built with Next.js 15 (App Router) + TypeScript + Tailwind v4.

> **Part 1 = a fully static marketing site + habit library.**
> No database, no auth, no user-generated content. Habit content is compiled
> from a CSV at build time and exported as static HTML. Hosted on **Cloudflare Pages**.
> Planning docs: [`docs/plan/`](docs/plan/00_PROGRAM_OVERVIEW.md).

## Prerequisites

- Node `>=20` (`.nvmrc` → 20)
- pnpm (`corepack enable`)

## Setup

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL, store URLs (optional locally)
pnpm dev                     # http://localhost:3000  (predev regenerates habit data)
```

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` / `build` | Next dev / static export to `out/` |
| `pnpm lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `pnpm test` / `test:e2e` | Vitest unit / Playwright e2e |
| `pnpm habits:generate` | Compile `docs/stalio_habits_consolidated_v1_F.csv` → `lib/habits/habits.generated.json` (runs on `predev`/`prebuild`) |
| `pnpm habits:check` | Validate the consolidated habit CSV (count, enums, gaps) |

## Data (no database)

The habit library is built from **`docs/stalio_habits_consolidated_v1_F.csv`** (54 habits, PM-completed: anatomy + research columns filled).
`pnpm habits:generate` compiles it to `lib/habits/habits.generated.json` (committed),
which the app imports and renders statically. To update content: edit the CSV, run
`pnpm habits:generate`, commit, redeploy. PM-fill columns are flagged `[TODO-PM]` —
see [`docs/plan/part1/HABIT_CONTENT_TODO.md`](docs/plan/part1/HABIT_CONTENT_TODO.md).

## Services (Part 1)

Per [`docs/plan/SERVICES_RATIONALE.md`](docs/plan/SERVICES_RATIONALE.md), Part 1 runs on:
**Cloudflare Pages** (hosting + DNS, already owned) + **Google Search Console** (SEO).
No Vercel, no Supabase. PostHog is optional (commented in `.env.example`).
A database / Vercel are only revisited if a self-hosted community is ever built
(current plan leans toward a Reddit community instead).

## Deploy (Cloudflare Pages)

1. Cloudflare Pages → Create project → connect the GitHub repo.
2. Build command: `pnpm build` · Output directory: `out`.
3. Env vars: set `NEXT_PUBLIC_*` from `.env.example`.
4. Point the domain (already on Cloudflare). Security headers are served via
   `public/_headers`; deep-link files live in `public/.well-known/` (replace the
   `REPLACE_*` placeholders with values from the mobile team).

## Project structure

See [`docs/plan/part1/FILE_STRUCTURE.md`](docs/plan/part1/FILE_STRUCTURE.md).
The dormant Part 2 database schema is preserved under
[`docs/plan/part2-reference/`](docs/plan/part2-reference/).
