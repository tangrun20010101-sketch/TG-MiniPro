/**
 * 游戏画面渲染器
 */

import getAssetLoader from '../utils/AssetLoader.js';
import ASSETS_CONFIG from '../config/assets.js';

const CARD_WIDTH = 90;
const CARD_HEIGHT = 90;
const TRAY_CARD_WIDTH = 90;
const TRAY_CARD_HEIGHT = 90;

export class BoardRenderer {
  constructor(boardCanvas, trayContainer) {
    this.boardCanvas = boardCanvas;
    this.trayContainer = trayContainer;
    this.loader = getAssetLoader();
    this.ctx = boardCanvas.getContext('2d');
  }

  setProgressCallback(callback) {
    this.loader.setProgressCallback(callback);
  }

  async init() {
    await this.loader.preloadCriticalAssets();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.boardCanvas.width = 402 * dpr;
    this.boardCanvas.height = 440 * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  renderBoard(cards) {
    const dpr = window.devicePixelRatio || 1;
    const w = this.boardCanvas.width / dpr;
    const h = this.boardCanvas.height / dpr;
    this.ctx.clearRect(0, 0, w, h);

    const visible = cards.filter((c) => !c.removed);
    visible.sort((a, b) => a.layer - b.layer);

    for (const card of visible) {
      this.drawCard(this.ctx, card, card.x, card.y);
    }
  }

  drawCard(ctx, card, x, y, forTray = false) {
    const cardPath = ASSETS_CONFIG.getCardImage(card.type);
    const img = this.loader.getLoadedImage(cardPath);
    const w = forTray ? TRAY_CARD_WIDTH : CARD_WIDTH;
    const h = forTray ? TRAY_CARD_HEIGHT : CARD_HEIGHT;

    if (img) {
      // 牌堆和托盘均不拉伸：保持比例居中绘制
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
    }
  }

  renderTray(slots) {
    this.trayContainer.innerHTML = '';
    const createSlot = (i) => {
      const slot = document.createElement('div');
      slot.className = 'tray-slot' + (slots[i] ? ' has-card' : '');
      if (slots[i]) {
        const canvas = document.createElement('canvas');
        canvas.width = TRAY_CARD_WIDTH;
        canvas.height = TRAY_CARD_HEIGHT;
        const slotCtx = canvas.getContext('2d');
        this.drawCard(slotCtx, slots[i], 0, 0, true);
        slot.appendChild(canvas);
      }
      return slot;
    };
    // 上排 4 个、下排 3 个，居中向两边延伸，紧挨着
    const row1 = document.createElement('div');
    row1.className = 'tray-row tray-row-1';
    for (let i = 0; i < 4; i++) row1.appendChild(createSlot(i));
    const row2 = document.createElement('div');
    row2.className = 'tray-row tray-row-2';
    for (let i = 4; i < 7; i++) row2.appendChild(createSlot(i));
    this.trayContainer.appendChild(row1);
    this.trayContainer.appendChild(row2);
  }
}
