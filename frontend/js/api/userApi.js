/**
 * 用户 API 客户端
 * 需在 Telegram 内打开才有 initData
 */

const API_BASE = '';

function getInitData() {
  return window.Telegram?.WebApp?.initData || '';
}

export async function fetchUser() {
  const initData = getInitData();
  const res = await fetch(`${API_BASE}/api/user?initData=${encodeURIComponent(initData)}`);
  const json = await res.json();
  return json;
}

export async function syncGameResult(score, creditsGain, win) {
  const initData = getInitData();
  const res = await fetch(`${API_BASE}/api/user/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initData,
      score,
      credits_gain: creditsGain,
      win
    })
  });
  const json = await res.json();
  return json;
}

export async function fetchLeaderboard(date) {
  const d = date || new Date().toISOString().slice(0, 10);
  const res = await fetch(`${API_BASE}/api/leaderboard?date=${d}&limit=20`);
  const json = await res.json();
  return json;
}

export async function bindWallet(walletAddress) {
  const initData = getInitData();
  const res = await fetch(`${API_BASE}/api/user/wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData, wallet_address: walletAddress })
  });
  const json = await res.json();
  return json;
}
