# Accounts, Config & Business-Owner Action Items

This is the checklist of everything the **business owner / Orbace Technologies** must create, decide, or hand over so engineering can build and ship. Items are grouped by launch and flagged **[BLOCKER]** (work cannot complete without it) or **[NEEDED-BY-LAUNCH]** (build can proceed; required before going public).

> Engineering can start Part 1 immediately using free-tier personal/dev accounts. The items below are what only the business owner can provide or decide.

### Current status (latest update)
- **Architecture:** Part 1 is now a **fully static site, no database** (ADR-8). Habit content is compiled from CSV at build time.
- **GitHub repo:** ✅ created — `https://github.com/justinzero888/stalio-web.git`.
- **Hosting:** **Cloudflare Pages** (already owned — `orbacetech.com`, Blinking Chorus). No Vercel account needed for Part 1.
- **Vercel + Supabase:** **deferred** — not required for the static Part 1 site. Only revisited if a self-hosted community is built (current plan leans toward a **Reddit community** instead).
- **PostHog:** optional / opt-in — see `SERVICES_RATIONALE.md`.
- **Mobile app:** in test, **launching next week**; deep-link values (C1–C4) come from the mobile team near launch → `public/.well-known/` placeholders are in place; store-fallback used until provided.

---

## A. Decisions needed from the business owner (Part 1)

