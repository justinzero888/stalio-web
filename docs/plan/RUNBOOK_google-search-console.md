# Runbook — Submit Stalio to Google Search Console

**Site:** `https://stalio.orbacetech.com`
**Sitemap:** `https://stalio.orbacetech.com/sitemap.xml`
**Goal:** verify ownership, submit the sitemap, confirm Google indexes the homepage + library + all 54 habit pages.

---

## 1. Choose a property type

| Type | Covers | Verify via | Use when |
|------|--------|-----------|----------|
| **URL-prefix** `https://stalio.orbacetech.com/` | exactly that origin | HTML tag *(wired into our site)*, HTML file, DNS TXT, GA | **Recommended here** — simplest, site-controlled |
| **Domain** `stalio.orbacetech.com` (or `orbacetech.com`) | all subdomains + http/https | DNS TXT only | If you want one property across all protocols/subdomains |

Recommendation: **URL-prefix `https://stalio.orbacetech.com/` with the HTML-tag method** — the site already supports it via an env var, so verification survives every redeploy.

---

## 2. Add the property & get the token

1. Go to https://search.google.com/search-console → **Add property**.
2. Choose **URL prefix**, enter `https://stalio.orbacetech.com` → **Continue**.
3. Under verification methods pick **HTML tag**. Google shows:
   `<meta name="google-site-verification" content="XXXXXXXXXXXX" />`
   Copy only the **`content` value** (the `XXXXXXXXXXXX` token).

---

## 3. Add the token to the site (engineering)

The token is wired through an env var — no code change needed, just set it and redeploy.

1. Set `NEXT_PUBLIC_GSC_VERIFICATION=<token>` (locally for a manual deploy, or as a Cloudflare Pages / GitHub Actions env var).
2. Rebuild + redeploy:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://stalio.orbacetech.com \
   NEXT_PUBLIC_GSC_VERIFICATION=<token> \
   pnpm build
   pnpm exec wrangler pages deploy out --project-name=stalio-web --branch=main --commit-dirty=true
   ```
3. Confirm the tag is live:
   ```bash
   curl -s https://stalio.orbacetech.com/ | grep google-site-verification
   ```
4. Back in Search Console → **Verify**.

> Alternative (no redeploy): use the **DNS TXT** method instead — add the TXT record Google gives you to the `orbacetech.com` zone in Cloudflare DNS, then Verify. (Requires Cloudflare DNS access.)

---

## 4. Submit the sitemap

1. In Search Console → **Sitemaps** (left nav).
2. Enter `sitemap.xml` → **Submit**.
3. Status should become **Success** with ~56 discovered URLs (home, `/library`, 54 habit pages).

---

## 5. Confirm & monitor

- **URL Inspection:** paste `https://stalio.orbacetech.com/library/H001` → **Request indexing** to prime a sample page.
- **Pages / Coverage:** check back in a few days for indexed counts and any errors.
- **robots.txt** already allows crawling and points to the sitemap (`https://stalio.orbacetech.com/robots.txt`).

---

## Reference

| Item | Value |
|------|-------|
| Property | `https://stalio.orbacetech.com` (URL-prefix) |
| Verification env var | `NEXT_PUBLIC_GSC_VERIFICATION` |
| Sitemap path | `/sitemap.xml` (~56 URLs) |
| Robots | `/robots.txt` |
