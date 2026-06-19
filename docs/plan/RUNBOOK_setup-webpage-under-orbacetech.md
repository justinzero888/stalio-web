# Runbook — Set Up a Web Page Under `orbacetech.com` (Cloudflare Pages)

**Audience:** Orbace Technologies engineering
**Purpose:** Repeatable steps to publish a site/page (e.g. `stalio.orbacetech.com`) on Cloudflare Pages, matching how `blinkingchorus.com` and `orbacetech.com` are already deployed.
**Cloudflare account ID:** `c72d08097bfe52da0d54af4857520548`

---

## 1. How the existing Orbace sites are set up (the pattern to copy)

Verified from the Cloudflare account:

| Pages project | Custom domains | Git Provider | Deploy method | Prod branch |
|---------------|----------------|--------------|---------------|-------------|
| `orbacetech` | `orbacetech.com`, `www.orbacetech.com` | No | Direct upload | `main` |
| `blinkingchorus` | `blinkingchorus.com`, `www.blinkingchorus.com` | No | Direct upload | `main` |
| `stalio-web` | `stalio-web.pages.dev` (custom domain TBD) | No | Direct upload | `main` |

Key facts about the pattern:
- **One Cloudflare Pages project per site.**
- **Direct upload** (not Git-connected): a static build folder is uploaded with `wrangler pages deploy <dir>`. Each deployment is tagged with the git commit hash as its "Source".
- **DNS for every Orbace domain is already on Cloudflare.** That means a Pages **custom domain** (apex, `www`, or any subdomain) is attached in a couple of clicks and Cloudflare **auto-creates the DNS record and provisions the TLS certificate**.
- Production branch is `main`.

> **"Under orbacetech.com" = a subdomain custom domain** (e.g. `stalio.orbacetech.com`) attached to that site's Pages project. This mirrors `blinkingchorus.com`, but as a subdomain of the existing `orbacetech.com` zone. (Cloudflare Pages does not serve sites on a sub-path like `orbacetech.com/stalio`; use a subdomain.)

---

## 2. Prerequisites

- Access to the Orbace Cloudflare account (dashboard login, or a `CLOUDFLARE_API_TOKEN` with **Pages: Edit**).
- The site builds to a **static output folder** (for a Next.js static-export site that's `out/`; for Vite/CRA it's `dist`/`build`).
- `orbacetech.com` is in this Cloudflare account as a zone (it is).
- `wrangler` (`pnpm dlx wrangler` or installed as a dev dep) if using the CLI track.

---

## 3. Decide the hostname

Pick the subdomain, e.g.:
- `stalio.orbacetech.com` (recommended for Stalio)
- `<project>.orbacetech.com` for any future page.

Set the site's canonical URL to this hostname **before the production build** so `sitemap.xml`, canonical tags, and Open Graph URLs are correct:

```bash
# Next.js example — the app reads NEXT_PUBLIC_SITE_URL at build time
export NEXT_PUBLIC_SITE_URL=https://stalio.orbacetech.com
```

---

## 4. Runbook — Track A: Dashboard (recommended, no token handling)

This is the most reliable path and auto-manages DNS + SSL.

1. **Build the static site locally (or in CI):**
   ```bash
   pnpm install
   NEXT_PUBLIC_SITE_URL=https://stalio.orbacetech.com pnpm build   # outputs ./out
   ```
2. **Create the Pages project** (first time only): Cloudflare dashboard → **Workers & Pages → Create → Pages → Upload assets** → name it (e.g. `stalio-web`) → upload the `out` folder. (Or connect to Git if you want auto-deploys — see §7.)
3. **Attach the custom domain:** open the project → **Custom domains → Set up a custom domain** → enter `stalio.orbacetech.com` → **Activate**. Because `orbacetech.com` is in this account, Cloudflare automatically:
   - creates the `CNAME stalio → <project>.pages.dev` (proxied) record in the `orbacetech.com` zone, and
   - issues the TLS certificate.
