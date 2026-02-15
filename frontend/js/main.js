/**
 * 游戏入口（仅 game.html 使用）
 */

import { GameController } from './GameController.js';

const LOAD_TIMEOUT_MS = 12000;

async function main() {
  // 通过 file:// 打开时资源无法加载，提示用户使用本地服务
  if (window.location.protocol === 'file:') {
    const loading = document.getElementById('loading');
    const textEl = loading?.querySelector('.loading-text');
    if (textEl) textEl.textContent = '请使用 npm start 启动后访问 http://localhost:3456';
    return;
  }

  const loading = document.getElementById('loading');
  const textEl = loading?.querySelector('.loading-text');

  const hideLoading = () => {
    if (loading) loading.style.display = 'none';
  };

  const showError = (msg) => {
    if (textEl) textEl.textContent = msg;
    const p = loading?.querySelector('.loading-progress');
    if (p) p.textContent = '';
    setTimeout(hideLoading, 3000);
  };

  try {
    const ctrl = new GameController();
    await Promise.race([
      ctrl.init(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), LOAD_TIMEOUT_MS))
    ]);
    hideLoading();
  } catch (err) {
    console.error('Init failed:', err);
    if (err?.message === 'timeout') {
      if (textEl) textEl.textContent = '网络较慢，跳过预加载直接进入...';
      try {
        const ctrl = new GameController();
        await ctrl.init({ skipPreload: true });
        hideLoading();
      } catch {
        showError('加载失败，请检查网络后刷新');
      }
    } else {
      showError('加载失败，请刷新重试');
    }
  }
}

main();
