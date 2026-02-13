# 性能优化实战指南

## 🎯 核心原则

**对于抽奖小游戏，原生JS+CSS完全足够，性能更好！**

## 📊 性能对比

### 方案对比

| 方案 | 文件大小 | 加载时间 | 动画FPS | 内存占用 | 推荐度 |
|------|---------|---------|---------|---------|--------|
| **原生JS+CSS** | 15KB | <1秒 | 60fps ✅ | 5MB | ⭐⭐⭐⭐⭐ |
| **Phaser引擎** | 800KB | 3-5秒 | 45fps | 25MB | ⭐⭐ |
| **Three.js** | 600KB | 2-4秒 | 30fps | 40MB | ⭐ |

## ✅ 最佳实践

### 1. 使用CSS动画（最重要！）

**为什么CSS动画更好？**
- GPU硬件加速
- 浏览器优化
- 不阻塞JavaScript线程
- 流畅60fps

**示例：抽奖转盘**

```css
/* ✅ 好的做法 */
.lottery-wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  transition: transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  will-change: transform; /* 提示浏览器优化 */
}

.lottery-wheel.spinning {
  transform: rotate(1800deg);
}

/* 奖品项 */
.prize-item {
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: right bottom;
  transition: transform 0.3s ease;
}

.prize-item:hover {
  transform: scale(1.1);
}
```

```javascript
// ✅ 好的做法：使用CSS类控制动画
function spinWheel() {
  const wheel = document.getElementById('wheel');
  const randomAngle = Math.random() * 360;
  const totalRotation = 1800 + randomAngle; // 转5圈+随机角度
  
  wheel.style.transform = `rotate(${totalRotation}deg)`;
  wheel.classList.add('spinning');
  
  setTimeout(() => {
    const prize = calculatePrize(randomAngle);
    showResult(prize);
    wheel.classList.remove('spinning');
  }, 3000);
}
```

```javascript
// ❌ 避免：用JavaScript频繁修改样式
function spinWheelBad() {
  let angle = 0;
  const interval = setInterval(() => {
    angle += 5;
    wheel.style.transform = `rotate(${angle}deg)`;
    if (angle >= 1800) {
      clearInterval(interval);
    }
  }, 16); // 性能差，可能卡顿
}
```

### 2. 优化图片资源

```javascript
// ✅ 好的做法
// 1. 使用WebP格式（体积小50%）
<img src="prize.webp" alt="奖品">

// 2. 使用SVG图标（矢量图，无限缩放）
<svg width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="#ff6b6b"/>
</svg>

// 3. 懒加载非关键图片
<img src="placeholder.jpg" data-src="prize.jpg" loading="lazy">

// 4. 响应式图片
<img srcset="prize-small.jpg 300w, prize-large.jpg 600w"
     sizes="(max-width: 600px) 300px, 600px"
     src="prize.jpg">
```

### 3. 减少DOM操作

```javascript
// ✅ 好的做法：批量更新DOM
function renderPrizes(prizes) {
  const fragment = document.createDocumentFragment();
  
  prizes.forEach(prize => {
    const div = document.createElement('div');
    div.className = 'prize-item';
    div.innerHTML = `
      <img src="${prize.image}" alt="${prize.name}">
      <span>${prize.name}</span>
    `;
    fragment.appendChild(div);
  });
  
  container.appendChild(fragment); // 只触发一次重排
}

// ❌ 避免：频繁操作DOM
function renderPrizesBad(prizes) {
  prizes.forEach(prize => {
    const div = document.createElement('div');
    div.innerHTML = prize.name;
    container.appendChild(div); // 每次都触发重排，性能差
  });
}
```

### 4. 使用事件委托

```javascript
// ✅ 好的做法：事件委托
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('lottery-btn')) {
    handleLottery();
  } else if (e.target.classList.contains('prize-item')) {
    showPrizeDetail(e.target.dataset.id);
  }
});

// ❌ 避免：为每个元素绑定事件
document.querySelectorAll('.lottery-btn').forEach(btn => {
  btn.addEventListener('click', handleLottery); // 内存占用大
});
```

### 5. 防抖和节流

```javascript
// ✅ 好的做法：防抖（防止重复点击）
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const handleLottery = debounce(() => {
  spinWheel();
}, 300); // 300ms内只执行一次

// ✅ 好的做法：节流（限制频率）
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

### 6. 代码分割和懒加载

```javascript
// ✅ 好的做法：按需加载
async function loadPrizeDetail(id) {
  const module = await import('./prize-detail.js');
  module.showDetail(id);
}

// ✅ 好的做法：延迟加载非关键功能
window.addEventListener('load', () => {
  // 页面加载完成后再加载非关键功能
  import('./analytics.js');
});
```

### 7. 使用Web Workers（如果需要复杂计算）

```javascript
// ✅ 好的做法：在Worker中处理复杂计算
// worker.js
self.onmessage = function(e) {
  const result = complexCalculation(e.data);
  self.postMessage(result);
};

