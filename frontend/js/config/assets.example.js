/**
 * 资源路径配置示例（组合方案）
 * 复制此文件为 assets.js 并修改路径
 *
 * 组合方案：福牌 = 统一卡牌底图 + 道具图标 叠加
 * 渲染时：底图在下，道具图标居中贴在上层
 */

// 资源路径配置
const ASSETS_CONFIG = {
  // 基础路径
  basePath: '/assets/images',

  // 福牌组成（组合方案）
  cards: {
    // 统一卡牌底图（所有牌共用）
    background: {
      default: '/assets/images/cards/card_bg_default.png',  // 主图
      glow: '/assets/images/cards/card_bg_glow.png'         // 发光效果
    },
    // 道具图标（贴到卡牌中心）
    icons: {
      red_packet: '/assets/images/cards/icons/red_packet.png',
      firecracker: '/assets/images/cards/icons/firecracker.png',
      dumpling: '/assets/images/cards/icons/dumpling.png',
      lantern: '/assets/images/cards/icons/lantern.png',
      fu: '/assets/images/cards/icons/fu.png',
      ingot: '/assets/images/cards/icons/ingot.png',
      caishen: '/assets/images/cards/icons/caishen.png',
      firework: '/assets/images/cards/icons/firework.png'
    }
  },
  
  // 图标路径（最简：仅5个，其余用 CSS/文字）
  icons: {
    props: {
      undo: '/assets/images/icons/props/undo.png',
      shuffle: '/assets/images/icons/props/shuffle.png',
      remove: '/assets/images/icons/props/remove.png'
    },
    modes: {
      freeMode: '/assets/images/icons/modes/free_mode.png',
      betMode: '/assets/images/icons/modes/bet_mode.png'
    }
  },

  // 按钮：无图片，用 CSS + 文字
  // buttons 保留空对象供扩展，或延后添加
  buttons: {},
  
  // 背景路径（最简：1张共用）
  backgrounds: {
    game: '/assets/images/backgrounds/game_bg.png'
  },
  
  // UI组件（最简：仅托盘）
  ui: {
    trayBg: '/assets/images/ui/tray_bg.png'
  },

  // 以下延后，功能开发时再添加
  // decorations: {},
  // effects: {},
  // nft: {},
  // payment: {},
  // redPacket: {},
  
  // 应用图标（最简：1张即可）
  app: {
    icon128: '/assets/images/app/icon_128.png'
  },
  
  /**
   * 获取卡牌底图路径（组合方案）
   * @param {string} state - 状态 (default|glow)
   * @returns {string} 底图路径
   */
  getCardBackground(state = 'default') {
    return this.cards.background[state] || this.cards.background.default;
  },

  /**
   * 获取福牌道具图标路径（组合方案）
   * @param {string} cardType - 牌类型 (red_packet|firecracker|dumpling|lantern|fu|ingot|caishen|firework)
   * @returns {string} 道具图标路径
   */
  getCardIcon(cardType) {
    const icon = this.cards.icons[cardType];
    if (!icon) {
      console.warn(`Card type ${cardType} not found, using red_packet`);
      return this.cards.icons.red_packet;
    }
    return icon;
  },

  /**
   * 获取牌组合路径（组合方案，用于需要同时获取底图+图标的场景）
   * @param {string} cardType - 牌类型
   * @param {string} state - 状态 (default|glow)
   * @returns {{ background: string, icon: string }}
   */
  getCardParts(cardType, state = 'default') {
    return {
      background: this.getCardBackground(state),
      icon: this.getCardIcon(cardType)
    };
  },

  /**
   * @deprecated 组合方案请使用 getCardBackground + getCardIcon
   * 为兼容旧代码保留，返回组合信息（调用方需分别加载 background 和 icon）
   */
  getCardPath(cardType, state = 'default') {
    return this.getCardBackground(state);
  },
  
  /**
   * 获取图标路径（最简方案：仅 props、modes）
   * @param {string} category - 图标分类 (props|modes)
   * @param {string} name - 图标名称
   * @returns {string} 图标路径
   */
  getIconPath(category, name) {
    const iconCategory = this.icons[category];
    if (!iconCategory) {
      console.warn(`Icon category ${category} not found`);
      return '';
    }
    return iconCategory[name] || '';
  },
  
  /**
   * 获取按钮路径（简化：只有主状态，hover/pressed 用 CSS）
   * @param {string} name - 按钮名称
   * @param {string} state - 忽略，简化方案只有主状态
   * @returns {string} 按钮路径
   */
  getButtonPath(name) {
    return this.buttons[name] || '';
  }
};

// 导出配置（根据模块系统选择）
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = ASSETS_CONFIG;
} else {
  // ES6 Module
  export default ASSETS_CONFIG;
}
