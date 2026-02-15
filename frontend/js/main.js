/**
 * 游戏入口（仅 game.html 使用）
 */

import { GameController } from './GameController.js';

async function main() {
  const loading = document.getElementById('loading');

  try {
    const ctrl = new GameController();
    await ctrl.init();
    loading.style.display = 'none';
  } catch (err) {
    console.error('Init failed:', err);
    document.querySelector('.loading-text').textContent = '加载失败，请刷新';
  }
}

main();
