// ============================================================
// REIKAGE LEADERBOARD — APP LOGIC
// ============================================================
// This file fetches the leaderboard from LEADERBOARD_API_URL
// (defined in config.js) and renders it. No player names are
// ever written in this file — everything comes from the fetch.

(function () {
  const TOTAL_POSITIONS = 10;

  const boardSection = document.getElementById('boardSection');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const errorDetail = document.getElementById('errorDetail');
  const boardContent = document.getElementById('boardContent');
  const podiumEl = document.getElementById('podium');
  const restListEl = document.getElementById('restList');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  const retryBtn = document.getElementById('retryBtn');

  let hasAnimatedIn = false;
  let refreshTimer = null;

  function showState(state) {
    loadingState.hidden = state !== 'loading';
    errorState.hidden = state !== 'error';
    boardContent.hidden = state !== 'ready';
    boardSection.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
  }

  // Accepts either shape of data and always returns 10 clean entries:
  //   1) flat leaderboard.json shape: { "1": "lunar", "2": "", ... }
  //   2) wrapped shape: { leaderboard: [{ position, name }, ...], updatedAt }
  function normalizeLeaderboardData(data) {
    let entries = [];
    let updatedAt = null;

    if (data && Array.isArray(data.leaderboard)) {
      entries = data.leaderboard.map(function (item) {
        return {
          position: Number(item.position),
          name: (item.name || '').trim()
        };
      });
      updatedAt = data.updatedAt || null;
    } else if (data && typeof data === 'object') {
      for (let i = 1; i <= TOTAL_POSITIONS; i++) {
        entries.push({
          position: i,
          name: (data[String(i)] || '').trim()
        });
      }
    }

    entries.sort(function (a, b) { return a.position - b.position; });
    return { entries: entries, updatedAt: updatedAt };
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderPodium(entries) {
    podiumEl.innerHTML = '';
    const visualOrder = [2, 1, 3]; // displayed as 2nd, 1st, 3rd (podium convention)

    visualOrder.forEach(function (pos) {
      const entry = entries.find(function (e) { return e.position === pos; });
      const name = entry ? entry.name : '';
      const isVacant = name === '';

      const card = document.createElement('div');
      card.className = 'podium-card rank-' + pos + (isVacant ? ' is-vacant' : '');
      card.innerHTML =
        '<div class="podium-rank">' + pos + '</div>' +
        '<div class="podium-name">' + (isVacant ? 'VACANT' : escapeHtml(name)) + '</div>';

      podiumEl.appendChild(card);
    });
  }

  function renderRestList(entries) {
    restListEl.innerHTML = '';
    entries
      .filter(function (e) { return e.position >= 4; })
      .forEach(function (entry) {
        const isVacant = entry.name === '';
        const li = document.createElement('li');
        li.className = 'row' + (isVacant ? ' is-vacant' : '');
        li.innerHTML =
          '<span class="row-rank">' + String(entry.position).padStart(2, '0') + '</span>' +
          '<span class="row-name">' + (isVacant ? 'VACANT' : escapeHtml(entry.name)) + '</span>';
        restListEl.appendChild(li);
      });
  }

  function formatUpdatedAt(updatedAt) {
    if (updatedAt) {
      const date = new Date(updatedAt);
      if (!isNaN(date.getTime())) {
        return 'Last updated ' + date.toLocaleString();
      }
    }
    return 'Last checked ' + new Date().toLocaleTimeString();
  }

  async function loadLeaderboard() {
    if (!hasAnimatedIn) {
      showState('loading');
    }

    try {
      const response = await fetch(LEADERBOARD_API_URL, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Server responded with status ' + response.status);
      }

      const data = await response.json();
      const normalized = normalizeLeaderboardData(data);

      renderPodium(normalized.entries);
      renderRestList(normalized.entries);
      lastUpdatedEl.textContent = formatUpdatedAt(normalized.updatedAt);

      showState('ready');

      if (!hasAnimatedIn) {
        boardContent.classList.add('animate-in');
        hasAnimatedIn = true;
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);

      if (LEADERBOARD_API_URL === 'YOUR_API_URL_HERE') {
        errorDetail.textContent = 'No API URL has been set yet. Add it to LEADERBOARD_API_URL in js/config.js.';
      } else {
        errorDetail.textContent = 'Check your connection and try again.';
      }

      showState('error');
    }
  }

  retryBtn.addEventListener('click', loadLeaderboard);

  function startAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    if (typeof REFRESH_INTERVAL_MS === 'number' && REFRESH_INTERVAL_MS > 0) {
      refreshTimer = setInterval(loadLeaderboard, REFRESH_INTERVAL_MS);
    }
  }

  loadLeaderboard();
  startAutoRefresh();
})();
