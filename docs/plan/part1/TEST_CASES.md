# Stalio Web — Part 1 Test Cases (Automated + Manual UAT)

Covers the static marketing site + habit library. Two layers:
- **Automated** — run in CI on every push (must be green to merge/deploy).
- **Manual UAT** — human verification before sign-off / launch copy freeze.

Live target: https://stalio.orbacetech.com · Local: `pnpm dev` → http://localhost:3000

---

## A. Automated tests

### A.1 Unit (Vitest) — `pnpm test`

| ID | File | Asserts |
|----|------|---------|
| U-01 | `tests/unit/color-group.test.ts` | `Health & Body`+身 → `health` |
| U-02 | " | `Health & Body`+心 → `mental` (Body/Mind split) |
| U-03 | " | Productivity/Financial/Social/Home map to correct color groups |
| U-04 | " | Unknown category group throws |
| U-05 | `tests/unit/filters.test.ts` | All 54 habits returned with default filters |
| U-06 | " | `bundleOnly` → exactly 9, all `isDefaultBundle` |
| U-07 | " | Search "floss" finds Floss, excludes Drink water |
| U-08 | " | Color-group filter returns only that group |
| U-09 | " | `categoryCounts.all` = 54; per-group sum = 54 |
| U-10 | " | Counts respect active search |

### A.2 End-to-end (Playwright) — `pnpm test:e2e` (projects: chromium + mobile)

| ID | File | Scenario | Expected |
|----|------|----------|----------|
| E-01 | `tests/e2e/home.spec.ts` | Load `/` | Hero "Build the life you keep promising yourself" + "Download free" CTA visible |
| E-02 | " | Load `/library`, see seeded habit | Heading "Every habit. Researched…", "Drink water" present |
| E-03 | " | Search "floss" | "Floss" shown, "Drink water" removed (count 0) |
| E-04 | " | Load `/library/H001` | "Drink water" heading + "Add to Stalio app" button |

### A.3 Data validation — `pnpm habits:check`
- 54 habits; every `tracking_ui_type` in enum; every `difficulty` in enum; every `color_group` derivable; no empty required content fields; default-bundle = 9; 6 color groups.

### A.4 Build & CI gates
- `pnpm typecheck` (tsc strict, 0 errors) · `pnpm lint` (0 warnings) · `pnpm build` (static export, 61 pages) · GitHub Actions `verify` + `e2e` jobs green.

> **Run all locally:** `pnpm habits:check && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e`

---

## B. Manual UAT test cases

Status legend: ✅ verified this session · ⬜ to re-verify at sign-off. Run on desktop + mobile widths.

### B.1 Homepage

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-01 | Open `/` | Hero headline (Instrument Serif), sub-copy, both CTAs above the fold | ✅ |
| M-02 | Read stats row | Shows **54** habits / **9** pre-loaded / **0** min (derived from data) | ✅ |
| M-03 | Tap habit rows in the phone mockup | Each toggles checked/unchecked; progress bar + % update live | ✅ |
| M-04 | Review features section | 6 cards with correct icons/colors/titles | ✅ |
| M-05 | Click "Browse habit library" / teaser CTA | Navigates to `/library` | ✅ |
| M-06 | Click "Download free" (no store URL yet) | Falls back to `#download` anchor, no broken link | ✅ |

### B.2 Habit library `/library`

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-10 | Open `/library` | All 54 habit cards render; "Showing 54 habits" | ✅ |
| M-11 | Type a query in search | List + count narrow live; matches name/category/what/why | ✅ |
| M-12 | Click a category | Only that color group shown; counts reflect selection | ✅ |
| M-13 | Click a tracking-method pill | List filters to that bucket | ✅ |
| M-14 | Click a difficulty pill | Filters to easy/moderate/hard | ✅ |
| M-15 | Toggle "Default bundle only" | Shows 9 bundle habits | ✅ |
| M-16 | Change Sort (A–Z, easiest, bundle…) | Order updates accordingly | ✅ |
| M-17 | Apply filters, copy URL, open in new tab | Same filter state restored (URL-synced) | ✅ |
| M-18 | Filters with no match | Empty state + "Clear all filters" works | ✅ |
| M-19 | Click a card's info/expand button | Expands in place (no navigation) | ✅ |
| M-20 | In expanded card | Anatomy Cue→Behaviour→Reward, 2-min box, tracking demo, what/why/research (+ source link) | ✅ |
| M-21 | Verify tracking demo per type | boolean/duration/volume/scale/streak/time/note each renders a sensible mini-viz | ✅ |

