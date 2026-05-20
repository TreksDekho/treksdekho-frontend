# TreksDekho — Developer Manual

> Phase 1 validation landing page. Zero backend, zero cost, fully static with a live Google Sheets CMS.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Environment Variables](#environment-variables)
5. [Admin Guide — Managing Trek Data](#admin-guide--managing-trek-data)
6. [Admin Guide — Leads & Analytics](#admin-guide--leads--analytics)
7. [User Guide — Landing Page Sections](#user-guide--landing-page-sections)
8. [Deployment Guide](#deployment-guide)
9. [Adding a New Feature](#adding-a-new-feature)

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR + static, Vercel-native |
| Styling | Tailwind CSS v4 | Utility-first, no build config |
| Animations | Framer Motion | Scroll reveals, hover cards |
| Fonts | Syne (headings) + Inter (body) | via `next/font/google` |
| Analytics | GA4 + Microsoft Clarity | Free, zero backend |
| Lead capture | Google Apps Script → Google Sheets | Free, no database needed |
| Trek CMS | Google Sheets published CSV | Edit data without redeploying |
| Hosting | Vercel (free tier) | Auto-deploy on git push |

---

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout — fonts, GA4, Clarity scripts
│   │   ├── page.tsx            # Landing page (public, no auth)
│   │   ├── globals.css         # CSS variables, font utilities, keyframes
│   │   └── dashboard/          # Phase 2 — authenticated app (not linked yet)
│   ├── components/
│   │   └── landing/
│   │       ├── LandingNavbar.tsx       # Fixed top nav with mobile menu
│   │       ├── Hero.tsx                # Full-screen hero section
│   │       ├── SahyadriLegacy.tsx      # Heritage section + live visitor counter
│   │       ├── TrekCards.tsx           # Filterable trek grid with hover cards
│   │       ├── HowItWorks.tsx          # 3-step process explanation
│   │       ├── LeadCapture.tsx         # "Find Your Trek" form (WhatsApp + Gmail)
│   │       ├── MissionNote.tsx         # Problem statement + trekker/operator CTAs
│   │       ├── WhyUs.tsx               # Platform value props
│   │       ├── OperatorConnect.tsx     # Operator onboarding pitch
│   │       ├── LandingFooter.tsx       # Footer + "Join the Team" banner
│   │       ├── FloatingWhatsApp.tsx    # Sticky WhatsApp button
│   │       └── TreksDekhoLogo.tsx      # SVG fort logo
│   ├── data/
│   │   └── treks.ts            # Hardcoded trek data (fallback if sheet unavailable)
│   └── lib/
│       └── fetchTreks.ts       # Fetches + parses trek data from Google Sheets CSV
├── scripts/
│   └── leads-sheet.gs          # Google Apps Script for lead capture → Sheets
├── .env.local                  # Local secrets (never committed)
├── next.config.ts              # Image domains, rewrites
└── MANUAL.md                   # This file
```

---

## Local Development

**Prerequisites:** Node.js 18+, npm

```bash
# 1. Install dependencies
cd /Users/jamnarer/Desktop/treksdekho/web
npm install

# 2. Create local env file
cp .env.local.example .env.local   # or create manually (see env vars below)

# 3. Start dev server
npm run dev
# → http://localhost:3000

# 4. Build for production (test before deploying)
npm run build
npm run start
```

---

## Environment Variables

Create a `.env.local` file in the `web/` root. **Never commit this file.**

```env
# Google Analytics 4 — get from analytics.google.com
# Leave blank to disable GA (works fine locally without it)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Microsoft Clarity — get from clarity.microsoft.com
# Free heatmaps + session recordings
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Google Apps Script URL — for lead capture form → Google Sheets
# See "Leads Setup" section below for how to get this
NEXT_PUBLIC_LEADS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec

# Google Sheets CSV URL — trek data CMS
# See "Trek Data" section below for how to get this
NEXT_PUBLIC_TREKS_SHEET_URL=https://docs.google.com/spreadsheets/d/SHEET_ID/pub?output=csv
```

All `NEXT_PUBLIC_` vars are exposed to the browser — do not put secrets here.

---

## Admin Guide — Managing Trek Data

Trek data has two layers:

| Layer | File | When used |
|---|---|---|
| Hardcoded fallback | `src/data/treks.ts` | Always — shown instantly on load |
| Live Google Sheet | `NEXT_PUBLIC_TREKS_SHEET_URL` | Overlaid after fetch — overrides fallback |

### Setting up the Google Sheet CMS

**Step 1 — Create the sheet**

Create a Google Sheet. Row 1 must have these exact headers:

```
id | slug | name | location | region | difficulty | duration | price | groupSize | image | about | heritage | whyTrek | photo1 | photo2 | meetingPoint | nextDate | isMonsoonPick | operatorName | operatorInstagram | includes | carry
```

Field notes:
- `difficulty` — must be exactly `Easy`, `Moderate`, or `Tough`
- `price` — number only, no ₹ symbol
- `isMonsoonPick` — `true` or `false`
- `includes` / `carry` — separate items with `|` (e.g. `Bus from Swargate|Guide|Permit`)
- `photo1` / `photo2` — full Unsplash URLs for hover gallery
- `image` — main card image URL

**Step 2 — Publish as CSV**

File → Share → Publish to web → Sheet1 → CSV → Publish → copy URL

**Step 3 — Add to env**

```env
NEXT_PUBLIC_TREKS_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/pub?output=csv
```

Also add this in Vercel → Settings → Environment Variables → redeploy once.

**After setup — daily operations:**

| Action | How |
|---|---|
| Add a trek | Add a new row to the sheet |
| Edit price / date / description | Edit the cell directly |
| Remove a trek | Delete the row |
| Temporarily hide a trek | Clear the `id` cell — parser skips empty rows |

Changes go live in under 1 minute. No redeploy needed.

### Updating the WhatsApp Number

All booking CTAs and WhatsApp links use a single constant:

```ts
// src/data/treks.ts  — line 24
export const WHATSAPP_NUMBER = '919876543210'; // format: country code + number, no +
```

Change this once — every button on the site updates.

---

## Admin Guide — Leads & Analytics

### Lead Capture (Google Apps Script)

When a user submits the "Find Your Trek" form, the data posts to a Google Apps Script which writes it to a Google Sheet.

**Setup:**

1. Open [script.google.com](https://script.google.com) → New project
2. Paste the contents of `scripts/leads-sheet.gs`
3. Update `SHEET_ID` inside the script to your leads sheet ID
4. Deploy → New deployment → Web app → Execute as: Me → Access: Anyone → Deploy
5. Copy the deployment URL → add to `.env.local` as `NEXT_PUBLIC_LEADS_SCRIPT_URL`
6. Add the same var in Vercel → redeploy once

**What gets captured per lead:**

| Field | Description |
|---|---|
| name | Trekker's name |
| contactMethod | `whatsapp` or `email` |
| contact | Phone number or email address |
| groupSize | Just me / 2 / 3–4 / 5+ |
| difficulty | Easy / Moderate / Tough / Any |
| timestamp | ISO timestamp of submission |

**Viewing leads:** open the Google Sheet linked in your Apps Script.

### Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → Create property → Web
2. Copy Measurement ID (`G-XXXXXXXXXX`) → add to `NEXT_PUBLIC_GA_ID`
3. Auto-tracked events: `page_view`, `scroll` (75% depth), `click`
4. Realtime view: GA4 dashboard → Reports → Realtime

### Microsoft Clarity (Heatmaps + Recordings)

1. [clarity.microsoft.com](https://clarity.microsoft.com) → New project → paste site URL
2. Copy Project ID → add to `NEXT_PUBLIC_CLARITY_ID`
3. Sessions appear in Clarity dashboard within ~2 minutes
4. Use **Recordings** to watch real user sessions on the hover cards

---

## User Guide — Landing Page Sections

The landing page follows a narrative arc. Each section has an anchor ID for deep linking.

| Section | Anchor | Purpose |
|---|---|---|
| Navbar | — | Logo, nav links, "Find a Trek" CTA |
| Hero | `#hero` | First impression, tagline, scroll CTA |
| SahyadriLegacy | — | Heritage context, fort chips, visitor counter |
| TrekCards | `#treks` | Browse + search + filter treks |
| HowItWorks | `#how-it-works` | 3-step booking process |
| LeadCapture | `#join` | "Find Your Trek" form |
| MissionNote | — | Problem statement, trekker + operator messages |
| WhyUs | `#why-us` | Platform value props |
| OperatorConnect | `#operators` | Operator onboarding pitch |
| Footer | — | Links, "Join the Team" WhatsApp CTA |

### Trek Card Behaviour

- **Desktop hover** — compact card fades out, expanded panel fades in with photo mosaic + full info
- **Non-hovered cards** — dim to 35% opacity when a card is active
- **"I'm In" button** — opens WhatsApp with a pre-filled message including trek name and price
- **Operator Instagram** — links directly to the operator's Instagram profile
- **Search** — filters by trek name, operator name, location, or region in real time
- **Filters** — Monsoon Picks, Easy, Moderate, Tough — stack with search

---

## Deployment Guide

### First deploy

**1. Push to GitHub**

```bash
cd /Users/jamnarer/Desktop/treksdekho/web
git init
git add .
git commit -m "Initial commit — TreksDekho landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/treksdekho-web.git
git push -u origin main
```

**2. Deploy on Vercel**

1. [vercel.com](https://vercel.com) → Add New Project → import `treksdekho-web`
2. Framework auto-detected as Next.js — no config needed
3. Before deploying, add Environment Variables:

```
NEXT_PUBLIC_GA_ID              → your GA4 Measurement ID
NEXT_PUBLIC_CLARITY_ID         → your Clarity Project ID
NEXT_PUBLIC_LEADS_SCRIPT_URL   → your Apps Script deployment URL
NEXT_PUBLIC_TREKS_SHEET_URL    → your Google Sheets CSV URL
```

4. Click **Deploy** — live at `treksdekho-web.vercel.app` in ~2 minutes

### Subsequent deploys

Every `git push` to `main` triggers an automatic redeploy:

```bash
git add .
git commit -m "describe your change"
git push
# Vercel rebuilds and goes live in ~60 seconds
```

### Custom domain (when ready)

Vercel dashboard → your project → Settings → Domains → Add `treksdekho.com`

Follow the DNS instructions (two records at your registrar). SSL is automatic and free.

### Rollback a bad deploy

Vercel dashboard → your project → Deployments → click any previous deployment → **Promote to Production**. Takes 10 seconds.

---

## Adding a New Feature

### Adding a new trek card field

1. Add the field to the `Trek` interface in `src/data/treks.ts`
2. Add it to all 6 trek objects in the `TREKS` array
3. Update the CSV column headers in your Google Sheet
4. Update `src/lib/fetchTreks.ts` — add the field to the destructured CSV row and the returned object
5. Render it in `TrekCards.tsx`

### Adding a new landing page section

1. Create `src/components/landing/YourSection.tsx`
2. Import and add it to `src/app/page.tsx` in the right position
3. If it needs a nav anchor, add the `id` attribute and a link in `LandingNavbar.tsx`

### Changing the colour scheme

All landing page colours are CSS variables in `src/app/globals.css`:

```css
--land-bg:      #0f1f17;   /* dark forest green — main background */
--land-surface: #1a3a2a;   /* slightly lighter — card backgrounds */
--land-accent:  #c8902a;   /* ochre — CTAs, highlights, fort icons */
--land-cream:   #f5f0e8;   /* warm white — primary text */
--land-mist:    #8a9a8e;   /* muted sage — secondary text */
```

---

*Built for the Sahyadri. जय महाराष्ट्र.*
