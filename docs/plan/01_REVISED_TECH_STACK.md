# Revised Tech Stack & Architecture Decisions

> **Part 1 update (current):** Part 1 ships as a **fully static site on Cloudflare Pages with no database** — see **ADR-8** below, which supersedes the DB/runtime parts of ADR-1/2/3 for Part 1. The table below describes the full target stack; items marked *(deferred)* are not used by the static Part 1 site.

This revises `stalio_tech_stack_v1_1.docx` with the analysis from the stack review. The proposed stack is endorsed ~90% as-is; the changes below are **correctness fixes**, not preferences. Each is recorded as a short ADR (Architecture Decision Record).

---

## 1. Confirmed stack (endorsed as-is)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 15 (App Router, RSC)** | Static-first for content (see ADR-3) |
| Language | **TypeScript 5.x** | strict mode on |
| Styling | **Tailwind CSS v4** | tokens from mockups (see Design System) |
| UI primitives | **shadcn/ui + Radix UI** | owned in-repo; Tailwind v4-compatible CLI |
| Icons | **Tabler Icons (React)** | matches app icon set |
| Database | **Supabase (PostgreSQL)** | managed Postgres + RLS |
| ORM | **Drizzle** | server-side data access (see ADR-1) |
| Deployment | **Vercel** | preview deploy per PR |
| DNS / CDN | **Cloudflare** (free) | DNS, DDoS, SSL |
| Analytics | **PostHog** | lazy-loaded (see ADR-6) |
| Forms | **React Hook Form + Zod** | shared client/server schemas |
| Error monitoring | **Sentry** | tree-shaken, replay off by default |
| Testing | **Vitest + Playwright** | unit + e2e in CI |
| CI/CD | **GitHub Actions + Vercel** | lint/typecheck/test on every PR |

### Used in Part 2 only (not installed in Part 1)
| Layer | Choice | First used |
|-------|--------|-----------|
| Auth | **Clerk** | Part 2 — `/admin` |
| Rate limiting | **Upstash Redis** | Part 2 — write endpoints |
| Email | **Resend** | Part 2 — admin notifications |

Keeping these out of Part 1 keeps the public bundle free of auth/rate-limit JS and avoids billing meters before they are needed.

---

## ADR-1 — Authorization lives at the API layer, not in RLS

**Context.** The original doc expresses admin permissions via Supabase Row-Level Security referencing an "admin role." But identity comes from **Clerk**, not Supabase Auth, so a Clerk session does not satisfy a Postgres RLS role unless Clerk is wired as a third-party JWT issuer — needless complexity for a single-admin site.

**Decision.**
- All server-side DB access goes through **Drizzle over a direct Postgres connection (service role)**.
- Authorization is enforced at the **API/route-handler layer**: Clerk session check (admin) + Zod validation.
- **RLS stays enabled as defense-in-depth**: `anon` may `SELECT` published rows only; no anon writes. RLS does **not** attempt to model "admin."

**Consequences.** Simpler, no Clerk↔Supabase JWT bridge. In Part 1 there are no writes at all, so only the `anon SELECT published` policy on `habits` is active.

---

## ADR-2 — Route Handlers run on the Node runtime

**Context.** The doc implies write endpoints run on the Vercel **Edge** runtime, but Drizzle over `node-postgres` requires the **Node** runtime; Edge would break the driver.

**Decision.** Route Handlers that touch the database declare `export const runtime = 'nodejs'`. Upstash rate limiting (Part 2) works fine on Node. Edge is not used for DB-touching code.

**Consequences.** Predictable driver behaviour; negligible latency cost for these endpoints. Part 1 has effectively no dynamic DB endpoints (content is static — ADR-3).

---

## ADR-3 — Habit content is static-first (SSG + ISR), not REST-per-request

**Context.** ~54 habits, rarely changing, with strict budgets (library TTI < 1.5s on 3G, LCP < 2.5s, SEO). Fetching from Supabase REST on every request wastes egress and hurts CWV.

**Decision.**
- Habits are rendered with **`generateStaticParams` + ISR** (`revalidate`).
- Content updates (Part 2 admin approvals) trigger **on-demand revalidation** via a secured webhook/route.
- Part 1 may even seed + build entirely from the database at build time, since there is no write path yet.

**Consequences.** Near-zero Supabase egress, excellent CWV/SEO, and a clean revalidation seam that Part 2 plugs into without reworking Part 1 pages.

---

## ADR-4 — Structured data: drop reliance on HowTo rich results

**Context.** Google deprecated **HowTo** rich results (2023); the schema no longer yields SERP enhancements.

