# IITK Mess Menu — Hall 14 (installable web app)

A modernized PWA (Progressive Web App) that shows the Hall 14, IIT Kanpur
mess menu, highlights what's being served right now, and can be installed
to a phone home screen like a native app.

## What's new in this revamp
- Clean, ticket-inspired design system with a **light/dark mode** toggle
  (persisted, and defaults to the device's OS preference).
- **IIT Kanpur branded splash screen** on first load (logo fade/scale-in),
  shown once per browser session.
- **Current / next / past meal detection**, driven by `MEAL_WINDOWS` in
  `data.js` (single source of truth — no more hardcoded times in the JS).
- Meal cards are **collapsible on mobile** and show "Now" / "Next" tags.
- **Version indicator** in the footer, sourced from `version.js`.
- **Robust cache-busting**: the service worker's cache name is derived from
  `APP_VERSION`, so bumping the version on deploy automatically invalidates
  old caches — users are shown an "update available" toast instead of
  needing to manually clear their cache.

## Files
- `index.html` — the app shell (splash screen, header, toggle)
- `styles.css` — the design system (light + dark tokens)
- `version.js` — single source of truth for `APP_VERSION`
- `data.js` — the menu data + meal-timing config (edit this each month)
- `app.js` — rendering logic, meal-state detection, theme toggle, install prompt, SW update handling
- `manifest.json` — makes the app installable
- `service-worker.js` — versioned offline cache with automatic invalidation
- `icons/` — app icons (192, 512, maskable, apple touch) and the IIT Kanpur crest

## Updating next month's menu
Open `data.js` and edit the `MENU` array, `PRICES` object, and
`MEAL_WINDOWS` (if serving times change). No build step — just save and
re-deploy.

## Shipping an update (important — read this)
1. Edit whatever you need (menu, styles, logic).
2. **Bump `APP_VERSION` in `version.js`** (e.g. `"2.1.0"` → `"2.1.1"`).
   This is what forces the service worker to drop its old cache and fetch
   fresh files — skipping this step means some users may keep seeing the
   old cached version.
3. Deploy as usual.
4. Users who have the app open will see a small "A new version is
   available" toast with a **Refresh** button; the next time they open it
   fresh, they get the new version automatically either way.

## Deploy it (needed before a phone can install it)
A PWA can only be installed once it's served over **https** from a real
domain — it can't be installed straight from a local file. Easiest free
options:

### Option A — GitHub Pages
1. Create a new GitHub repo and push everything in this folder to it.
2. Repo Settings → Pages → Deploy from branch → `main` → `/ (root)`.
3. Your app will be live at `https://<username>.github.io/<repo>/`.

### Option B — Netlify Drop (no account needed)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You'll get a live https URL immediately.

### Option C — Vercel
1. `npm i -g vercel` then run `vercel` inside this folder and follow the prompts.

## Installing on a phone
1. Open the deployed URL in **Chrome** (Android) or **Safari** (iOS).
2. Chrome will show an "Install app" banner, or open the ⋮ menu →
   **Add to Home screen** / **Install app**. On iOS use Share → **Add to
   Home Screen**.
3. The app icon appears on the home screen and opens full-screen, no
   browser bar.

## Notes
- Menu content was transcribed from the official Hall-14 August 2026 mess
  sheet. Extra-counter items are shown as chips; a red dot/chip marks
  non-vegetarian items, green marks vegetarian, based on keyword matching —
  double check anything unusual against the real notice board.
- "Now serving" assumes standard hostel mess timings (breakfast 7–10:30,
  lunch 12–3, dinner 7–9:30). Adjust `MEAL_WINDOWS` in `data.js` if Hall
  14's actual timings differ — `app.js` reads from there, not hardcoded
  values.