// main.js
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (e) => {
  updateUI(e.data);
};
```

## 🎨 完整示例：流畅的抽奖转盘

### HTML结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>抽奖转盘</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="lottery-container">
    <div class="wheel" id="wheel">
      <div class="prize-item" data-prize="1">奖品1</div>
      <div class="prize-item" data-prize="2">奖品2</div>
      <div class="prize-item" data-prize="3">奖品3</div>
      <div class="prize-item" data-prize="4">奖品4</div>
      <div class="prize-item" data-prize="5">奖品5</div>
      <div class="prize-item" data-prize="6">奖品6</div>
    </div>
    <div class="pointer"></div>
    <button class="spin-btn" id="spinBtn">开始抽奖</button>
    <div class="result" id="result"></div>
  </div>
  <script src="lottery.js"></script>
</body>
</html>
```

### CSS样式（关键：使用transform）

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.lottery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #ff6b6b 0deg 60deg,
    #4ecdc4 60deg 120deg,
    #45b7d1 120deg 180deg,
    #f9ca24 180deg 240deg,
    #f0932b 240deg 300deg,
    #eb4d4b 300deg 360deg
  );
  border: 10px solid #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  will-change: transform; /* 关键：提示浏览器优化 */
}

.wheel.spinning {
  /* 动画由JavaScript动态设置 */
}

.prize-item {
  position: absolute;
  width: 50%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  transform-origin: right bottom;
}

.prize-item:nth-child(1) { transform: rotate(0deg); }
.prize-item:nth-child(2) { transform: rotate(60deg); }
.prize-item:nth-child(3) { transform: rotate(120deg); }
.prize-item:nth-child(4) { transform: rotate(180deg); }
.prize-item:nth-child(5) { transform: rotate(240deg); }
.prize-item:nth-child(6) { transform: rotate(300deg); }

.pointer {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 40px solid #fff;
  position: absolute;
  top: 50px;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.spin-btn {
  margin-top: 30px;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.spin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.spin-btn:active {
  transform: translateY(0);
}

.spin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  min-height: 30px;
}
```

### JavaScript逻辑（简洁高效）

```javascript
class LotteryWheel {
  constructor() {
    this.wheel = document.getElementById('wheel');
    this.spinBtn = document.getElementById('spinBtn');
    this.result = document.getElementById('result');
    this.isSpinning = false;
    this.prizes = ['奖品1', '奖品2', '奖品3', '奖品4', '奖品5', '奖品6'];
    
    this.init();
  }
  
  init() {
    this.spinBtn.addEventListener('click', () => this.spin());
  }
  
  spin() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.spinBtn.disabled = true;
    this.result.textContent = '';
    
    // 计算随机角度
    const randomAngle = Math.random() * 360;
    const totalRotation = 1800 + randomAngle; // 转5圈+随机角度
    
    // 使用CSS transform，GPU加速
    this.wheel.style.transform = `rotate(${totalRotation}deg)`;
    this.wheel.classList.add('spinning');
    
    // 3秒后显示结果
    setTimeout(() => {
      const prizeIndex = Math.floor((360 - (randomAngle % 360)) / 60);
      const prize = this.prizes[prizeIndex];
      
      this.showResult(prize);
      this.wheel.classList.remove('spinning');
      this.isSpinning = false;
      this.spinBtn.disabled = false;
    }, 3000);
  }
  
  showResult(prize) {
    this.result.textContent = `恭喜获得：${prize}！`;
    this.result.style.animation = 'fadeIn 0.5s ease-in';
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new LotteryWheel();
});
```

## 📱 Telegram Mini App 优化

### 1. 使用Telegram Web App SDK

```javascript
// 使用Telegram提供的SDK
const tg = window.Telegram.WebApp;

// 初始化
tg.ready();
tg.expand(); // 展开到全屏

// 优化：使用Telegram的主题色
document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
```

### 2. 预加载关键资源

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="wheel-bg.jpg" as="image">
<link rel="preload" href="lottery.js" as="script">
```

### 3. 使用Service Worker缓存（可选）

```javascript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('lottery-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/lottery.js',
        '/wheel-bg.jpg'
      ]);
    })
  );
});
```

## 🔍 性能测试工具

### 1. Chrome DevTools

```javascript
// 在控制台运行
performance.mark('start');
// 执行你的代码
performance.mark('end');
performance.measure('duration', 'start', 'end');
console.log(performance.getEntriesByType('measure'));
```

### 2. 监控FPS

```javascript
let lastTime = performance.now();
let frameCount = 0;

function checkFPS() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(checkFPS);
}

requestAnimationFrame(checkFPS);
```

## ✅ 性能检查清单

开发时检查：
- [ ] 使用CSS动画而不是JS动画
- [ ] 图片已压缩（WebP或压缩PNG）
- [ ] 使用transform而不是改变位置
- [ ] 避免频繁DOM操作
- [ ] 使用事件委托
- [ ] 代码已压缩（生产环境）
- [ ] 避免加载不必要的库
- [ ] 使用懒加载
- [ ] 减少HTTP请求
- [ ] 使用will-change提示浏览器优化

## 🎯 总结

1. **不需要游戏引擎** - 原生JS+CSS足够
2. **使用CSS动画** - GPU加速，流畅60fps
3. **优化资源** - 压缩图片，使用WebP
4. **减少DOM操作** - 批量更新，使用fragment
5. **事件委托** - 减少内存占用
6. **代码优化** - 压缩、懒加载、代码分割

**记住：简单的事情用简单的方案！**
