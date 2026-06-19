# Lessons Learned — Stalio Web Part 1

Concrete, reusable takeaways from building/shipping Part 1. Written for the next Orbace project.

---

## Cloudflare & deployment

1. **Account-owned API tokens (`cfat_` prefix) verify at the *account* endpoint.**
   `GET /accounts/{id}/tokens/verify` — not `/user/tokens/verify` (the latter returns "Invalid API Token" for these). Don't declare a token bad until you test the account-scoped endpoint.

2. **Cloudflare Pages 308-redirects `/x.html` → `/x`.**
   Google Search Console's HTML-**file** verification wants the exact `.html` to return 200. Fix with a `_redirects` rewrite (status 200): `/file.html  /file  200`.

3. **Adding a Pages custom domain via the API registers it but does *not* always create the DNS record.**
   The wrangler OAuth token could manage Pages but **not** edit Zone DNS. The CNAME had to be created separately (dashboard or a token with `Zone:DNS:Edit`). For a same-account zone, the **dashboard** custom-domain flow does both in one step — prefer it.

4. **Verify which account you're authenticated to before deploying.**
   `wrangler whoami` showed an empty account table, but `wrangler pages project list` revealed the real Orbace account. Confirm account access (and that it's the *right* account) before `pages deploy` — never deploy to an unknown/sandbox account.

5. **Cloudflare auto-injects its Web Analytics beacon** (`static.cloudflareinsights.com`). A strict CSP (`script-src 'self'`) blocks it and logs a console error (dings Lighthouse Best Practices). Allowlist `https://static.cloudflareinsights.com` (script) + `https://cloudflareinsights.com` (connect) — or disable the injection.

---

## Next.js static export (`output: 'export'`)

6. **Middleware and `next.config headers()` don't run** under static export → move security headers to `public/_headers` (Cloudflare Pages).
7. **`robots.ts` / `sitemap.ts` need `export const dynamic = "force-static"`** or the export build fails.
8. **`useSearchParams()` must be wrapped in `<Suspense>`** (URL-synced filter state).
9. **Dynamic routes need `generateStaticParams`** (+ `dynamicParams = false` to lock the set).
10. **`next/image` needs `images.unoptimized: true`** for export.

---

## Architecture & scope

11. **Match infrastructure to the *actual* requirement, not the default stack.** A read-only 54-row "library" doesn't need managed Postgres — a build-time CSV→JSON pipeline is simpler, faster, free, and removes a whole class of runtime/ops risk. Re-derived this as ADR-8 and dropped Supabase/Drizzle from Part 1.
12. **Use infra the org already owns** (Cloudflare) before onboarding a new vendor (Vercel/Supabase).
13. **Keep deferred work dormant but preserved.** Part 2 DB schema lives under `part2-reference/` — ready if needed, out of the build, zero rework to add later.

---

## Tailwind v4

14. **Undefined `@theme` tokens fail silently.** `rounded-r16` / `var(--color-mint-bg)` produced no error and no style until the token was added to `@theme`. Define tokens before use and spot-check visually.

---

## Data handling

15. **Merge multiple source files on a stable key, and make missing data obvious.** The two habit CSVs merged on `habit_id`; columns present in neither were filled with a `[TODO-PM]` sentinel plus a computed `data_status` column — a clean, filterable PM handoff that round-tripped cleanly.
16. **Reconcile spec-vs-data discrepancies early and derive from data.** Mockup said 48 habits / 6 bundle; production data had 54 / 9. We derive these counts from the dataset at build time so copy can never drift.

---

## Quality & process

17. **Lighthouse simulated-mobile LCP is noisy** (2.7–3.3s run-to-run for the same static page). Trust CLS/TBT + real-device reasoning; don't chase the simulated number with risky changes.
18. **Read the Lighthouse JSON for exact failing nodes** (`color-contrast`, `label-content-name-mismatch`, `errors-in-console`) instead of guessing — fixes were surgical and verifiable.
19. **`aria-label` must contain the visible text** (WCAG 2.5.3 "Label in Name"). A button labeled `"Move your body, done"` with visible text "Move your body … 30 min" failed; dropping the custom label and using `aria-pressed` fixed it.
20. **Keep the todo list updated as you go.** We let it go stale mid-build and the stakeholder noticed only 3 checks. Update statuses in real time.
21. **Don't store short-lived OAuth tokens as CI secrets.** They expire/refresh; CI needs a dedicated scoped API token (Pages:Edit).
22. **`@tabler/icons-react`: avoid importing the `IconProps` type** (fragile across versions). Use a local structural type for icon components.

---

## Security

23. **Never echo secrets.** Set them via stdin/`gh secret set`. If a token is shared in chat, note it can be rotated after wiring.
24. **Privacy by default helped.** No accounts, no server writes, only functional `localStorage` → minimal privacy surface and a simple, honest privacy page.
