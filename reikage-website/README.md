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

Because the page uses `fetch()`, opening `index.html` directly by
double-clicking it will be blocked by the browser in some cases. Instead,
serve the folder with a tiny local server:

**If you have Python installed:**
```
cd reikage-website
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**If you have Node.js installed instead:**
```
cd reikage-website
npx serve
```
and open the URL it prints.

Right now, since `LEADERBOARD_API_URL` is still the placeholder, you'll
see the clean error state — that's expected and correct. It proves the
loading/error handling works before you even have a real API.

To see it with real-looking data while testing, you can temporarily set
in `js/config.js`:
```js
const LEADERBOARD_API_URL = "data:application/json,{\"1\":\"Lunar\",\"2\":\"Kestrel\",\"3\":\"Vale\",\"4\":\"Orin\",\"5\":\"\",\"6\":\"Marrow\",\"7\":\"\",\"8\":\"Sable\",\"9\":\"\",\"10\":\"\"}";
```
then change it back to `"YOUR_API_URL_HERE"` (or your real URL) when
you're done — don't leave test data in the file you deploy.

## 4. Where the real API URL goes

Open **`js/config.js`** — it is the very first executable line:

```js
const LEADERBOARD_API_URL = "YOUR_API_URL_HERE";
```

Replace `"YOUR_API_URL_HERE"` with your bot's real, **publicly reachable**
API endpoint once it's hosted somewhere with a public URL (not
`localhost`) — for example:

```js
const LEADERBOARD_API_URL = "https://reikage-bot.up.railway.app/api/leaderboard";
```

That's the only code change needed to connect this site to your live
Discord data. Nothing else in the project needs to be touched, because
`app.js` already understands both:
- the flat shape straight from your bot's `leaderboard.json`:
  `{ "1": "lunar", "2": "", ... }`
- and the wrapped shape your existing bot's `/api/leaderboard` endpoint
  currently returns: `{ leaderboard: [...], updatedAt: "..." }`

So whichever one your bot ends up serving publicly, the website will
work without edits.

**Important:** your bot's API currently only listens on
`http://localhost:3000`, which only works on your own computer. For the
live website (especially once it's on GitHub Pages) to reach it, the bot
needs to be hosted somewhere with a public HTTPS address — for example
Railway, Render, or a small VPS. That's a separate, later step; it does
not require changing any bot files, only where the bot process runs.

## 5. Deploying to GitHub Pages

1. Create a new GitHub repository and push the contents of this folder
   to it (keep `index.html` at the repository root, or in `/docs` if you
   prefer — just match it in the Pages settings).
2. In the repo's **Settings → Pages**, set the source to the branch/folder
   containing `index.html`.
3. GitHub will give you a URL like `https://yourname.github.io/reikage/`
   — that's your live site.
4. Before pushing, make sure `js/config.js` has your real, public API URL
   (see section 4) — GitHub Pages can't reach `localhost`.

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
