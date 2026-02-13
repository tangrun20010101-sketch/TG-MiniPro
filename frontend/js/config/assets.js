/**
 * 资源路径配置（直接卡牌方案）
 * 每张卡牌为完整图片，无底图叠加
 */

const ASSETS_CONFIG = {
  basePath: '/assets/images',

  cards: {
    icons: {
      bianpao: '/assets/images/cards/icons/bianpao.png',
      caishen: '/assets/images/cards/icons/caishen.png',
      hua: '/assets/images/cards/icons/hua.png',
      jiaozi: '/assets/images/cards/icons/jiaozi.png',
      lantern: '/assets/images/cards/icons/lantern.png',
      shizi: '/assets/images/cards/icons/shizi.png',
      tiehua: '/assets/images/cards/icons/tiehua.png',
      xingxing: '/assets/images/cards/icons/xingxing.png',
      yuanbao: '/assets/images/cards/icons/yuanbao.png',
      yun: '/assets/images/cards/icons/yun.png'
    }
  },

  icons: {
    header: {
      back: '/assets/images/icons/header/back.png',
      settings: '/assets/images/icons/header/setting.png'
    },
    props: {
      undo: '/assets/images/icons/props/undo.png',
      shuffle: '/assets/images/icons/props/shuffle.png',
      remove: '/assets/images/icons/props/remove.png'
    },
    modes: {
      freeMode: '/assets/images/icons/props/freemode.png',
      betMode: '/assets/images/icons/props/betmode.png'
    }
  },

  buttons: {},
  backgrounds: {
    game: '/assets/images/backgrounds/game_bg.png'
  },
  ui: {
    trayBg: '/assets/images/ui/tray_bg.png'
  },
  app: {
    icon128: '/assets/images/app/Logo.png'
  },

  getCardImage(cardType) {
    const path = this.cards.icons[cardType];
    if (!path) {
      const first = Object.values(this.cards.icons)[0];
      console.warn(`Card type ${cardType} not found, using ${first}`);
      return first;
    }
    return path;
  },

  getIconPath(category, name) {
    const iconCategory = this.icons[category];
    if (!iconCategory) return '';
    return iconCategory[name] || '';
  },

  getButtonPath(name) {
    return this.buttons[name] || '';
  }
};

export default ASSETS_CONFIG;
