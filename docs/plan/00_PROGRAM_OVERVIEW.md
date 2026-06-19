# Stalio Website — Program Overview (Two-Part Launch)

**Owner:** Orbace Technologies LLC
**Source documents:** `stalio_PRD.docx`, `stalio_tech_stack_v1_1.docx`
**Design refs:** `stalio_website.html`, `stalio_library_page.html`
**Data refs:** `stalio_habits_library_v2.csv` (tracking config), `deepseek_stalio_habits.csv` (descriptions)
**Status:** Part 1 in build (static scaffold complete) — Part 2 deferred / under review

> **Architecture update:** Part 1 ships as a **fully static site with no database**, hosted on **Cloudflare Pages** (already owned). Habit content is compiled from CSV at build time. See `01_REVISED_TECH_STACK.md` **ADR-8**.
>
> **Part 2 (community/admin) is not near-term** and may be replaced by a **Reddit community** rather than a self-hosted one — so Vercel + Supabase + Clerk are deferred, possibly indefinitely. The Part 2 database schema is preserved (dormant) under `part2-reference/`.

---

## 1. Why two launches

The original PRD describes four phases (0 Foundations, 1 Marketing/Library, 2 Community, 3 Admin, 4 Hardening). We split delivery into **two independently shippable launches** so the highest-value, lowest-risk surface — the marketing site and habit library — goes live first and starts driving app downloads while the community/moderation layer is built behind it.

| Launch | Phases | Theme | Goes live as |
|--------|--------|-------|--------------|
| **Part 1** | Phase 0 + Phase 1 + 4a | Read-only marketing + habit library | Public site on `stalio.orbacetech.com`, then `stalio.app` |
| **Part 2** | Phase 2 + Phase 3 + 4b | Community, submissions, admin moderation | Adds write surfaces + `/admin` |

Part 1 contains **zero user-generated content and zero authentication** — it is pure read + deep-link. That removes the entire class of abuse, moderation, rate-limiting, and auth risk from the first launch, making it fast to build and safe to expose.

---

## 2. Scope split

### Part 1 — Foundations + Marketing & Library (read-only)
- Repo, tooling, CI/CD, hosting, design-token system, Drizzle schema, **habit DB seeded from CSVs (54 habits)**.
- Homepage: hero, interactive app mockup, features grid, store CTAs.
- Habit Library `/library`: search, filters (category, tracking method, difficulty, default-bundle), expand-in-place detail cards (anatomy, 2-minute version, tracking mini-demo, what-to-do, why-it-works).
- Per-habit deep-link "Add to Stalio app" → store fallback with UTM (no app round-trip logic beyond the link + well-known files).
- SEO, structured data, sitemap, Open Graph, Core Web Vitals.
- **Phase 4a hardening** (see §4).

### Part 2 — Community + Submissions + Admin
- Submit-a-habit form + moderation queue.
- Community feed, post submission, optimistic likes with server persist.
- Upstash rate limiting, Resend admin notifications, salted-IP dedup.
- Clerk-protected `/admin` with approve/reject/edit-before-publish.
- On-demand ISR revalidation triggered by admin approval.
- **Phase 4b hardening** (see §4).

### Explicitly out of scope (both parts, per PRD)
Website user accounts, web habit personalisation/AI, native app builds, web monetisation, i18n (Chinese content is stored but not surfaced in Phase 1 — see Data Model).

---

## 3. Dependency between the parts

Part 1 deliberately builds the foundation Part 2 needs:
- Drizzle schema includes the Part 2 tables (`habit_submissions`, `community_posts`, `post_likes`) from day one, but only `habits` is read in Part 1.
- API runtime, Zod-schema conventions, and the on-demand revalidation hook are designed in Part 1 and consumed in Part 2.
- Clerk is **not** installed in Part 1 (admin is a Part 2 concern), keeping the Part 1 marketing/library bundle free of auth JS.

This means Part 2 is additive: no rework of Part 1 surfaces.

---

## 4. Phase 4 (hardening) split by content

Phase 4 in the PRD is one "launch hardening" bucket. We split it so each part hardens only what it ships:

### Phase 4a — ships with Part 1 (read-path hardening)
- Core Web Vitals pass on mobile 4G (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- Library TTI < 1.5s on 3G; initial JS < 200KB gzipped.
- WCAG 2.1 AA on homepage + library; keyboard nav; `prefers-reduced-motion`.
- SEO: sitemap/robots submitted to Search Console; structured data validated.
- **Deep-link well-known files** (`apple-app-site-association`, `assetlinks.json`) served correctly + store-fallback verified on real devices.
- CSP headers, cookie consent, Sentry alerting on the public surface.
- PostHog funnel events for the discover→download and browse→add flows.

### Phase 4b — ships with Part 2 (write-path hardening)
- Rate-limit verification (submission + likes) under load; abuse/bot testing.
- Server-side Zod validation + HTML-escaping audit on all write endpoints.
- CSRF protection on POST endpoints; admin session hardening.
- Moderation SLA tooling (queue, Resend notifications); WCAG pass on `/admin` and community forms.
- Revalidation-on-approval verified end to end.

---

## 5. Cost posture (unchanged from tech doc)

- **Part 1 pilot:** all free tiers, hosted at `stalio.orbacetech.com`. **$0/month.**
- **Part 1 public launch:** Vercel Pro ($20) + Supabase Pro ($25) + `stalio.app` domain ($18/yr). **~$47/month.**
- **Part 2** adds Upstash, Resend, Clerk, Sentry Team only when their free tiers are exceeded. Budget guardrail: **$70/month for first 12 months.**

Clerk and Upstash are **not billed in Part 1** because they are not used until Part 2.

---

## 6. Document index

| Document | Purpose |
|----------|---------|
| `00_PROGRAM_OVERVIEW.md` | This file — two-part split, scope, phase 4 split |
| `01_REVISED_TECH_STACK.md` | Revised stack + architecture decisions (ADRs) |
| `02_ACCOUNTS_AND_CONFIG.md` | **Action items from business owner** (accounts, secrets, domains) |
| `SERVICES_RATIONALE.md` | Why each third-party service, what's needed, what's deferrable |
| `part1/PART1_PROJECT_PLAN.md` | Part 1 work breakdown, milestones, acceptance criteria |
| `part1/DATA_MODEL.md` | Habit schema, Drizzle tables, CSV merge + seed strategy |
| `part1/DESIGN_SYSTEM.md` | Design tokens & components extracted from the mockups |
| `part1/FILE_STRUCTURE.md` | Repo file/folder structure for Part 1 |
| `part1/CONTENT_RECONCILIATION.md` | Open content questions (48 vs 54 habits, bundle, gaps) |
| `part1/HABIT_CONTENT_TODO.md` | PM fill-in guide for the consolidated habit file |
| `../stalio_habits_consolidated_v1.csv` | **Consolidated 54-habit source of truth** (merged + PM-fill columns) |