4. **Verify** (give it ~1–2 min for cert/DNS):
   ```bash
   curl -I https://stalio.orbacetech.com
   ```

---

## 5. Runbook — Track B: Wrangler CLI (what we used for stalio-web)

```bash
# 0) authenticate (one of):
#    wrangler login            # interactive OAuth, or
#    export CLOUDFLARE_API_TOKEN=<token with Pages:Edit>

# 1) build static output
NEXT_PUBLIC_SITE_URL=https://stalio.orbacetech.com pnpm build      # -> ./out

# 2) create the project (first time only)
pnpm exec wrangler pages project create stalio-web --production-branch=main

# 3) deploy the build to production
pnpm exec wrangler pages deploy out --project-name=stalio-web --branch=main --commit-dirty=true
#    -> prints https://<hash>.stalio-web.pages.dev  and updates https://stalio-web.pages.dev
```

**Custom domain:** attach it in the **dashboard** (§4 step 3) — this is the reliable way and auto-creates the DNS record + cert. (Domain attachment is a dashboard/API operation, not part of `pages deploy`.)

Helpful CLI checks:
```bash
pnpm exec wrangler pages project list
pnpm exec wrangler pages deployment list --project-name=stalio-web
```

---

## 6. Stalio-specific quick path (project already exists)

`stalio-web` is already created and deployed (`stalio-web.pages.dev`). To put it under `orbacetech.com`:

1. Decide: **`stalio.orbacetech.com`** (recommended) or use the standalone `stalio.app` later.
2. Rebuild with the right canonical URL and redeploy:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://stalio.orbacetech.com pnpm build
   pnpm exec wrangler pages deploy out --project-name=stalio-web --branch=main --commit-dirty=true
   ```
3. Dashboard → `stalio-web` → **Custom domains** → add `stalio.orbacetech.com` → Activate.
4. Verify: `curl -I https://stalio.orbacetech.com` and submit `https://stalio.orbacetech.com/sitemap.xml` to Google Search Console.

> When you later move to `stalio.app`, repeat: set `NEXT_PUBLIC_SITE_URL=https://stalio.app`, rebuild/redeploy, add the custom domain, and optionally 301 the old host.

---

## 7. Optional — auto-deploy on every push (CI)

Instead of manual `wrangler pages deploy`, the repo includes `.github/workflows/deploy.yml`. To enable:

1. GitHub repo → **Settings → Secrets and variables → Actions**:
   - Secret `CLOUDFLARE_API_TOKEN` = a token with **Pages: Edit**.
   - Secret `CLOUDFLARE_ACCOUNT_ID` = `c72d08097bfe52da0d54af4857520548`.
   - Variable `NEXT_PUBLIC_SITE_URL` = `https://stalio.orbacetech.com`.
   - Variable `CLOUDFLARE_DEPLOY` = `true` (the workflow is gated on this).
2. Push to `main` → the workflow builds and `wrangler pages deploy out`s automatically.

(Alternatively, connect the GitHub repo directly in the Pages dashboard for Cloudflare-native CI — build command `pnpm build`, output dir `out`.)

---

## 8. Rollback

Every deploy is retained. In the dashboard → project → **Deployments**, open a previous good deployment → **Rollback to this deployment**. Or redeploy a known-good commit's build with `wrangler pages deploy`.

---

## 9. Reference values

| Item | Value |
|------|-------|
| Cloudflare account ID | `c72d08097bfe52da0d54af4857520548` |
| Stalio Pages project | `stalio-web` |
| Stalio default domain | `https://stalio-web.pages.dev` |
| Proposed Orbace subdomain | `stalio.orbacetech.com` |
| Production branch | `main` |
| Build command | `pnpm build` |
| Output directory | `out` |
| Build-time site URL var | `NEXT_PUBLIC_SITE_URL` |
