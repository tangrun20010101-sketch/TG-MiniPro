/**
 * 视口缩放：将固定尺寸内容适配到屏幕
 * 用于 Telegram Mini App 等小屏环境
 */

const DESIGN_WIDTH = 402;
const DESIGN_HEIGHT = 874;

/**
 * 计算缩放比例，使内容完整显示在视口内
 */
export function getViewportScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT, 1.5);
}

/**
 * 对指定元素应用视口缩放
 * @param {HTMLElement} el - 要缩放的元素（设计稿尺寸 402×874）
 */
export function applyViewportScale(el) {
  if (!el) return;
  const scale = getViewportScale();
  el.style.transform = `scale(${scale})`;
}

/**
 * 初始化视口缩放，并在 resize 时更新
 * @param {HTMLElement} el - 要缩放的元素
 */
export function initViewportScale(el) {
  if (!el) return;
  applyViewportScale(el);
  window.addEventListener('resize', () => applyViewportScale(el));
  window.addEventListener('orientationchange', () => {
    setTimeout(() => applyViewportScale(el), 100);
  });
}
