/**
 * 资源使用示例
 * 展示如何在代码中使用资源加载器
 */

import getAssetLoader from '../utils/AssetLoader.js';
import ASSETS_CONFIG from '../config/assets.js';

// 获取资源加载器实例
const assetLoader = getAssetLoader();

// ============================================
// 示例1: 预加载资源
// ============================================

async function preloadAssets() {
  // 设置进度回调
  assetLoader.setProgressCallback((loaded, total) => {
    const progress = (loaded / total * 100).toFixed(1);
    console.log(`Loading: ${progress}% (${loaded}/${total})`);
    
    // 更新UI进度条
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  });
  
  try {
    // 预加载关键资源
    await assetLoader.preloadCriticalAssets();
    console.log('✅ Critical assets loaded');
    
    // 预加载所有牌图片
    await assetLoader.preloadCards();
    console.log('✅ All cards loaded');
  } catch (error) {
    console.error('❌ Failed to preload assets:', error);
  }
}

// ============================================
// 示例2: 在Canvas中渲染牌（组合方案：底图+道具图标）
// ============================================

class CardRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assetLoader = getAssetLoader();
  }

  /**
   * 渲染牌（组合方案：先画底图，再画道具图标居中）
   * @param {Object} card - 牌对象 {type, position, state}
   */
  async renderCard(card) {
    const { type, position, state = 'default' } = card;
    const CARD_W = 60;
    const CARD_H = 80;
    const ICON_W = 40;
    const ICON_H = 50;
    const ICON_OFFSET_X = (CARD_W - ICON_W) / 2;  // 10
    const ICON_OFFSET_Y = (CARD_H - ICON_H) / 2;  // 15

    try {
      const { background, icon } = await this.assetLoader.loadCardParts(type, state);
      // 先画底图
      this.ctx.drawImage(background, position.x, position.y, CARD_W, CARD_H);
      // 再画道具图标居中
      this.ctx.drawImage(icon, position.x + ICON_OFFSET_X, position.y + ICON_OFFSET_Y, ICON_W, ICON_H);
    } catch (error) {
      console.error(`Failed to render card ${type}:`, error);
      this.renderPlaceholder(position);
    }
  }

  renderPlaceholder(position) {
    this.ctx.fillStyle = '#ccc';
    this.ctx.fillRect(position.x, position.y, 60, 80);
    this.ctx.strokeStyle = '#999';
    this.ctx.strokeRect(position.x, position.y, 60, 80);
  }

  async renderCards(cards) {
    const promises = cards.map(card => this.renderCard(card));
    await Promise.all(promises);
  }
}

// ============================================
// 示例3: 在DOM中使用图片（组合方案）
// ============================================

/**
 * 创建牌元素（组合方案：底图div + 道具图标img）
 * @param {string} cardType - 牌类型
 * @param {string} state - 状态
 * @returns {Promise<HTMLElement>}
 */
async function createCardElement(cardType, state = 'default') {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.dataset.cardType = cardType;
  cardDiv.style.cssText = 'position:relative;width:60px;height:80px;background-size:cover;';

  try {
    const { background, icon } = ASSETS_CONFIG.getCardParts(cardType, state);
    await Promise.all([assetLoader.loadImage(background), assetLoader.loadImage(icon)]);

    cardDiv.style.backgroundImage = `url(${background})`;
    const iconImg = document.createElement('img');
    iconImg.src = icon;
    iconImg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:50px;object-fit:contain;';
    cardDiv.appendChild(iconImg);
    return cardDiv;
  } catch (error) {
    console.error(`Failed to create card element ${cardType}:`, error);
    cardDiv.textContent = cardType;
    return cardDiv;
  }
}

// ============================================
// 示例4: 使用CSS背景图片（组合方案）
// ============================================

/**
 * 设置卡牌样式（组合方案：底图作背景，道具图标居中）
 * @param {HTMLElement} element - DOM元素
 * @param {string} cardType - 牌类型
 * @param {string} state - 状态
 */
async function setCardBackground(element, cardType, state = 'default') {
  const { background, icon } = ASSETS_CONFIG.getCardParts(cardType, state);
  await Promise.all([assetLoader.loadImage(background), assetLoader.loadImage(icon)]);

  element.style.backgroundImage = `url(${background})`;
  element.style.backgroundSize = 'cover';
  element.dataset.cardIcon = icon;
  // 道具图标可用 ::before 或内部 img 显示
}

// ============================================
// 示例5: 预加载特定资源（组合方案）
// ============================================

async function preloadSpecificCardIcons() {
  // 只预加载特定类型的道具图标
  const cardTypes = ['red_packet', 'firecracker', 'dumpling'];
  for (const cardType of cardTypes) {
    await assetLoader.loadImage(ASSETS_CONFIG.getCardIcon(cardType));
  }
}

// ============================================
// 示例6: 使用图标
// ============================================

async function createPropButton(propType) {
  const button = document.createElement('button');
  button.className = 'prop-button';
  button.dataset.propType = propType;
  
  try {
    const iconPath = ASSETS_CONFIG.getIconPath('props', propType);
    await assetLoader.loadImage(iconPath);
    
    const iconElement = document.createElement('img');
    iconElement.src = iconPath;
    iconElement.width = 24;
    iconElement.height = 24;
    iconElement.alt = propType;
    button.appendChild(iconElement);
    
    return button;
  } catch (error) {
    console.error(`Failed to create prop button ${propType}:`, error);
    button.textContent = propType;
    return button;
  }
}

// ============================================
// 示例7: 游戏初始化时预加载
// ============================================

class Game {
  async init() {
    // 显示加载界面
    this.showLoadingScreen();
    
    // 预加载资源
    assetLoader.setProgressCallback((loaded, total) => {
      this.updateLoadingProgress(loaded, total);
    });
    
    try {
      // 预加载关键资源
      await assetLoader.preloadCriticalAssets();
      
      // 隐藏加载界面
      this.hideLoadingScreen();
      
      // 开始游戏
      this.start();
    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.showError('Failed to load game assets');
    }
  }
  
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }
  
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }
  
  updateLoadingProgress(loaded, total) {
    const progress = (loaded / total * 100).toFixed(1);
    const progressText = document.getElementById('loading-progress-text');
    if (progressText) {
      progressText.textContent = `Loading... ${progress}%`;
    }
  }
  
  start() {
    console.log('Game started!');
    // 游戏逻辑
  }
  
  showError(message) {
    console.error(message);
    // 显示错误提示
  }
}

// ============================================
// 示例8: 检查资源是否已加载
// ============================================

function checkResourceLoaded(imagePath) {
  const img = assetLoader.getLoadedImage(imagePath);
  if (img) {
    console.log(`✅ Image ${imagePath} is loaded`);
    return true;
  } else {
    console.log(`❌ Image ${imagePath} is not loaded`);
    return false;
  }
}

// ============================================
// 示例9: 获取加载统计
// ============================================

function showLoadingStats() {
  const stats = assetLoader.getStats();
  console.log('Loading Stats:', {
    loaded: stats.loaded,
    total: stats.total,
    cached: stats.cached,
    loading: stats.loading,
    progress: `${(stats.loaded / stats.total * 100).toFixed(1)}%`
  });
}

// ============================================
// 导出示例函数
// ============================================

export {
  preloadAssets,
  CardRenderer,
  createCardElement,
  setCardBackground,
  preloadSpecificCardIcons,
  createPropButton,
  Game,
  checkResourceLoaded,
  showLoadingStats
};
