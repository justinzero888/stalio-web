# Third-Party Services — Why Each, What's Needed, What's Optional

Answering: *"Why do we need PostHog, Sentry, etc., and what exactly is needed?"* — written for a calm, minimal, cost-first stack. Each service is rated **Required**, **Recommended (can defer)**, or **Optional**, with what it does, what it replaces, and the exact config needed.

> **Decision (current):** Part 1 is a **fully static site with no database** (ADR-8), so it ships on **Cloudflare Pages** (which you already own) — **no Vercel and no Supabase**. The only other service is free **Google Search Console** for SEO. **PostHog** is optional/opt-in. The sections below explain the reasoning and what each service would be for; Vercel + Supabase are documented as *future / only-if-a-self-hosted-community-is-built* (current plan leans toward a **Reddit community** instead).

---

## You already have it

### Cloudflare — **Required, no new account**
- **Why:** DNS, SSL, DDoS protection for the site's domain. You already run `orbacetech.com` and Blinking Chorus on it.
- **Exactly needed:** add the site's hostname as a DNS record pointing to Vercel. If A1 = `stalio.app`, add `stalio.app` as a new zone; if `stalio.orbacetech.com`, just add a `CNAME`/record under the existing `orbacetech.com` zone → no new zone, no cost.
- **Note:** keep Cloudflare proxy settings compatible with Vercel (Vercel issues its own certs; use DNS-only or follow Vercel's Cloudflare guide to avoid redirect loops).

---

## Core platform (cannot ship without these)

### Vercel — **Required**
- **Why:** hosting + CDN + per-PR preview deploys for Next.js. This is the runtime.
- **Built-in extras** that reduce the need for other services: **Vercel Web Analytics** (privacy-friendly pageview/traffic) and **Speed Insights** (real Core Web Vitals from real users). These can cover basic traffic + CWV reporting *without* PostHog.
- **Exactly needed:** account/team on the Orbace org, import the GitHub repo, set env vars, connect the domain. Free for pilot; Pro ($20/mo) at public launch (commercial use + custom domain SLAs).

### Supabase — **Required**
- **Why:** the Postgres database that stores the 54 habits (and, in Part 2, submissions/posts/likes).
- **Exactly needed:** one project (pick region near primary audience), the connection string for `DATABASE_URL`. Free for pilot; Pro ($25/mo) at launch.

---

## Observability & analytics (valuable, but deferrable for a read-only Part 1)

### PostHog — **Recommended (can defer / substitute)**
- **What it does:** product analytics — funnels and event tracking. The PRD KPIs ("drive downloads", "habit add clicks") are measured here via events like `habit_add_clicked` and the discover→download funnel.
- **Why not just Vercel Analytics:** Vercel Web Analytics tells you *traffic*; it does **not** do funnels or custom events like "which habit was added." If you want to know *what converts*, you need event analytics.
- **Substitutes:** (a) **defer** PostHog to Part 2 and launch with Vercel Web Analytics only; (b) GA4 if marketing already standardises on it. We do **not** recommend running both GA4 and PostHog.
- **Exactly needed (if used):** a PostHog Cloud project, region choice (US/EU), and `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`. Free up to 1M events/mo.

### Sentry — **Recommended (can defer for Part 1)**
- **What it does:** captures runtime errors/exceptions with stack traces so you find bugs before users report them.
- **Why it's lower priority for Part 1:** Part 1 is a **static, read-only** site with no forms, no auth, no user writes — the error surface is small. Vercel's build/runtime logs cover most of it initially.
- **Why it matters more in Part 2:** once there are submission forms, likes, and an admin dashboard (real server logic), Sentry earns its place.
- **Exactly needed (if used):** a Sentry project; `SENTRY_DSN` (public), and `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT` (server-only, for source-map upload). Free up to 5k errors/mo.

### Google Search Console — **Recommended (free, low effort)**
- **What it does:** confirms Google can crawl the site, lets you submit the sitemap, and reports search performance. Directly serves the PRD goal of being the "authoritative habit resource."
- **Exactly needed:** verify the production domain (a DNS TXT record via Cloudflare or a meta tag), then submit `sitemap.xml`. No cost, no SDK in the app.

---

## Part 2 only — do **not** set up now

These are not used by the read-only Part 1 site and add billing meters/config for nothing if created early:

| Service | Purpose (Part 2) | Why not now |
|---------|------------------|-------------|
| **Clerk** | Auth for the single admin moderation dashboard | No `/admin` and no login in Part 1 |
| **Upstash Redis** | Per-IP rate limiting on public submission/like endpoints | Part 1 has no write endpoints to abuse |
| **Resend** | Transactional email to notify admin of new submissions | No submissions in Part 1 |

---

## Recommendation (given next-week launch + minimal-stack philosophy)

**Launch Part 1 on three services you can stand up immediately:**
1. **Vercel** (hosting) — use built-in Web Analytics + Speed Insights for traffic & CWV.
2. **Supabase** (database).
3. **Cloudflare** (DNS — already yours; just add the record).
4. **Google Search Console** — free, add it for SEO.

**Defer the decision on PostHog and Sentry** until you confirm whether you need event-level conversion analytics at launch:
- If you want to measure *which habits drive adds / downloads from day one* → add **PostHog**.
- If you want crash visibility on the (small) Part 1 surface → add **Sentry**, otherwise add it with Part 2 where it matters more.

This keeps the first launch to the minimum number of accounts while preserving the PRD's measurement goals as an opt-in. Tell us your call on PostHog/Sentry and we'll wire (or skip) them accordingly.