### B.3 Add-to-app & persistence

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-30 | Click "Add to Stalio app" on a card | Button turns mint→checked; toast "added to your Stalio app" | ✅ |
| M-31 | Reload the page | Added state persists (localStorage) | ✅ |
| M-32 | Click add again on an added habit | Toast "already in your app" | ✅ |
| M-33 | With store URL set (future) | Opens store with `utm_source=web_library&utm_habit=<id>` | ⬜ (deferred) |

### B.4 Per-habit pages & SEO

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-40 | Open `/library/H001` … any habit | Full detail renders server-side (breadcrumb, anatomy, 2-min, tracking, what/why/research, add) | ✅ |
| M-41 | View source | Unique `<title>`, meta description, canonical `https://stalio.orbacetech.com/library/<id>`, Article+BreadcrumbList JSON-LD | ✅ |
| M-42 | `GET /sitemap.xml` | 200, application/xml, 56 URLs incl. all habits | ✅ |
| M-43 | `GET /robots.txt` | Allows crawl, references sitemap | ✅ |

### B.5 Utility, legal, errors

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-50 | Visit a bad URL | Branded 404 with library/home links | ✅ |
| M-51 | Open `/privacy`, `/terms` | Render; footer links resolve (no 404) | ✅ |
| M-52 | Check favicon | Mint check icon shows | ✅ |

### B.6 Responsive

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-60 | View `/` and `/library` at 375px / 768px / 1280px | Layout adapts; no horizontal scroll; sidebar stacks on mobile | ✅ |
| M-61 | Mobile e2e project | Passes on Pixel 5 viewport | ✅ |

### B.7 Accessibility (WCAG 2.1 AA)

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-70 | Tab from page top | "Skip to content" link appears on focus and jumps to main | ✅ |
| M-71 | Keyboard-navigate library | All filters, cards, expand, add, sort reachable + operable; visible focus ring | ✅ |
| M-72 | Icon-only buttons | Have accessible names (aria-label) | ✅ |
| M-73 | Color contrast | Body/UI text meets AA (Lighthouse a11y 100) | ✅ |
| M-74 | `prefers-reduced-motion` on | Animations/transitions suppressed | ✅ |

### B.8 Security / headers / deep-link

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-80 | `curl -I /` | CSP + `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` present | ✅ |
| M-81 | `GET /.well-known/apple-app-site-association` | 200, `Content-Type: application/json`, no redirect | ✅ |
| M-82 | `GET /.well-known/assetlinks.json` | 200, valid JSON | ✅ |
| M-83 | `http://stalio.orbacetech.com/` | 301 → https | ✅ |
| M-84 | Browser console on live site | No errors (CSP allows Cloudflare Insights) | ✅ |

### B.9 Deployment / CI

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| M-90 | Push to `main` | CI verify+e2e green; auto-deploy job deploys to production | ✅ |
| M-91 | Cloudflare dashboard → Deployments | New deployment recorded; rollback available | ✅ |

---

## C. Pre-launch sign-off checklist (manual)

- [ ] Content reconciliation decisions confirmed (count, bundle, filter taxonomy) — see `CONTENT_RECONCILIATION.md`
- [ ] App Store / Play URLs set; "Download" CTAs go live
- [ ] Deep-link `.well-known` placeholders replaced with real Team ID / package / SHA-256 + verified on real devices (M-33)
- [ ] Final brand/legal copy on /privacy, /terms
- [ ] GSC coverage shows pages indexed
