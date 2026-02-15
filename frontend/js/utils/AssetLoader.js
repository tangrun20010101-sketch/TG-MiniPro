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
    const promises = cardTypes.map((t) =>
      this.loadImage(ASSETS_CONFIG.getCardImage(t))
    );
    await Promise.all(promises);
    return promises.length;
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

  async preloadCriticalAssets() {
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
    await Promise.all(promises);
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
