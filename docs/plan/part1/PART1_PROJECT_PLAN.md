# Part 1 — Project Plan (Phase 0 + Phase 1 + Phase 4a)

**Goal:** ship a fast, accessible, SEO-strong, read-only marketing site + habit library that drives app downloads — with zero user-generated content, zero auth, and a foundation Part 2 extends additively.

**Definition of success (PRD KPIs in scope for Part 1):** organic discoverability, download-CTA conversion, habit "Add to app" clicks tracked, Core Web Vitals green.

---

## 1. Workstreams & milestones

Milestones are dependency-ordered. Each lists deliverables and **acceptance criteria (AC)**. They can overlap where dependencies allow (e.g. Design System ‖ Data layer).

### M0 — Foundations (Phase 0)
**Deliverables**
- pnpm + Next.js 15 (App Router, TS strict), Tailwind v4 with `@theme` tokens, shadcn/ui init, Tabler icons.
- Repo + branch protection; GitHub Actions CI (`lint`, `typecheck`, `vitest`, `playwright`).
- Vercel project linked (preview deploy per PR); Supabase project; Drizzle + `drizzle.config.ts`.
- `.env.example`; Sentry wired; PostHog lazy init scaffold; CSP/security headers in `next.config.ts` + `middleware.ts`.
- `README.md` (setup, scripts, env, deploy).

**AC**
- A clean clone runs `pnpm i && pnpm dev` with documented env.
- A PR triggers CI; green CI required to merge; a preview URL is produced.
- Sentry receives a test error from a preview deploy.

**Unblocked by:** Accounts & Config B1–B3 (GitHub, Vercel, Supabase).

---

### M1 — Data layer & seed (Phase 0/1) ‖ can run with M2
**Deliverables**
- `db/schema/habits.ts` (+ enums) and `db/schema/community.ts` (Part 2 tables, migrated now).
- Initial migration incl. RLS `anon SELECT published` policy (ADR-1).
- `scripts/seed-habits.ts` merging both CSVs → 54 idempotent upserts (Data Model §6).
- `scripts/check-habits.ts` validation; `lib/habits/color-group.ts`.
- `types/habit.ts`, `types/tracking.ts`.

**AC**
- `pnpm db:migrate && pnpm db:seed` produces exactly **54** published habits.
- `pnpm db:check` passes: 54 rows, every `tracking_type` valid, `colorGroup` set for all, `"null"`/`"TRUE"` coercions correct.
- Re-running the seed is a no-op (idempotent).

**Depends on:** M0 (Drizzle/Supabase). **Inputs:** the two CSVs (present).

---

### M2 — Design system (Phase 1) ‖ can run with M1
**Deliverables**
- Tailwind `@theme` tokens from `DESIGN_SYSTEM.md` (colors, 6 category groups, radii, shadows).
- `next/font` for Instrument Serif + Inter; type scale.
- shadcn primitives styled to tokens: Button (mint/ghost), Badge/Tag, Toast, Card, inputs.
- `SiteHeader`, `SiteFooter`, `CookieConsent`; reduced-motion utilities.

**AC**
- Token values match the mockups exactly (spot-checked against `:root`).
- Storybook-or-page sample renders all primitives; AA contrast verified on category bg/text pairs.
- No CLS from font loading (self-hosted fonts).

**Depends on:** M0.

---

### M3 — Homepage (Phase 1)
**Deliverables**
- `Hero` (Instrument Serif H1, sub-headline, mint CTA), stats row (DB-derived counts — R1/R2).
- `AppMockup` interactive: tap checks habits, animates progress bar; reduced-motion safe.
- `FeatureGrid` (6 cards), `DownloadCTA` (store links + deep-link aware).
- PostHog events: hero CTA + store-click funnel.

**AC**
- Matches `stalio_website.html` layout across mobile/tablet/desktop breakpoints.
- Hero is above the fold on all breakpoints (PRD §6.1).
- Mockup is keyboard-operable and announces state to screen readers.
- Store CTAs use real URLs (A4) or graceful placeholders behind a feature flag until provided.

**Depends on:** M2 (design), M1 (counts).

---

### M4 — Habit Library (Phase 1) — the core surface
**Deliverables**
- `/library` SSG + ISR; full dataset shipped statically (Data Model §7).
- `LibrarySidebar`: full-text search; filters for color-group (live counts), tracking method, difficulty; default-bundle toggle; URL-param state (shareable/back-safe).
- `HabitCard` (collapsed) + `HabitCardExpanded` (in-place): anatomy bar, 2-minute callout, `TrackingDemo` per type, what-to-do, why-it-works, (research per R5), Add-to-app CTA.
- `AddToAppButton`: deep link + optimistic checked state + `localStorage` (Zustand persist) + toast.
- `/library/[habitId]` per-habit page (deep-linkable, own metadata/OG).

**AC**
- All 54 habits render; filters + search produce correct live counts; state survives reload/back.
- Expand happens in-place (no navigation); one `TrackingDemo` variant per `tracking_type` works and is accessible.
- "Add to Stalio app" builds the correct deep link and turns mint/checked with toast; added-set persists across reload.
- Browse→add flow passes Playwright e2e (PRD §10.2).

