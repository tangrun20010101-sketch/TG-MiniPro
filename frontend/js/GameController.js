/**
 * 游戏控制器
 */

import { Game } from './game/Game.js';
import { fetchUser, syncGameResult, fetchLeaderboard } from './api/userApi.js';
import { getClickableCards } from './game/CardGenerator.js';
import { BoardRenderer } from './renderer/BoardRenderer.js';

export class GameController {
  constructor() {
    this.game = new Game();
    this.boardCanvas = document.getElementById('board-canvas');
    this.traySlots = document.getElementById('tray-slots');
    this.renderer = new BoardRenderer(this.boardCanvas, this.traySlots);

    this.timerEl = document.getElementById('timer-value');
    this.scoreEl = document.getElementById('score');
    this.creditEl = document.getElementById('credit');
    this.undoBtn = document.getElementById('prop-undo');
    this.shuffleBtn = document.getElementById('prop-shuffle');
    this.removeBtn = document.getElementById('prop-remove');
    this.btnMenu = document.getElementById('btn-menu');
    this.btnSettings = document.getElementById('btn-settings');

    this.resultOverlay = document.getElementById('result-overlay');
    this.resultTitle = document.getElementById('result-title');
    this.resultJifen = document.getElementById('result-jifen');
    this.resultDaibi = document.getElementById('result-daibi');
    this.btnRetry = document.getElementById('btn-retry');

    this.settingsOverlay = document.getElementById('settings-overlay');
    this.btnSettingsClose = document.getElementById('btn-settings-close');
    this.btnConnectTg = document.getElementById('btn-connect-tg');
    this.btnLeaderboard = document.getElementById('btn-leaderboard');
    this.leaderboardOverlay = document.getElementById('leaderboard-overlay');
    this.btnLeaderboardClose = document.getElementById('btn-leaderboard-close');

    this.timerInterval = null;
    this.boundClick = this.handleBoardClick.bind(this);
  }

  async init(opts = {}) {
    const params = new URLSearchParams(window.location.search);
    this.game.mode = params.get('mode') || 'free';

    const loading = document.getElementById('loading');
    const progressEl = loading?.querySelector('.loading-progress');
    this.renderer.setProgressCallback((loaded, total) => {
      if (progressEl) progressEl.textContent = total ? `${Math.round((loaded / total) * 100)}%` : '...';
    });

    await this.renderer.init(opts);

    // 必须等布局完成后再 resize，否则 canvas 宽高为 0
    this.renderer.resize();
    requestAnimationFrame(() => {
      this.renderer.resize();
      this.render();
    });

    this.fitViewport();

    window.addEventListener('resize', () => {
      this.fitViewport();
      this.renderer.resize();
      this.render();
    });

    document.getElementById('game-bg').src = '/assets/images/backgrounds/game_bg.png';

    this.game.start();
    this.render();
    this.startTimer();
    this.bindEvents();
  }

