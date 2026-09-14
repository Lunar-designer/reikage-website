# Reikage — Official Leaderboard Website

A standalone, static website that displays your clan's 10-position
leaderboard. It is completely separate from your Discord bot's files —
nothing in your bot was touched or needs to change for this to work.

## 1. File structure

```
reikage-website/
├── index.html        <- page structure (no player names inside it)
├── css/
│   └── style.css      <- all visual styling, layout, and animation
├── js/
│   ├── config.js       <- ⭐ the API URL goes here — see section 4
│   └── app.js           <- fetches the data and builds the page from it
└── README.md
```

## 2. What each file does

- **`index.html`** — the skeleton of the page: the title, the three
  built-in states (loading / error / content), and empty containers
  (`#podium`, `#restList`) that JavaScript fills in. There is no player
  data anywhere in this file.

- **`css/style.css`** — the dark, violet-accented visual design: the
  title glow, the podium layout for ranks 1–3 (rank 1 raised and
  brighter), the list styling for ranks 4–10, the loading skeleton
  shimmer, the error state, hover effects, the page-load animation, and
  the responsive rules for mobile.

- **`js/config.js`** — the single configuration file. This is where you
  will paste your real API URL once your bot is hosted somewhere public.

- **`js/app.js`** — the logic. On page load it fetches
  `LEADERBOARD_API_URL`, turns whatever it gets back into 10 clean
  `{ position, name }` entries, and renders the podium and list from
  that. It also re-checks the API automatically every 30 seconds (see
  `REFRESH_INTERVAL_MS` in `config.js`), so the site reflects Discord
  changes without anyone needing to refresh the tab. If the fetch fails
  for any reason, it shows the clean error state instead of a broken page.

## 3. How to run/test it locally

Because the page uses `fetch()`, opening `index.html` directly by double-clicking it will be blocked by the browser in some cases. Instead, serve the folder with a tiny local server:

**If you have Node.js installed:**
```sh
npx serve
```
and open the local URL printed in the terminal (usually `http://localhost:3000`).

**If you have Python installed instead:**
```sh
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

The site is already connected to your live API endpoint on Render (`https://reikage-bot.onrender.com/api/leaderboard`) in `js/config.js`, so it will immediately load your live clan data!

## 4. Where the API URL is configured

In **`js/config.js`**:

```js
const LEADERBOARD_API_URL = "https://reikage-bot.onrender.com/api/leaderboard";
```

The website automatically accepts either:
- the flat shape straight from your bot's `leaderboard.json`: `{ "1": "lunar", "2": "", ... }`
- or the wrapped shape your bot endpoint returns: `{ clan: "Reikage", leaderboard: [...], updatedAt: "..." }`

## 5. Deploying to GitHub Pages

1. Push the repository to GitHub with `index.html` at the repository root.
2. In your repo's **Settings → Pages**, ensure the source is set to `Deploy from a branch`, selecting branch `main` and root `/(root)`.
3. Your live site is available at:
   `https://lunar-designer.github.io/reikage-website/`

## Notes on the design

- Ranks 2 and 3 sit beside rank 1 in a podium layout, with rank 1 raised,
  brighter, and larger — the convention viewers already recognize from
  leaderboards.
- Ranks 4–10 sit below as a clean list, zero-padded (`04`, `05`, …) to
  match the podium's numeric rhythm.
- An empty position always displays `VACANT` — it is never left blank or
  removed from the layout, matching how your bot treats open slots.
- The page-load animation plays once, the first time data successfully
  loads — it does not replay on every 30-second auto-refresh, so the
  page stays calm during normal use.
