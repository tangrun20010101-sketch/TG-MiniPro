/**
 * 抽奖页逻辑 - Figma 67-184
 * 功能：返回、设置、转盘抽奖、顶部金币、底部统计（麒麟/金币/财神）
 */

// 返回首页
document.getElementById('lottery-btn-back')?.addEventListener('click', () => {
  window.location.href = '/';
});

// 设置弹窗
const settingsOverlay = document.getElementById('lottery-settings-overlay');
const btnSettings = document.getElementById('lottery-btn-settings');
const btnSettingsClose = document.getElementById('lottery-settings-close');

btnSettings?.addEventListener('click', () => {
  if (settingsOverlay) settingsOverlay.style.display = 'flex';
});

btnSettingsClose?.addEventListener('click', () => {
  if (settingsOverlay) settingsOverlay.style.display = 'none';
});

// 视口适配
function fitViewport() {
  const scaler = document.querySelector('.viewport-scaler');
  const container = document.querySelector('.lottery-container');
  if (!scaler || !container) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(vw / 402, vh / 874, 1.5);
  container.style.transform = `scale(${scale})`;
}

fitViewport();
window.addEventListener('resize', fitViewport);
window.addEventListener('orientationchange', () => setTimeout(fitViewport, 100));

// 更新顶部金币、底部统计（TODO: 从 API 获取）
function updateStats() {
  // TODO: 从 /api/user 等获取
  const coin = 0;
  const shiziCount = 0;
  const caishenCount = 0;

  const coinEl = document.getElementById('lottery-coin-value');
  const coinFooter = document.getElementById('lottery-coin-footer');
  const shiziEl = document.getElementById('lottery-shizi-count');
  const caishenEl = document.getElementById('lottery-caishen-count');

  if (coinEl) coinEl.textContent = String(coin);
  if (coinFooter) coinFooter.textContent = String(coin);
  if (shiziEl) shiziEl.textContent = String(shiziCount);
  if (caishenEl) caishenEl.textContent = String(caishenCount);
}

updateStats();

// 抽奖按钮：按住开始旋转箭头、松手请求（TODO: 接入转盘动画与抽奖 API）
const drawBtn = document.getElementById('lottery-draw-btn');
const pointerEl = document.getElementById('lottery-pointer');
if (drawBtn && pointerEl) {
  let pressStart = 0;
  drawBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pressStart = Date.now();
    pointerEl.classList.add('is-spinning');
  });
  drawBtn.addEventListener('pointerup', () => {
    const duration = Date.now() - pressStart;
    pointerEl.classList.remove('is-spinning');
    // TODO: 转盘旋转动画 + POST /api/lottery/draw
    console.log('抽奖松手，按下时长:', duration, 'ms');
  });
  drawBtn.addEventListener('pointerleave', () => {
    if (pressStart) {
      const duration = Date.now() - pressStart;
      console.log('抽奖离开，按下时长:', duration, 'ms');
    }
    pressStart = 0;
    pointerEl.classList.remove('is-spinning');
  });
}