  bindEvents() {
    this.boardCanvas.addEventListener('click', this.boundClick);
    this.boardCanvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (e.changedTouches?.[0]) {
        const t = e.changedTouches[0];
        this.handleBoardClick({ clientX: t.clientX, clientY: t.clientY });
      }
    }, { passive: false });
    this.undoBtn.addEventListener('click', () => this.useProp('undo'));
    this.shuffleBtn.addEventListener('click', () => this.useProp('shuffle'));
    this.removeBtn.addEventListener('click', () => this.useProp('remove'));
    this.btnRetry.addEventListener('click', () => this.retry());
    this.btnMenu?.addEventListener('click', () => this.openMenu());
    this.btnSettings?.addEventListener('click', () => this.openSettings());
    this.btnSettingsClose?.addEventListener('click', () => this.closeSettings());
    this.btnConnectTg?.addEventListener('click', () => this.connectTelegram());
    this.btnLeaderboard?.addEventListener('click', () => this.openLeaderboard());
    this.btnLeaderboardClose?.addEventListener('click', () => this.closeLeaderboard());
  }

  fitViewport() {
    const el = this.boardCanvas?.closest('.game');
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 402, vh / 874, 1.5);
    el.style.transform = `scale(${scale})`;
    el.style.transformOrigin = 'center center';
  }

  openMenu() {
    window.location.href = '/';
  }

  async openSettings() {
    if (!this.settingsOverlay) return;
    const pts = document.getElementById('settings-points');
    const cred = document.getElementById('settings-credits');
    const totalProps = (this.game?.props?.undo ?? 0) + (this.game?.props?.shuffle ?? 0) + (this.game?.props?.remove ?? 0);
    if (pts) pts.textContent = this.game?.score ?? 0;
    if (cred) cred.textContent = totalProps;
    try {
      const res = await fetchUser();
      if (res.ok && res.user) {
        if (pts) pts.textContent = res.user.total_score ?? this.game?.score ?? 0;
        if (cred) cred.textContent = res.user.total_credits ?? totalProps;
      }
    } catch (_) {}
    this.updateTelegramStatus();
    this.initSettingsTonConnect();
    this.settingsOverlay.style.display = 'flex';
  }

  closeSettings() {
    if (this.settingsOverlay) this.settingsOverlay.style.display = 'none';
  }

  updateTelegramStatus() {
    const statusEl = document.getElementById('settings-tg-status');
    const btnEl = document.getElementById('btn-connect-tg');
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) {
      if (statusEl) {
        statusEl.textContent = '已连接';
        statusEl.classList.add('connected');
      }
      if (btnEl) btnEl.textContent = '已连接 Telegram';
      if (btnEl) btnEl.disabled = true;
    } else {
      if (statusEl) {
        statusEl.textContent = '未连接（请在 Telegram 内打开）';
        statusEl.classList.remove('connected');
      }
      if (btnEl) btnEl.textContent = '连接 Telegram';
      if (btnEl) btnEl.disabled = false;
    }
  }

  connectTelegram() {
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) {
      this.updateTelegramStatus();
      return;
    }
    alert('请在 Telegram 内打开此游戏，即可自动连接。\n\n在浏览器中打开时无法连接 Telegram。');
  }

  async openLeaderboard() {
    if (!this.leaderboardOverlay) return;
    const listEl = document.getElementById('leaderboard-list');
    const dateEl = document.getElementById('leaderboard-date');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    if (listEl) listEl.innerHTML = '<li class="leaderboard-empty">加载中...</li>';
    this.leaderboardOverlay.style.display = 'flex';
    try {
      const res = await fetchLeaderboard();
      if (listEl) {
        if (!res.ok || !res.list?.length) {
          listEl.innerHTML = '<li class="leaderboard-empty">暂无今日战绩数据</li>';
        } else {
          listEl.innerHTML = res.list.map((row, i) => {
            const rankClass = row.rank <= 3 ? `rank-${row.rank}` : '';
            const raw = row.first_name || row.username || `用户${(row.telegram_id || '').slice(-4)}`;
            const name = String(raw).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
            return `<li class="leaderboard-item">
              <span class="leaderboard-rank ${rankClass}">#${row.rank}</span>
              <span class="leaderboard-name">${name}</span>
              <span class="leaderboard-score">${row.daily_score}分</span>
            </li>`;
          }).join('');
        }
      }
    } catch {
      if (listEl) listEl.innerHTML = '<li class="leaderboard-empty">加载失败</li>';
    }
  }

  closeLeaderboard() {
    if (this.leaderboardOverlay) this.leaderboardOverlay.style.display = 'none';
  }

  initSettingsTonConnect() {
    if (typeof TON_CONNECT_UI === 'undefined' || this._settingsTonInit) return;
    const root = document.getElementById('settings-ton-connect');
    if (!root) return;
    this._settingsTonInit = true;
    const manifestUrl = location.origin + '/tonconnect-manifest.json';
    new TON_CONNECT_UI.TonConnectUI({ manifestUrl, buttonRootId: 'settings-ton-connect' });
  }

  triggerEliminateEffect() {
    const tray = document.querySelector('.tray-wrap');
    if (tray) {
      tray.classList.add('eliminate-flash');
      setTimeout(() => tray.classList.remove('eliminate-flash'), 300);
    }
  }

  handleBoardClick(e) {
    if (this.game.status !== 'playing') return;

    const rect = this.boardCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const logicalW = this.boardCanvas.width / dpr;
    const logicalH = this.boardCanvas.height / dpr;
    const scaleX = rect.width > 0 ? logicalW / rect.width : 1;
    const scaleY = rect.height > 0 ? logicalH / rect.height : 1;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const CARD_WIDTH = 90;
    const CARD_HEIGHT = 90;
    const clickable = getClickableCards(this.game.cards);

    for (const card of clickable) {
      if (
        x >= card.x &&
        x <= card.x + CARD_WIDTH &&
        y >= card.y &&
        y <= card.y + CARD_HEIGHT
      ) {
        const result = this.game.pickCard(card.id);
        if (result.ok) {
          if (result.elimination) this.triggerEliminateEffect();
          this.updateUI();
          this.render();
          if (result.win) this.showResult('win');
          else if (result.lose) this.showResult('lose');
        }
        break;
      }
    }
  }

  useProp(type) {
    if (this.game.status !== 'playing') return;
    let ok = false;
    if (type === 'undo') {
      ok = this.game.useUndo();
    } else if (type === 'shuffle') {
      ok = this.game.useShuffle();
    } else if (type === 'remove') {
      ok = this.game.useRemove();
    }
    if (ok) {
      this.updateUI();
      this.render();
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.game.tick();
      this.timerEl.textContent = this.game.remainingTime;
      if (this.game.status === 'timeout') {
        this.stopTimer();
        this.showResult('timeout');
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateUI() {
    this.timerEl.textContent = this.game.remainingTime;
    this.scoreEl.textContent = this.game.score;
    this.creditEl.textContent = this.game.props.undo + this.game.props.shuffle + this.game.props.remove;

    this.undoBtn.disabled = this.game.props.undo <= 0;
    this.shuffleBtn.disabled = this.game.props.shuffle <= 0;
    this.removeBtn.disabled = this.game.props.remove <= 0;
  }

  render() {
    this.renderer.renderBoard(this.game.cards);
    this.renderer.renderTray(this.game.tray.getSlots());
  }

  showResult(status) {
    this.stopTimer();
    this.resultOverlay.style.display = 'flex';

    const title = status === 'win' ? '清盘' : status === 'lose' ? '失败' : '超时';
    this.resultTitle.textContent = title;
    this.resultJifen.textContent = '+ ' + this.game.score;
    this.resultDaibi.textContent = '+ ' + (this.game.roundDaibiGain ?? 0);

    syncGameResult(this.game.score, this.game.roundDaibiGain ?? 0, status === 'win').catch(() => {});
  }

  retry() {
    this.resultOverlay.style.display = 'none';
    this.game.start();
    this.updateUI();
    this.render();
    this.startTimer();
  }
}