| # | Decision | Why it matters | Default if no answer |
|---|----------|----------------|----------------------|
| A1 | **Production domain:** `stalio.app` (own domain) vs `stalio.orbacetech.com` | PRD open question #1. Affects SEO, OG URLs, deep-link well-known files | Pilot on `stalio.orbacetech.com`; **register `stalio.app` ($18/yr)** for public launch (recommended) |
| A2 | **Habit count copy:** mockup says "48 habits", CSV ships **54** | Hero stats row + library count must be correct | Use **54** (production truth). See `CONTENT_RECONCILIATION.md` |
| A3 | **Default-bundle count:** PRD says "6 pre-loaded", CSV marks **9** as `is_default_bundle=TRUE` | Homepage stat "6 pre-loaded" + library "default bundle" filter | Reconcile to a single number before launch (see reconciliation doc) |
| A4 | **App store URLs** (iOS App Store + Google Play listing links) | Every "Download free" / store-fallback CTA | **[BLOCKER for launch]** — links cannot be hardcoded without these |
| A5 | **GA4 vs PostHog only** (PRD open question #5) | Analytics setup | PostHog only in Part 1 (recommended); add GA4 only if marketing requires |

---

## B. Accounts the business owner must own (org-level)

These should be created under an **Orbace Technologies organization/email**, not a personal developer account, so ownership survives staff changes.

### Part 1 — required

| # | Service | What's needed | Flag | Cost |
|---|---------|---------------|------|------|
| B1 | **GitHub** | ✅ repo `justinzero888/stalio-web` created; add engineer access | [DONE] | Free |
| B2 | **Cloudflare Pages** | Create a Pages project on the existing Cloudflare account; connect the GitHub repo (build `pnpm build`, output `out/`) | [BLOCKER — hosting] | Free |
| B3 | **Domain on Cloudflare** | Point the site domain (already on Cloudflare) at the Pages project | [NEEDED-BY-LAUNCH] | Free |
| B4 | **Vercel + Supabase** | ⏸️ **Deferred** — not needed for the static Part 1 site. Only for a future self-hosted community (Part 2) | [DEFERRED] | — |
| B5 | **Domain registrar** | Register/own `stalio.app` (if A1 = own domain) | [NEEDED-BY-LAUNCH] | ~$18/yr |
| B6 | **PostHog** | Project (Cloud); region (US/EU) — **only if** event/funnel analytics wanted at launch | [OPTIONAL — see SERVICES_RATIONALE] | Free (1M events/mo) |
| B7 | **Sentry** | Project for the Next.js app — **deferrable** (small error surface on read-only Part 1) | [OPTIONAL — see SERVICES_RATIONALE] | Free (5k errors/mo) |
| B8 | **Google Search Console** | Verify the production domain; submit sitemap | [NEEDED-BY-LAUNCH] | Free |

### Part 2 — required later (do **not** set up for Part 1)

| # | Service | What's needed | Cost |
|---|---------|---------------|------|
| B9 | **Clerk** | Application; create the single admin user(s) | Free (50k MAU) |
| B10 | **Upstash** | Redis database (rate limiting) | Free (500k cmds/mo) |
| B11 | **Resend** | Account + **verified sending domain** (DNS records) for admin emails | Free (3k emails/mo) |

---

## C. Deep-link / mobile coordination (Part 1, ADR-5)

The "Add to Stalio app" flow needs values only the mobile team / business owner can provide:

| # | Item | Used for | Flag |
|---|------|----------|------|
| C1 | **iOS Team ID + bundle identifier** | `apple-app-site-association` file | [BLOCKER for deep-link] |
| C2 | **Android package name + SHA-256 signing cert fingerprint(s)** | `.well-known/assetlinks.json` | [BLOCKER for deep-link] |
| C3 | **App custom URL scheme + Universal/App Link path** (e.g. `stalio://habit/[id]` and `https://stalio.app/habit/[id]`) | Deep-link href construction | [BLOCKER for deep-link] |
| C4 | **Habit ID contract** — confirm web `habit_id` (H001…H054) matches the app's "Add habit" identifiers | Pre-loading the right habit in-app | [BLOCKER for deep-link] |

> If C1–C4 are not ready at Part 1 launch, the "Add to app" button degrades gracefully to a store link with UTM params (no pre-loaded habit). This is an acceptable launch fallback but should be flagged to the owner.

---

## D. Brand / content assets (Part 1)

| # | Asset | Used for | Flag |
|---|-------|----------|------|
| D1 | Stalio logo (SVG, light + dark) + favicon set | Header, OG, PWA icons | [NEEDED-BY-LAUNCH] |
| D2 | Default social share image / per-page OG template | `og:image` | [NEEDED-BY-LAUNCH] |
| D3 | Final hero + features copy sign-off | Homepage | [NEEDED-BY-LAUNCH] |
| D4 | **"Research backing" content** per habit (not in CSVs) | Expanded habit card section | [DECISION] — author, derive from `why_do_it_benefits`, or hide the section in Part 1 |
| D5 | Cookie-consent / privacy copy (Orbace privacy standard) | Consent banner | [NEEDED-BY-LAUNCH] |
| D6 | Legal: Privacy Policy + Terms URLs | Footer | [NEEDED-BY-LAUNCH] |

---

## E. Environment variables (single source of truth)

Set in **Cloudflare Pages** project settings (Production + Preview). All Part 1 vars are `NEXT_PUBLIC_*` (inlined into the static export at build time).

### Part 1 (static site — all build-time, public)

| Variable | Owner provides | Notes |
|----------|----------------|-------|
| `NEXT_PUBLIC_SITE_URL` | A1 | `https://stalio.app` or pilot URL |
| `NEXT_PUBLIC_APP_STORE_URL` | A4 | iOS store link |
| `NEXT_PUBLIC_PLAY_STORE_URL` | A4 | Google Play link |
| `NEXT_PUBLIC_DEEPLINK_SCHEME` | C3 | e.g. `stalio` |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | B6 | only if PostHog enabled (optional) |

Deep-link identifiers (`IOS_TEAM_ID`, `IOS_BUNDLE_ID`, `ANDROID_PACKAGE_NAME`, `ANDROID_SHA256_FINGERPRINT` — C1/C2) are not env vars in a static build; they go directly into `public/.well-known/apple-app-site-association` and `assetlinks.json` (replace the `REPLACE_*` placeholders).

### Part 2 (add later — not in Part 1)

| Variable | Owner provides |
|----------|----------------|
| `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | B9 |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | B10 |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | B11 |
| `ADMIN_NOTIFY_EMAIL` | business owner |
| `IP_HASH_SALT` | engineering (secret) — salted IP hashing |

---

## F. Cost guardrails

Part 1 on Cloudflare Pages is **$0** (static hosting on the free plan, on the account you already own). There are no spend meters to cap. The Vercel/Supabase/Upstash guardrails from the tech doc only apply if a future self-hosted community (Part 2) reintroduces those services.

---

## G. Minimum unblock set to start Part 1 today

To begin engineering **right now**, only these are strictly required:
1. **B1 GitHub repo** + engineer access. ✅ done.
2. **B2 Cloudflare Pages** project connected to the repo (free).
3. Decision **A2/A3** acknowledged (54 habits / reconcile default-bundle count).

Everything else (store URLs, deep-link values, brand/legal assets, PostHog) can be supplied during the build and only blocks the **public launch** milestone, not development.

---

## H. Creating the Cloudflare Pages project (on the Orbace account)

The repo is build-ready (`pnpm build` → static `out/`). Pick **one** path to create the project on the **Orbace Cloudflare account** (the one already hosting `orbacetech.com` / Blinking Chorus). A sandbox token in the dev environment is **not** that account, so engineering cannot create it for you blind.

**Path 1 — Dashboard, Git-connected (recommended, auto-deploys on push):**
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick `justinzero888/stalio-web`.
2. Build command: `pnpm build` · Build output directory: `out` · Production branch: `main`.
3. Environment variables: add the `NEXT_PUBLIC_*` from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL`).
4. Save & Deploy. Then **Custom domains** → add `stalio.app` or `stalio.orbacetech.com`.

**Path 2 — CI deploy via GitHub Actions** (workflow `.github/workflows/deploy.yml` already added):
Add two **GitHub repo secrets** and (optionally) repo **variables**:
| Secret | What | Where to get it |
|--------|------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Token with **"Cloudflare Pages: Edit"** permission | Cloudflare → My Profile → API Tokens → Create |
| `CLOUDFLARE_ACCOUNT_ID` | The Orbace account ID | Cloudflare dashboard → right sidebar / URL |
| `NEXT_PUBLIC_SITE_URL` (variable) | Production URL | you decide (A1) |

On push to `main`, the workflow builds and `wrangler pages deploy` **auto-creates** the `stalio-web` Pages project.

**Path 3 — Hand engineering a token:** provide a `CLOUDFLARE_API_TOKEN` (Pages:Edit) + account ID and we run `pnpm pages:deploy` directly.

> Recommendation: **Path 1** — fewest moving parts, native preview deploys per PR, no token handling.
