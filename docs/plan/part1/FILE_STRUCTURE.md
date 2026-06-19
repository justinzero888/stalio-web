# Part 1 — Repository File Structure

> **Updated for the static refactor (ADR-8).** Part 1 has **no database** and ships as a static export. Changes vs. the tree below:
> - **Removed from the app:** `db/`, `drizzle.config.ts`, `middleware.ts`, the DB seed script. The Drizzle schema + migration are preserved (dormant) under `docs/plan/part2-reference/`.
> - **Added:** `lib/habits/data.ts` + generated `lib/habits/habits.generated.json` (compiled from the CSV by `scripts/generate-habits.ts`), `public/_headers` (Cloudflare Pages security headers), `public/.well-known/` (deep-link files).
> - **Data flow:** `docs/*.csv` → `pnpm habits:generate` → `habits.generated.json` → static pages. No runtime queries.
> - **Host:** Cloudflare Pages (`pnpm build` → `out/`).
>
> The tree below is the original Part 1 plan (DB-based); treat it as the Part 2-capable target. The shipped Part 1 follows the simplified static layout above.

Proposed layout for the Next.js 15 app at the repo root `orbacetech/.../stalioweb/`. The existing `docs/` folder (PRD, mockups, CSVs, this plan) stays in place. Package manager: **pnpm**.

Legend: **[P1]** built in Part 1 · **[P2]** scaffolded/placeholder, implemented in Part 2.

```
stalioweb/
├─ docs/                              # existing — specs, mockups, CSVs, this plan
│  ├─ stalio_PRD.docx
│  ├─ stalio_tech_stack_v1_1.docx
│  ├─ stalio_website.html
│  ├─ stalio_library_page.html
│  ├─ stalio_habits_library_v2.csv
│  ├─ deepseek_stalio_habits.csv
│  └─ plan/                           # ← all planning documents
│
├─ app/                               # Next.js App Router
│  ├─ layout.tsx                      # [P1] root layout: fonts, theme, header/footer, consent
│  ├─ globals.css                     # [P1] Tailwind v4 @theme tokens (Design System §4)
│  ├─ page.tsx                        # [P1] Homepage (hero, mockup, features, CTA)
│  ├─ opengraph-image.tsx             # [P1] default OG image
│  ├─ sitemap.ts                      # [P1] generated sitemap
│  ├─ robots.ts                       # [P1] robots.txt
│  ├─ library/
│  │  ├─ page.tsx                     # [P1] library shell (sidebar + grid), SSG+ISR
│  │  └─ [habitId]/
│  │     ├─ page.tsx                  # [P1] per-habit page (SEO, deep-linkable, OG)
│  │     └─ opengraph-image.tsx       # [P1] per-habit OG image
│  ├─ habit/
│  │  └─ [id]/route.ts                # [P1] deep-link fallback → store w/ UTM (ADR-5)
│  ├─ .well-known/
│  │  ├─ apple-app-site-association/route.ts   # [P1] AASA (no redirect, correct CT)
│  │  └─ assetlinks.json/route.ts              # [P1] Android App Links
│  ├─ api/
│  │  └─ revalidate/route.ts          # [P1] on-demand ISR endpoint (secured; used by P2)
│  ├─ community/                      # [P2] feed + post form
│  └─ admin/                          # [P2] Clerk-protected moderation
│
├─ components/
│  ├─ ui/                             # [P1] shadcn/ui primitives (button, badge, toast…)
│  ├─ marketing/                      # [P1] Hero, AppMockup, FeatureGrid, DownloadCTA
│  ├─ library/                        # [P1] LibrarySidebar, HabitCard, HabitCardExpanded,
│  │                                  #      AddToAppButton, TrackingDemo, AnatomyBar
│  ├─ layout/                         # [P1] SiteHeader, SiteFooter, CookieConsent
│  └─ community/                      # [P2]
│
├─ lib/
│  ├─ habits/
│  │  ├─ queries.ts                   # [P1] Drizzle reads (build/ISR time)
│  │  ├─ filters.ts                   # [P1] client-side search/filter logic
│  │  └─ color-group.ts              # [P1] category → colorGroup mapping
│  ├─ deeplink.ts                     # [P1] build Universal/App link + UTM fallback
│  ├─ seo.ts                          # [P1] metadata + JSON-LD helpers (Article/FAQ/Breadcrumb)
│  ├─ analytics/posthog.ts            # [P1] lazy PostHog init + event helpers
│  ├─ store/added-habits.ts           # [P1] Zustand persist (localStorage)
│  ├─ rate-limit.ts                   # [P2] Upstash
│  └─ email.ts                        # [P2] Resend
│
├─ db/
│  ├─ index.ts                        # [P1] Drizzle client (node-postgres, Node runtime)
│  ├─ schema/
│  │  ├─ habits.ts                    # [P1] habits table + enums
│  │  └─ community.ts                 # [P2-defined] submissions, posts, likes (migrated now)
│  └─ migrations/                     # [P1] drizzle-kit generated SQL + RLS policies
│
├─ scripts/
│  ├─ seed-habits.ts                  # [P1] merge 2 CSVs → upsert 54 habits (idempotent)
│  └─ check-habits.ts                 # [P1] validate count/enums/required fields
│
├─ types/
│  ├─ habit.ts                        # [P1] shared Habit type (inferred from schema)
│  └─ tracking.ts                     # [P1] tracking_type union + demo map
│
├─ public/
│  ├─ icons/ logo/ favicons/          # [P1] brand assets (from business owner, §D)
│  └─ images/                         # [P1] static imagery, app mockup art
│
├─ tests/
│  ├─ unit/                           # [P1] Vitest (filters, deeplink, color-group, seo)
│  └─ e2e/                            # [P1] Playwright (discover→download, browse→add)
│
├─ .github/workflows/
│  └─ ci.yml                          # [P1] lint + typecheck + vitest + playwright on PR
│
├─ .env.example                       # [P1] documents all env vars (Accounts & Config §E)
├─ drizzle.config.ts                  # [P1]
├─ next.config.ts                     # [P1] CSP headers, image config, Sentry wrap
├─ middleware.ts                      # [P1] CSP/security headers (marketing); [P2] Clerk on /admin
├─ tailwind / postcss config          # [P1] Tailwind v4
├─ tsconfig.json                      # [P1] strict
├─ vitest.config.ts                   # [P1]
├─ playwright.config.ts               # [P1]
├─ package.json                       # [P1]
└─ README.md                          # [P1] setup, scripts, env, deploy
```

## Key scripts (`package.json`)

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx scripts/seed-habits.ts",
    "db:check": "tsx scripts/check-habits.ts"
  }
}
```

## Notes
- **Part 2 is additive**: `app/community`, `app/admin`, `lib/rate-limit.ts`, `lib/email.ts`, and the `community.ts` schema are created (or migrated) in Part 1 but carry no Part 1 runtime. No Part 1 file is rewritten for Part 2.
- DB-touching code (`db/`, `api/revalidate`, deep-link well-known routes) runs on the **Node runtime** (ADR-2).
- The seed script reads the CSVs directly from `docs/` so the source of truth stays version-controlled with the specs.
