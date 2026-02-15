/**
 * 资源加载器
 */

import ASSETS_CONFIG from '../config/assets.js';

class AssetLoader {
  constructor() {
    this.loadedImages = new Map();
    this.loadingPromises = new Map();
    this.onProgressCallback = null;
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  setProgressCallback(callback) {
    this.onProgressCallback = callback;
  }

  updateProgress() {
    this.loadedAssets++;
    if (this.onProgressCallback) {
      this.onProgressCallback(this.loadedAssets, this.totalAssets);
    }
  }

  async loadImage(src) {
    if (this.loadedImages.has(src)) return this.loadedImages.get(src);
    if (this.loadingPromises.has(src)) return this.loadingPromises.get(src);

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.set(src, img);
        this.loadingPromises.delete(src);
        this.updateProgress();
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(src);
        this.updateProgress(); // 失败也计入进度，避免一直停在 0%
        console.error(`Failed to load image: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
    this.loadingPromises.set(src, promise);
    return promise;
  }

  async preloadCards() {
    const cardTypes = Object.keys(ASSETS_CONFIG.cards.icons);
    const results = await Promise.allSettled(
      cardTypes.map((t) => this.loadImage(ASSETS_CONFIG.getCardImage(t)))
    );
    const ok = results.filter((r) => r.status === 'fulfilled').length;
    if (ok < cardTypes.length) {
      console.warn(`卡牌图片: ${ok}/${cardTypes.length} 加载成功`);
    }
    return ok;
  }

  async loadIcon(category, name) {
    const src = ASSETS_CONFIG.getIconPath(category, name);
    if (!src) throw new Error(`Icon not found: ${category}/${name}`);
    return this.loadImage(src);
  }

  async loadBackground(name) {
    const bg = ASSETS_CONFIG.backgrounds[name];
    if (!bg) throw new Error(`Background not found: ${name}`);
    return this.loadImage(bg);
  }

  async loadUI(name) {
    const src = ASSETS_CONFIG.ui && ASSETS_CONFIG.ui[name];
    if (!src) throw new Error(`UI asset not found: ${name}`);
    return this.loadImage(src);
  }

  async preloadCriticalAssets(opts = {}) {
    if (opts.skipPreload || opts.skip) return; // 超时重试时跳过预加载，直接进入游戏
    const cardTypes = Object.keys(ASSETS_CONFIG.cards.icons);
    this.totalAssets = cardTypes.length + 7;
    this.loadedAssets = 0;

    const promises = [
      this.preloadCards(),
      this.loadIcon('props', 'undo'),
      this.loadIcon('props', 'shuffle'),
      this.loadIcon('props', 'remove'),
      this.loadIcon('modes', 'freeMode'),
      this.loadIcon('modes', 'betMode'),
      this.loadBackground('game'),
      this.loadUI('trayBg')
    ];
    const results = await Promise.allSettled(promises);
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      console.warn('部分资源加载失败，继续游戏:', failed.map((r) => r.reason?.message));
    }
  }

  getLoadedImage(src) {
    return this.loadedImages.get(src) || null;
  }

  clearCache() {
    this.loadedImages.clear();
    this.loadingPromises.clear();
    this.loadedAssets = 0;
    this.totalAssets = 0;
  }
}

let instance = null;

export default function getAssetLoader() {
  if (!instance) instance = new AssetLoader();
  return instance;
}

export { AssetLoader };
