/**
 * 牌堆生成器
 * 402×874 布局：卡片区域 y:60-500，卡片 90×90，随机放置，边缘可溢出
 */

import ASSETS_CONFIG from '../config/assets.js';

const CARD_TYPES = Object.keys(ASSETS_CONFIG.cards.icons);
const CARD_WIDTH = 90;
const CARD_HEIGHT = 90;

const BOARD_LEFT = 0;
const BOARD_TOP = 60;
const BOARD_WIDTH = 402;
/** 留出底部 90px 缓冲避免被托盘遮挡，托盘 top 510，最低卡片底边不超 420 */
const BOARD_VISIBLE_BOTTOM = 420;
const BOARD_HEIGHT = BOARD_VISIBLE_BOTTOM - BOARD_TOP;
const MAX_X = BOARD_WIDTH - CARD_WIDTH;
const MAX_Y = BOARD_TOP + BOARD_HEIGHT - CARD_HEIGHT;

/**
 * Fisher-Yates 洗牌
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 在区域内随机放置卡片
 */
export function generateDeck(groupsPerType = 1) {
  const cards = [];
  let id = 0;

  for (const type of CARD_TYPES) {
    for (let g = 0; g < groupsPerType; g++) {
      for (let i = 0; i < 3; i++) {
        cards.push({ type, id: `card_${id++}` });
      }
    }
  }

  const shuffled = shuffle(cards);
  const result = [];

  for (let i = 0; i < shuffled.length; i++) {
    const card = shuffled[i];
    const x = Math.floor(Math.random() * (MAX_X + 1));
    const y = BOARD_TOP + Math.floor(Math.random() * (MAX_Y - BOARD_TOP + 1));
    result.push({
      ...card,
      layer: i,
      x,
      y,
      blockedBy: new Set()
    });
  }

  computeBlocking(result);
  return result;
}

function computeBlocking(cards) {
  for (let i = 0; i < cards.length; i++) {
    const a = cards[i];
    for (let j = i + 1; j < cards.length; j++) {
      const b = cards[j];
      if (b.layer <= a.layer) continue;
      if (overlaps(a, b)) {
        a.blockedBy.add(b.id);
      }
    }
  }
}

/**
 * 判断两张牌是否重叠（用于遮挡判定）
 * margin 越大，要求重叠区域越大才视为遮挡，可减少“视觉上未遮挡但被误判”的情况
 */
function overlaps(a, b) {
  const margin = 24; // 需至少重叠 24px 才视为遮挡，避免边缘轻微重叠导致误判
  return (
    a.x + CARD_WIDTH - margin > b.x &&
    b.x + CARD_WIDTH - margin > a.x &&
    a.y + CARD_HEIGHT - margin > b.y &&
    b.y + CARD_HEIGHT - margin > a.y
  );
}

/**
 * 获取可点击的牌（顶层且未被遮挡）
 */
export function getClickableCards(cards) {
  return cards.filter((c) => !c.removed && c.blockedBy.size === 0);
}

/**
 * 移除某张牌对其他牌的遮挡
 */
export function unblockCard(cards, cardId) {
  cards.forEach((c) => {
    if (c.blockedBy) c.blockedBy.delete(cardId);
  });
}

export { CARD_WIDTH, CARD_HEIGHT };