**Depends on:** M1 (data), M2 (design), M5 (deep-link helper).

---

### M5 — Deep-linking, SEO & metadata (Phase 1)
**Deliverables**
- `lib/deeplink.ts`: Universal/App link + store fallback with `utm_source=web_library&utm_habit=[id]` (ADR-5).
- `.well-known/apple-app-site-association` + `assetlinks.json` route handlers (Node runtime, no redirect, correct content-type).
- `app/habit/[id]/route.ts` fallback redirect.
- `lib/seo.ts`: per-page Metadata API (title/description/`og:image`), JSON-LD `Article`/`FAQPage` + `BreadcrumbList` (ADR-4); `sitemap.ts`, `robots.ts`.
- `api/revalidate/route.ts` (secured by `REVALIDATE_SECRET`; consumed by Part 2).

**AC**
- AASA/assetlinks served at correct paths with `200`, no redirect, valid JSON, correct MIME.
- Each habit has unique title/description/OG; structured data validates (Rich Results Test for Breadcrumb).
- sitemap + robots generated; ready to submit to Search Console (B8).
- Deep-link values populated from env (C1–C4) or documented fallback if not yet provided.

**Depends on:** M0; **needs** C1–C4 values for real deep links (else fallback).

---

### M6 — Phase 4a hardening
**Deliverables & AC** (these are the launch gates):
- **Performance:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile 4G; library TTI < 1.5s on 3G; **initial JS < 200KB gzipped** (ADR-6 route isolation; lazy PostHog; tree-shaken Sentry).
- **Accessibility:** WCAG 2.1 AA on homepage + library; full keyboard nav; ARIA on icon-only buttons; `prefers-reduced-motion` honored. Verified with axe + manual screen-reader pass.
- **Security:** CSP headers via middleware; cookie-consent on first visit; no secrets in client bundle.
- **SEO/ops:** sitemap submitted to Search Console; Sentry alerting on; PostHog funnels live (`habit_add_clicked` with habit_id/name/category).
- **Cross-device:** deep-link verified on real iOS + Android devices (or documented fallback).

---

### M7 — Launch
**Pilot exit → Public launch**
- Deploy on free tiers at `stalio.orbacetech.com`; internal review + Playwright against staging.
- Public: register `stalio.app` (A1/B5), Vercel Pro + Supabase Pro (~$47/mo), point Cloudflare DNS, enable Vercel spend alert ($60) + Supabase spend cap (Accounts & Config §F).
- Submit sitemap; smoke-test all flows; tag release.

---

## 2. Sequencing (high level)

```
M0 ─┬─ M1 ─┐
    ├─ M2 ─┼─ M3 ──┐
    └─ M5 ─┴─ M4 ──┴─ M6 ── M7
```
M1 and M2 parallelize after M0. M5's deep-link helper is needed by M4; its well-known files + SEO can finish alongside M4. M6 gates M7.

---

## 3. Testing strategy
- **Unit (Vitest):** seed/merge logic, `filters.ts`, `color-group.ts`, `deeplink.ts`, `seo.ts` JSON-LD.
- **E2E (Playwright):** discover→download (PRD §10.1); browse→filter→expand→add→persist (PRD §10.2); per-habit deep-link page renders + OG.
- **Non-functional gates (M6):** Lighthouse/CWV budget check in CI on the library route; axe accessibility scan; bundle-size assertion (<200KB).
- CI runs unit + e2e on every PR; CWV/axe on the `main` preview.

---

## 4. Risks & mitigations
| Risk | Mitigation |
|------|------------|
| Deep-link app values (C1–C4) not ready at launch | Build now with env-driven values; ship store-fallback if absent (ADR-5) |
| Content gaps (anatomy R4, research R5) | Derive-now/edit-later defaults; Part 2 admin can correct |
| Bundle budget pressure from 3rd-party JS | Route isolation + lazy load (ADR-6); CI bundle assertion |
| Count/bundle copy wrong (R1/R2) | Derive counts from DB, not hardcode; owner confirms before public launch |
| ISR/static choice vs future dynamic needs | `api/revalidate` seam built now (ADR-3); Part 2 plugs in without rework |

---

## 5. Definition of Done (Part 1)
1. Homepage + library + per-habit pages live, matching mockups across breakpoints.
2. 54 habits seeded from CSVs; filters/search/deep-link/add-to-app all functional.
3. All M6 launch gates met (CWV, WCAG AA, CSP, SEO, analytics).
4. CI green; unit + e2e passing; preview→production deploy verified.
5. Owner content decisions (R1–R5) resolved or explicitly deferred with fallback.
6. Part 2 tables migrated, `api/revalidate` present — no Part 1 rework needed for Part 2.

---

## 6. What's needed from the business owner to start (and to launch)
See `02_ACCOUNTS_AND_CONFIG.md`. **Start now:** GitHub + Vercel + Supabase (B1–B3) and acknowledgement of R1/R2. **Before public launch:** A1/A4 (domain, store URLs), C1–C4 (deep-link), D1–D6 (brand/legal), B4–B8 (Cloudflare, PostHog, Sentry, Search Console), and reconciliation decisions R1–R5.
