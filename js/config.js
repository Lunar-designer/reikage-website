// ============================================================
// REIKAGE LEADERBOARD — CONFIGURATION
// ============================================================
// This is the ONLY place in the whole website you need to edit
// once your Discord bot's API is hosted somewhere public.
//
// Right now it's a placeholder, so the site shows a clean error
// message instead of pretending to have real data.
//
// Later, replace it with your real, publicly reachable endpoint,
// for example:
//   const LEADERBOARD_API_URL = "https://reikage-bot.up.railway.app/api/leaderboard";
//
// The website will accept either:
//   - the flat leaderboard.json shape:  { "1": "lunar", "2": "", ... }
//   - or a wrapped shape:               { leaderboard: [...], updatedAt: "..." }
// so you don't need to change anything else when you plug in the real URL.

const LEADERBOARD_API_URL = "https://reikage-bot.onrender.com/api/leaderboard";

// How often (in milliseconds) the page automatically re-checks the API,
// so it reflects Discord changes without anyone reloading the browser tab.
// Set to 0 to disable auto-refresh.
const REFRESH_INTERVAL_MS = 30000; // 30 seconds