**Decision.** Use `Article` / `FAQPage` schema where applicable and keep `BreadcrumbList`. HowTo JSON-LD may remain for semantics but with no rich-result expectation. Per-habit metadata (title, description, `og:image`) via the Metadata API.

**Consequences.** Realistic SEO expectations; no wasted effort tuning a dead rich-result type.

---

## ADR-5 — Deep linking is a hosting requirement + cross-team dependency

**Context.** "Add to Stalio app" relies on Universal Links / App Links, which require `apple-app-site-association` and `.well-known/assetlinks.json` served over HTTPS from the site domain **with no redirect**. The app's URL scheme is a PRD open question.

**Decision.**
- Serve both well-known files via Next route handlers (correct `Content-Type`, no redirect).
- Build a web fallback page `/habit/[id]` that, if the app is not installed, redirects to App Store / Google Play with `utm_source=web_library&utm_habit=[id]`.
- **Resolve the app URL scheme + Team ID / package name with the mobile team before Part 1 launch** (tracked in Accounts & Config).

**Consequences.** Deep-link plumbing is built in Part 1 but its *values* depend on business-owner/mobile-team input.

---

## ADR-6 — Third-party JS is route-isolated and deferred to protect the bundle

**Context.** Budget is < 200KB gzipped initial JS. PostHog and Sentry can each blow it.

**Decision.**
- **PostHog**: lazy-init after hydration; events only.
- **Sentry**: tree-shaken; session replay disabled by default.
- **Clerk** (Part 2): loaded only inside the `/admin` route-segment layout — never on marketing/library routes.

**Consequences.** Marketing + library routes ship minimal third-party JS, protecting CWV.

---

## ADR-7 — Bilingual content stored, English-only surfaced in Phase 1

**Context.** Both CSVs carry full English **and** Chinese content. PRD puts i18n in v2.

**Decision.** Store `*_en` and `*_cn` columns in the DB now (cheap, future-proof), but render English only in Part 1/2. i18n routing (`next-intl`) is deferred to v2.

**Consequences.** No re-seeding when Chinese launches; zero i18n complexity in Phase 1 bundle.

---

## ADR-8 — Part 1 is a fully static site on Cloudflare Pages, no database

**Context.** Part 1 has no accounts and no community writes; the habit "library" is ~54 read-only records that change only when a PM edits content. A managed Postgres + a server runtime is unnecessary for that. Part 2 (self-hosted community) is **not near-term** and may be replaced by a **Reddit community** instead, so the dynamic backend may never be needed.

**Decision.**
- **No database in Part 1.** Habit content is compiled from `docs/stalio_habits_consolidated_v1.csv` → `lib/habits/habits.generated.json` at build time (`pnpm habits:generate`) and rendered as a **static export** (`output: 'export'`).
- **Host on Cloudflare Pages** (already owned: `orbacetech.com`, Blinking Chorus) — no Vercel, no new vendor, DNS already there. Build command `pnpm build`, output dir `out/`.
- **No middleware / no `headers()`** (unsupported in static export): security headers move to `public/_headers`; deep-link well-known files are static in `public/.well-known/`.
- **Supabase + Drizzle are deferred** (possibly indefinitely). The schema is preserved, dormant, under `docs/plan/part2-reference/` for if/when a self-hosted community is built.

**Consequences.**
- ADR-1 (RLS), ADR-2 (Node runtime), and the database half of ADR-3 are **not applicable to Part 1** — superseded by this ADR. Static-first content delivery (the goal of ADR-3) is achieved via build-time CSV instead of ISR.
- $0 hosting for Part 1; minimal moving parts; trivially fast and SEO-friendly.
- If a self-hosted community is ever built, it reintroduces a database + dynamic backend (Cloudflare Workers + D1/Postgres, or move to Vercel + Supabase) — a clean, additive decision made at that time.

---

## Deviations from the original doc — summary

| Topic | Original doc | Revised |
|-------|--------------|---------|
| Admin authz | RLS "admin role" | API-layer Clerk check; RLS = anon-read defense only (ADR-1) |
| Endpoint runtime | Edge runtime | Node runtime for DB code (ADR-2) |
| Habit content delivery | REST, "optionally cached" | Static-first SSG + ISR + on-demand revalidate (ADR-3) |
| HowTo schema | Rich-result intent | Article/FAQ + Breadcrumb; HowTo semantic only (ADR-4) |
| Supabase Realtime | Listed | Dropped for Part 1/2 (poll moderation queue) — fewer moving parts |
| IP hashing | SHA-256 of IP | SHA-256 **with server-side salt/pepper** (Part 2) |
| Clerk / Upstash / Resend | Part of launch stack | Part 2 only; absent from Part 1 |
