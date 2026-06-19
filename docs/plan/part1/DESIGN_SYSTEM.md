# Part 1 — Design System

Extracted verbatim from the approved mockups `stalio_website.html` and `stalio_library_page.html`. These become the Tailwind v4 `@theme` tokens. The two mockups share one token system; differences noted.

---

## 1. Color tokens

### Brand / core
| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#1A1A2E` | primary text, dark surfaces |
| `--ink-60 / -30 / -10` | `rgba(26,26,46,.6/.3/.1)` | secondary text, borders, hairlines |
| `--paper` | `#F7F5F0` | page background |
| `--paper-2` | `#EFEDE8` | alt panel background (library) |
| `--white` | `#FFFFFF` | cards |
| `--mint` | `#00E5A0` | **primary accent / CTA / checked state** |
| `--mint-dim` | `#00B87E` | hover/pressed mint |
| `--mint-bg` | `rgba(0,229,160,.1)` | mint tint backgrounds |
| `--amber` | `#FFB84D` | secondary highlight |
| `--slate` | `#8B8FA8` | muted labels |
| `--mist` | `#EDEDF5` | subtle fills |
| `--red-soft` | `#FF6B6B` | destructive / errors |

### Category color groups (6) — `{bg, text, accent}`
The 4px card top strip uses the **accent**; chips/badges use **bg + text**.

| Color group | CSV mapping | `bg` | `text` | `accent` |
|-------------|-------------|------|--------|----------|
| `health` (身) | `Health & Body` + cn `身` | `#E1F5EE` | `#085041` | `#1D9E75` |
| `mental` (心) | `Health & Body` + cn `心` (Mind/Reflection) | `#EEEDFE` | `#3C3489` | `#534AB7` |
| `productivity` (长) | `Productivity & Growth` | `#E6F1FB` | `#0C447C` | `#185FA5` |
| `financial` (财) | `Financial` | `#FAEEDA` | `#633806` | `#BA7517` |
| `social` (缘) | `Social & Relationship` | `#FBEAF0` | `#72243E` | `#993556` |
| `home` (居) | `Home & Environment` | `#EAF3DE` | `#27500A` | `#639922` |

> The website mockup names these `--c-health/-mental/-prod/-fin/-social/-home` (+ `-t` text). The library mockup names them `--h/-m/-p/-f/-s/-e` (+ `-bg/-t/-a`). **Normalize to the 6 names above** in the Tailwind theme; the `colorGroup` column (Data Model §3) selects them.

---

## 2. Typography

| Role | Family | Size | Weights |
|------|--------|------|---------|
| Display / hero | **Instrument Serif** | `clamp(40px, 5vw, 66px)`, line-height 1.08, tracking -0.5px | 400 (+ italic) |
| Section title (H2) | Instrument Serif | `clamp(28px, 3.5vw, 44px)`, lh 1.15 | 400 |
| CTA banner H2 | Instrument Serif | `clamp(32px, 5vw, 60px)` | 400 |
| Library page title | Instrument Serif | `36px`, lh 1.1 | 400 |
| Body / UI | **Inter** | website 16px / library 15px base, lh 1.6 | 300, 400, 500, 600, 700 |

Loaded via Google Fonts (`Instrument Serif: ital@0;1`, `Inter: wght@300..700`). In Next.js use `next/font/google` for both (self-hosted, no layout shift, CWV-friendly). PRD type scale (66/44/36/24/17/14/11) reconciles with the above clamps.

---

## 3. Radii, shadows, motion

| Token | Value |
|-------|-------|
| `--r4 / r8 / r12 / r16 / r24 / r99` | 4 / 8 / 12 / 16 / 24 / 99px |
| `--shadow-sm` | `0 1px 4px rgba(26,26,46,.06)` |
| `--shadow-md` | `0 4px 16px rgba(26,26,46,.10)` |
| `--shadow-lg` | `0 12px 40px rgba(26,26,46,.14)` |
| `--trans` | `all .2s ease` |

All transitions/animations must be wrapped for `prefers-reduced-motion: reduce` (PRD 8.2).

---

## 4. Tailwind v4 theme (target)

