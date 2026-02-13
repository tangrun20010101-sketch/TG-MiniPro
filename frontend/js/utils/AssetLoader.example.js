/**
 * 资源加载器工具类
 * 用于统一管理和加载游戏资源
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
  
  /**
   * 设置进度回调
   * @param {Function} callback - 进度回调函数 (loaded, total) => {}
   */
  setProgressCallback(callback) {
    this.onProgressCallback = callback;
  }
  
  /**
   * 更新加载进度
   */
  updateProgress() {
    this.loadedAssets++;
    if (this.onProgressCallback) {
      this.onProgressCallback(this.loadedAssets, this.totalAssets);
    }
  }
  
  /**
   * 加载单个图片
   * @param {string} src - 图片路径
   * @returns {Promise<Image>}
   */
  async loadImage(src) {
    // 如果已经加载过，直接返回
    if (this.loadedImages.has(src)) {
      return this.loadedImages.get(src);
    }
    
    // 如果正在加载，返回加载中的Promise
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }
    
    // 创建新的加载Promise
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedImages.set(src, img);
        this.loadingPromises.delete(src);
        this.updateProgress();
        resolve(img);
      };
      
      img.onerror = (error) => {
        this.loadingPromises.delete(src);
        console.error(`Failed to load image: ${src}`, error);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
    
    this.loadingPromises.set(src, promise);
    return promise;
  }
  
  /**
   * 获取卡牌组成部分路径（组合方案）
   * @param {string} cardType - 牌类型
   * @param {string} state - 状态 (default|glow)
   * @returns {{ background: string, icon: string }}
   */
  getCardPaths(cardType, state = 'default') {
    return ASSETS_CONFIG.getCardParts(cardType, state);
  }

  /**
   * 加载单张牌的组成部分（组合方案：底图+道具图标）
   * @param {string} cardType - 牌类型
   * @param {string} state - 状态 (default|glow)
   * @returns {Promise<{ background: Image, icon: Image }>}
   */
  async loadCardParts(cardType, state = 'default') {
    const { background, icon } = ASSETS_CONFIG.getCardParts(cardType, state);
    const [bgImg, iconImg] = await Promise.all([
      this.loadImage(background),
      this.loadImage(icon)
    ]);
    return { background: bgImg, icon: iconImg };
  }

  /**
   * 预加载所有牌相关资源（组合方案：2张底图 + 8张道具图标 = 10张）
   */
  async preloadCards() {
    const promises = [];
    const bgStates = ['default', 'glow'];
    const cardTypes = Object.keys(ASSETS_CONFIG.cards.icons);

    this.totalAssets = bgStates.length + cardTypes.length;
    this.loadedAssets = 0;

    for (const state of bgStates) {
      promises.push(this.loadImage(ASSETS_CONFIG.getCardBackground(state)));
    }
    for (const cardType of cardTypes) {
      promises.push(this.loadImage(ASSETS_CONFIG.getCardIcon(cardType)));
    }

    try {
      await Promise.all(promises);
      console.log(`✅ Card assets preloaded (${this.loadedAssets}/${this.totalAssets})`);
    } catch (error) {
      console.error('❌ Error preloading cards:', error);
      throw error;
    }
  }
  
  /**
   * 加载图标
   * @param {string} category - 图标分类
   * @param {string} name - 图标名称
   * @returns {Promise<Image>}
   */
  async loadIcon(category, name) {
    const src = ASSETS_CONFIG.getIconPath(category, name);
    if (!src) {
      throw new Error(`Icon not found: ${category}/${name}`);
    }
    return this.loadImage(src);
  }
  
  /**
   * 加载按钮图片
   * @param {string} name - 按钮名称
   * @returns {Promise<Image>}
   */
  async loadButton(name) {
    const src = ASSETS_CONFIG.getButtonPath(name);
    if (!src) {
      throw new Error(`Button not found: ${name}`);
    }
    return this.loadImage(src);
  }
  
  /**
   * 加载背景图片
   * @param {string} name - 背景名称
   * @returns {Promise<Image>}
   */
  async loadBackground(name) {
    const bg = ASSETS_CONFIG.backgrounds[name];
    if (!bg) {
      throw new Error(`Background not found: ${name}`);
    }
    return this.loadImage(bg);
  }

  /**
   * 加载UI组件图片（最简：托盘等）
   * @param {string} name - UI名称 (trayBg)
   * @returns {Promise<Image>}
   */
  async loadUI(name) {
    const src = ASSETS_CONFIG.ui && ASSETS_CONFIG.ui[name];
    if (!src) {
      throw new Error(`UI asset not found: ${name}`);
    }
    return this.loadImage(src);
  }
  
  /**
   * 预加载关键资源（游戏开始前，最简方案）
   */
  async preloadCriticalAssets() {
    const promises = [];
    
    promises.push(this.preloadCards());
    
    const criticalIcons = [
      { category: 'props', name: 'undo' },
      { category: 'props', name: 'shuffle' },
      { category: 'props', name: 'remove' },
      { category: 'modes', name: 'freeMode' },
      { category: 'modes', name: 'betMode' }
    ];
    
    for (const icon of criticalIcons) {
      promises.push(this.loadIcon(icon.category, icon.name));
    }
    
    promises.push(this.loadBackground('game'));
    promises.push(this.loadUI('trayBg'));
    
    try {
      await Promise.all(promises);
      console.log('✅ Critical assets preloaded');
    } catch (error) {
      console.error('❌ Error preloading critical assets:', error);
      throw error;
    }
  }
  
  /**
   * 获取已加载的图片
   * @param {string} src - 图片路径
   * @returns {Image|null}
   */
  getLoadedImage(src) {
    return this.loadedImages.get(src) || null;
  }
  
  /**
   * 清除所有缓存的图片
   */
  clearCache() {
    this.loadedImages.clear();
    this.loadingPromises.clear();
    this.loadedAssets = 0;
    this.totalAssets = 0;
  }
  
  /**
   * 获取加载统计
   * @returns {Object} 加载统计信息
   */
  getStats() {
    return {
      loaded: this.loadedAssets,
      total: this.totalAssets,
      cached: this.loadedImages.size,
      loading: this.loadingPromises.size
    };
  }
}

// 导出单例
let instance = null;

export default function getAssetLoader() {
  if (!instance) {
    instance = new AssetLoader();
  }
  return instance;
}

// 也可以直接导出类
export { AssetLoader };
