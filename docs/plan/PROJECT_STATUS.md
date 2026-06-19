# Stalio Web — Project Status

**Last updated:** end of build session (Part 1 shipped)
**Live:** https://stalio.orbacetech.com
**Repo:** https://github.com/justinzero888/stalio-web (`main`)
**Latest commit:** `e4a734f` (+ docs)

---

## 1. Headline

**Part 1 is fully built, tested, deployed to production, and indexed.** It is a static marketing site + public habit library (54 habits) with no database, hosted on Cloudflare Pages with auto-deploy on push.

---

## 2. Scope delivered (Part 1 = Phase 0 + 1 + 4a)

| Area | Status | Notes |
|------|--------|-------|
| Foundations (repo, tooling, CI) | ✅ | Next.js 15 static export, TS strict, Tailwind v4, Vitest, Playwright, GitHub Actions |
| Habit data pipeline | ✅ | 54 habits compiled from `docs/stalio_habits_consolidated_v1_F.csv` → `lib/habits/habits.generated.json` at build |
| Homepage | ✅ | Hero + interactive app mockup, 6 feature cards, library teaser, download CTA |
| Habit library `/library` | ✅ | Search, category (live counts), tracking-method, difficulty, default-bundle toggle, sort; URL-synced filters |
| Habit cards | ✅ | Collapsed + expand-in-place: anatomy bar, 2-min, tracking demo, what/why/research, add-to-app |
| Add-to-app | ✅ | Zustand persist (localStorage) + toast + UTM store-fallback link |
| Per-habit pages `/library/[id]` | ✅ | 54 static pages, per-page metadata + Article/BreadcrumbList JSON-LD |
| SEO | ✅ | sitemap.xml (56 URLs), robots.txt, canonical, OG; GSC verified + sitemap submitted |
| Legal/utility pages | ✅ | 404, /privacy, /terms, favicon |
| Deep-link plumbing | ⚠️ partial | `.well-known/` files served (correct content-type) with **placeholder** values |
| Phase 4a hardening | ✅ | Lighthouse A11y 100 / Best Practices 100 / SEO 100; CLS 0, TBT 20ms |
| Production deploy + domain | ✅ | Cloudflare Pages `stalio-web` + custom domain `stalio.orbacetech.com` |
| Auto-deploy (CI/CD) | ✅ | Push to `main` → build + `wrangler pages deploy`, verified |

---

## 3. Quality gates (all green)

| Gate | Result |
|------|--------|
| `pnpm typecheck` | ✅ |
| `pnpm lint` | ✅ no warnings |
| `pnpm test` (Vitest) | ✅ 10/10 |
| `pnpm test:e2e` (Playwright) | ✅ 6/6 (desktop + mobile) |
| `pnpm habits:check` | ✅ 54 habits, 9 bundle, 6 groups, no gaps |
| `pnpm build` | ✅ 61 static pages, ~108–111 kB First Load JS |
| GitHub Actions CI | ✅ verify + e2e |
| Lighthouse (live) | A11y **100** · Best Practices **100** · SEO **100** · Perf ~88–96 |

---

## 4. Open / deferred items

| Item | Status | Owner | Trigger |
|------|--------|-------|---------|
| App Store / Play URLs | ⏸ deferred | business + mobile | App store listings live |
| Mobile deep-link values (Team ID, package, SHA-256, scheme) | ⏸ deferred | mobile team | Before deep-link launch |
| Content reconciliation sign-off (48→54 count, 6 vs 9 bundle, 7-cat filter) | ⏳ open | PM | Pre-launch copy freeze |
| `stalio.app` domain (if chosen over subdomain) | ⏸ optional | business | Brand decision |
| Part 2 (community/admin) | ⏸ deferred / likely **Reddit** | business | Not near-term |
| Bump CI action versions (Node-20 deprecation warning) | ⏳ minor | eng | Cosmetic |

---

## 5. Infrastructure reference

| Item | Value |
|------|-------|
| Host | Cloudflare Pages, project `stalio-web` |
| Cloudflare account ID | `c72d08097bfe52da0d54af4857520548` |
| Production domain | `stalio.orbacetech.com` (CNAME → `stalio-web.pages.dev`, proxied) |
| Default domain | `stalio-web.pages.dev` |
| GitHub secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| GitHub variables | `CLOUDFLARE_DEPLOY=true`, `NEXT_PUBLIC_SITE_URL=https://stalio.orbacetech.com` |
| Build / output | `pnpm build` → `out/` |
| Cost | $0 (static, free Cloudflare plan) |

---

## 6. Related documents

- `00_PROGRAM_OVERVIEW.md`, `01_REVISED_TECH_STACK.md`, `02_ACCOUNTS_AND_CONFIG.md`
- `part1/PART1_PROJECT_PLAN.md`, `DATA_MODEL.md`, `DESIGN_SYSTEM.md`, `FILE_STRUCTURE.md`, `CONTENT_RECONCILIATION.md`, `HABIT_CONTENT_TODO.md`
- `part1/TEST_CASES.md` (this session)
- `SERVICES_RATIONALE.md`, `RUNBOOK_setup-webpage-under-orbacetech.md`, `RUNBOOK_google-search-console.md`
- `SESSION_SUMMARY.md`, `LESSONS_LEARNED.md` (this session)