```css
/* app/globals.css */
@import "tailwindcss";
@theme {
  --color-ink: #1A1A2E;
  --color-paper: #F7F5F0;
  --color-paper-2: #EFEDE8;
  --color-mint: #00E5A0;
  --color-mint-dim: #00B87E;
  --color-amber: #FFB84D;
  --color-slate: #8B8FA8;
  --color-red-soft: #FF6B6B;
  /* category groups */
  --color-cat-health-bg: #E1F5EE;  --color-cat-health-text: #085041;  --color-cat-health-accent: #1D9E75;
  --color-cat-mental-bg: #EEEDFE;  --color-cat-mental-text: #3C3489;  --color-cat-mental-accent: #534AB7;
  --color-cat-prod-bg: #E6F1FB;    --color-cat-prod-text: #0C447C;    --color-cat-prod-accent: #185FA5;
  --color-cat-fin-bg: #FAEEDA;     --color-cat-fin-text: #633806;     --color-cat-fin-accent: #BA7517;
  --color-cat-social-bg: #FBEAF0;  --color-cat-social-text: #72243E;  --color-cat-social-accent: #993556;
  --color-cat-home-bg: #EAF3DE;    --color-cat-home-text: #27500A;    --color-cat-home-accent: #639922;
  --radius-card: 16px;
  --shadow-md: 0 4px 16px rgba(26,26,46,.10);
}
```

---

## 5. Component inventory (Part 1)

Built on **shadcn/ui + Radix**, styled with the tokens above.

### Marketing (homepage)
- `SiteHeader` / `SiteFooter` (sticky header, store links, legal).
- `Hero` — Instrument Serif H1 ("Build the life you keep promising yourself"), sub-headline, primary mint CTA, **interactive app mockup**, stats row (`54 habits · N pre-loaded · 0 min setup` — see reconciliation).
- `AppMockup` — live-tappable mini app view; tapping checks habits + animates a progress bar (client component, reduced-motion aware).
- `FeatureGrid` — 6 feature cards (Zero-setup, Growing library, Resilience over streaks, Identity not tasks, Community-powered, Insight over data).
- `DownloadCTA` — store buttons (iOS/Android), deep-link aware.

### Library (`/library`)
- `LibrarySidebar` — sticky desktop / collapsible mobile: full-text search, category filter (color groups, live counts), tracking-method filter, difficulty filter, default-bundle toggle.
- `HabitCard` (collapsed) — 4px category accent strip, category icon, name, label, 2-line description, footer tags (tracking method, difficulty, time of day), expand + add-to-app buttons.
- `HabitCardExpanded` (in-place) — anatomy bar (Cue → Behaviour → Reward), 2-minute version (dark callout + mint accent), **tracking mini-demo**, what-to-do, why-it-works, (research backing — gap), "Add to Stalio app" CTA (turns mint/checked on tap).
- `AddToAppButton` — builds deep link, optimistic checked state, persists "added" set to `localStorage` (Zustand persist), toast confirm.

### Shared
- `Toast`, `Badge/Tag`, `Button` (mint primary / ghost), `Icon` (Tabler), `CookieConsent`.

---

## 6. Tracking mini-demos (expanded card)

One small interactive/illustrative demo per `tracking_type` (Data Model §2). Build as a `TrackingDemo` component switching on type:

| `tracking_type` | Demo |
|-----------------|------|
| `boolean`, `boolean_optional_text` | check toggle (+ optional note) |
| `number`, `volume` | stepper toward target with unit (e.g. 8 glasses) |
| `duration`, `duration_optional_text` | minutes stepper / ring |
| `time` | time picker chip (bedtime/wake) |
| `scale`, `scale_optional_text` | 1–5 rating selector |
| `streak` | day-counter with milestone |
| `text_required`, `multi_text_required` | 1 or 3 text input rows |

Demos are illustrative (no persistence) — they communicate how the app tracks the habit. Each must have an accessible name and keyboard operation (PRD 8.2).

---

## 7. Accessibility baseline (built in, not retrofitted)
- Semantic HTML; ARIA labels on all icon-only buttons.
- Visible focus rings; full keyboard reachability of filters, cards, demos, CTAs.
- Color-contrast: category `text` on `bg` pairs verified ≥ WCAG AA (the chosen pairs are dark-on-light and pass).
- `prefers-reduced-motion` disables mockup/progress/expand animations.
