/**
 * 游戏控制器
 */

import { Game } from './game/Game.js';
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

    this.timerInterval = null;
    this.boundClick = this.handleBoardClick.bind(this);
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    this.game.mode = params.get('mode') || 'free';

    const loading = document.getElementById('loading');
    const progressEl = loading?.querySelector('.loading-progress');
    this.renderer.setProgressCallback((loaded, total) => {
      if (progressEl) progressEl.textContent = total ? `${Math.round((loaded / total) * 100)}%` : '...';
    });

    await this.renderer.init();

    // 必须等布局完成后再 resize，否则 canvas 宽高为 0
    this.renderer.resize();
    requestAnimationFrame(() => {
      this.renderer.resize();
      this.render();
    });

    window.addEventListener('resize', () => {
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
  }

  openMenu() {
    window.location.href = '/';
  }

  openSettings() {
    alert('设置功能开发中');
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

    this.resultTitle.textContent = '清盘';
    this.resultJifen.textContent = '+ ' + this.game.score;
    this.resultDaibi.textContent = '+ ' + (this.game.roundDaibiGain ?? 0);
  }

  retry() {
    this.resultOverlay.style.display = 'none';
    this.game.start();
    this.updateUI();
    this.render();
    this.startTimer();
  }
}
