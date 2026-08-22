# Hall 14 Mess Menu — installable web app

A small PWA (Progressive Web App) that shows the Hall 14, IIT Kanpur mess menu,
highlights what's being served right now, and can be installed to an Android
home screen like a native app.

## Files
- `index.html` — the app shell
- `styles.css` — the ticket/coupon design system
- `data.js` — the menu data (edit this each month)
- `app.js` — rendering logic, "now serving" detection, install prompt
- `manifest.json` — makes the app installable
- `service-worker.js` — caches the app so it works offline
- `icons/` — app icons (192, 512, maskable, apple touch)

## Updating next month's menu
Open `data.js` and edit the `MENU` array and `PRICES` object. No build step —
just save and re-deploy.

## Deploy it (needed before Android can install it)
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

## Installing on Android
1. Open the deployed URL in **Chrome** on the Android phone.
2. Chrome will show an "Install app" banner, or open the ⋮ menu → **Add to Home screen** / **Install app**.
3. The app icon appears on the home screen and opens full-screen, no browser bar.

## Notes
- Menu content was transcribed from the official Hall-14 August 2026 mess
  sheet. Extra-counter items are shown as chips; a red dot/chip marks
  non-vegetarian items, green marks vegetarian, based on keyword matching —
  double check anything unusual against the real notice board.
- "Now serving" assumes standard hostel mess timings (breakfast 7–10:30,
  lunch 12–3, dinner 7–9:30). Adjust the ranges in `app.js` →
  `currentMealSlot()` if Hall 14's actual timings differ.
