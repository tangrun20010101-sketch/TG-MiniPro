# 技术实现指南

## 🎯 游戏核心实现

### 一、牌堆生成算法（关键难点）

#### 问题：如何确保游戏有解？

**解决方案：反向生成算法**

```javascript
class CardGenerator {
  /**
   * 生成有解的牌堆
   * 策略：先确定解，再随机打乱
   */
  generateSolvableBoard(totalCards = 100) {
    // 1. 确定需要多少组3张相同的牌
    const groups = Math.floor(totalCards / 3);
    
    // 2. 生成牌组（每组3张相同）
    const cardGroups = [];
    const cardTypes = ['red_packet', 'firecracker', 'dumpling', 'lantern', 'fu', 'ingot'];
    
    for (let i = 0; i < groups; i++) {
      const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      cardGroups.push([cardType, cardType, cardType]);
    }
    
    // 3. 打乱牌组顺序
    const shuffled = this.shuffleArray(cardGroups.flat());
    
    // 4. 分层放置（确保有解）
    return this.layerCards(shuffled);
  }
  
  /**
   * 将牌分层放置
   * 确保上层牌不会完全遮挡下层牌
   */
  layerCards(cards) {
    const layers = [];
    const cardsPerLayer = Math.ceil(cards.length / 5); // 假设5层
    
    for (let i = 0; i < cards.length; i += cardsPerLayer) {
      const layer = cards.slice(i, i + cardsPerLayer);
      layers.push(layer.map((type, index) => ({
        id: `card_${i + index}`,
        type: type,
        layer: Math.floor(i / cardsPerLayer),
        position: this.calculatePosition(index, layers.length),
        isVisible: true,
        isSpecial: Math.random() < 0.05 // 5%概率是特殊牌
      })));
    }
    
    return layers.flat();
  }
  
  /**
   * 计算牌的位置（避免重叠）
   */
  calculatePosition(index, layer) {
    const spacing = 80;
    const startX = 50;
    const startY = 100 + layer * 20; // 每层稍微偏移
    
    return {
      x: startX + (index % 5) * spacing,
      y: startY + Math.floor(index / 5) * spacing
    };
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
```

### 二、托盘和消除检测

```javascript
class Tray {
  constructor(maxSlots = 7) {
    this.maxSlots = maxSlots;
    this.slots = Array(maxSlots).fill(null);
  }
  
  /**
   * 添加牌到托盘
   */
  addCard(card) {
    const emptyIndex = this.slots.findIndex(slot => slot === null);
    
    if (emptyIndex === -1) {
      // 托盘已满
      return { success: false, message: '托盘已满' };
    }
    
    this.slots[emptyIndex] = card;
    
    // 检查是否可以消除
    const eliminationResult = this.checkElimination();
    
    return {
      success: true,
      eliminated: eliminationResult.eliminated,
      cards: eliminationResult.cards
    };
  }
  
  /**
   * 检查是否有3张相同的牌可以消除
   */
  checkElimination() {
    const cardCounts = {};
    
    // 统计每种牌的数量
    this.slots.forEach(slot => {
      if (slot) {
        cardCounts[slot.type] = (cardCounts[slot.type] || 0) + 1;
      }
    });
    
    // 查找是否有3张相同的
    for (const [type, count] of Object.entries(cardCounts)) {
      if (count >= 3) {
        // 找到3张相同的，移除它们
        const indices = [];
        for (let i = 0; i < this.slots.length; i++) {
          if (this.slots[i] && this.slots[i].type === type) {
            indices.push(i);
            if (indices.length === 3) break;
          }
        }
        
        // 移除这3张牌
        indices.forEach(i => this.slots[i] = null);
        
        return {
          eliminated: true,
          cards: indices.map(i => this.slots[i]),
          type: type
        };
      }
    }
    
    return { eliminated: false };
  }
  
  /**
   * 检查是否失败（托盘满且无法消除）
   */
  isFailed() {
    if (this.slots.every(slot => slot !== null)) {
      // 托盘满了，检查是否可以消除
      return !this.checkElimination().eliminated;
    }
    return false;
  }
}
```

### 三、游戏主逻辑

```javascript
class Game {
  constructor(mode = 'free') {
    this.mode = mode; // 'free' | 'bet'
    this.timeLimit = 150; // 秒
    this.remainingTime = 150;
    this.score = 0;
    this.status = 'waiting'; // 'waiting' | 'playing' | 'win' | 'lose' | 'timeout'
    
    this.generator = new CardGenerator();
    this.tray = new Tray(7);
    this.board = [];
    this.eliminatedCount = 0;
    this.totalCards = 0;
    
    this.props = {
      undo: 1,
      shuffle: 1,
      remove: 1
    };
    
    this.history = []; // 用于撤回功能
  }
  
  /**
   * 开始游戏
   */
  start() {
    this.board = this.generator.generateSolvableBoard(100);
    this.totalCards = this.board.length;
    this.status = 'playing';
    this.startTimer();
  }
  
  /**
   * 点击牌
   */
  selectCard(cardId) {
    if (this.status !== 'playing') return;
    
    const card = this.board.find(c => c.id === cardId);
    if (!card || !card.isVisible) return;
    
    // 保存历史（用于撤回）
    this.history.push({
      action: 'select',
      card: JSON.parse(JSON.stringify(card)),
      tray: JSON.parse(JSON.stringify(this.tray.slots))
    });
    
    // 添加到托盘
    const result = this.tray.addCard(card);
    
    // 从场上移除
    this.board = this.board.filter(c => c.id !== cardId);
    this.eliminatedCount++;
    
    // 检查消除
    if (result.eliminated) {
      this.score += 10;
      this.playEliminationAnimation(result.cards);
    }
    
    // 更新可见性
    this.updateCardVisibility();
    
    // 检查游戏状态
    this.checkGameState();
  }
  
  /**
   * 更新牌的可见性（只有最上层可见）
   */
  updateCardVisibility() {
    // 按位置分组
    const positionGroups = {};
    this.board.forEach(card => {
      const key = `${card.position.x}_${card.position.y}`;
      if (!positionGroups[key]) {
        positionGroups[key] = [];
      }
      positionGroups[key].push(card);
    });
    
    // 设置可见性
    Object.values(positionGroups).forEach(group => {
      // 找到最上层的牌
      const topCard = group.reduce((max, card) => 
        card.layer > max.layer ? card : max
      );
      
      group.forEach(card => {
        card.isVisible = card.id === topCard.id;
      });
    });
  }
  
  /**
   * 检查游戏状态
   */
  checkGameState() {
    // 检查通关
    if (this.board.length === 0) {
      this.status = 'win';
      this.endGame();
      return;
    }
    
    // 检查失败
    if (this.tray.isFailed()) {
      this.status = 'lose';
      this.endGame();
      return;
    }
  }
  
  /**
   * 使用道具：撤回
   */
  useUndo() {
    if (this.props.undo <= 0) return false;
    if (this.history.length === 0) return false;
    
    const lastAction = this.history.pop();
    
    // 恢复牌到场上
    this.board.push(lastAction.card);
    
    // 恢复托盘
    this.tray.slots = lastAction.tray;
    
    this.props.undo--;
    this.updateCardVisibility();
    return true;
  }
  
  /**
   * 使用道具：洗牌
   */
  useShuffle() {
    if (this.props.shuffle <= 0) return false;
    
    // 只洗可见的牌
    const visibleCards = this.board.filter(c => c.isVisible);
    const shuffled = this.shuffleArray(visibleCards);
    
    // 重新分配位置
    shuffled.forEach((card, index) => {
      card.position = this.calculatePosition(index, card.layer);
    });
    
    this.props.shuffle--;
    return true;
  }
  
  /**
   * 使用道具：移除
   */
  useRemove(slotIndex) {
    if (this.props.remove <= 0) return false;
    if (!this.tray.slots[slotIndex]) return false;
    
    this.tray.slots[slotIndex] = null;
    this.props.remove--;
    return true;
  }
  
  /**
   * 开始倒计时
   */
  startTimer() {
    this.timer = setInterval(() => {
      this.remainingTime--;
      
      if (this.remainingTime <= 0) {
        this.status = 'timeout';
        this.endGame();
      }
    }, 1000);
  }
  
  /**
   * 结束游戏
   */
  endGame() {
    clearInterval(this.timer);
    this.calculateRewards();
  }
  
  /**
   * 计算奖励
   */
  calculateRewards() {
    const baseReward = this.score;
    const multiplier = this.mode === 'bet' ? 2 : 1;
    
    return {
      fukien: baseReward * multiplier, // 福签
      tokens: this.mode === 'bet' && this.status === 'win' ? 100 : 0,
      nft: this.getEarnedNFTs()
    };
  }
  
  getEarnedNFTs() {
    // 返回本局获得的NFT
    return [];
  }
}
```

### 四、Canvas渲染（可选）

```javascript
class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cardImages = {}; // 预加载的图片
  }
  
  /**
   * 渲染游戏画面
   */
  render(game) {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 渲染场上的牌
    game.board.forEach(card => {
      if (card.isVisible) {
        this.renderCard(card);
      }
    });
    
    // 渲染托盘
    this.renderTray(game.tray);
    
    // 渲染UI（时间、分数等）
    this.renderUI(game);
  }
  
  /**
   * 渲染单张牌
   */
  renderCard(card) {
    const img = this.cardImages[card.type];
    if (img) {
      this.ctx.drawImage(img, card.position.x, card.position.y, 60, 80);
    } else {
      // 如果没有图片，用矩形代替
      this.ctx.fillStyle = this.getCardColor(card.type);
      this.ctx.fillRect(card.position.x, card.position.y, 60, 80);
      this.ctx.strokeRect(card.position.x, card.position.y, 60, 80);
    }
  }
  
  /**
   * 渲染托盘
   */
  renderTray(tray) {
    const startX = 50;
    const startY = this.canvas.height - 100;
    
    tray.slots.forEach((slot, index) => {
      const x = startX + index * 70;
      const y = startY;
      
      // 绘制卡槽
      this.ctx.strokeStyle = '#333';
      this.ctx.strokeRect(x, y, 60, 80);
      
      // 如果有牌，绘制牌
      if (slot) {
        this.renderCard({ ...slot, position: { x, y } });
      }
    });
  }
  
  /**
   * 渲染UI
   */
  renderUI(game) {
    // 时间
    this.ctx.fillStyle = '#000';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`时间: ${game.remainingTime}s`, 10, 30);
    
    // 分数
    this.ctx.fillText(`分数: ${game.score}`, 10, 60);
    
    // 道具数量
    this.ctx.fillText(`撤回: ${game.props.undo}`, 200, 30);
    this.ctx.fillText(`洗牌: ${game.props.shuffle}`, 200, 60);
    this.ctx.fillText(`移除: ${game.props.remove}`, 200, 90);
  }
  
  getCardColor(type) {
    const colors = {
      'red_packet': '#ff6b6b',
      'firecracker': '#ffa500',
      'dumpling': '#fff',
      'lantern': '#ff0000',
      'fu': '#ffd700',
      'ingot': '#ffd700'
    };
    return colors[type] || '#ccc';
  }
}
```

### 五、支付集成（TON Connect）

```javascript
import { TonConnectUIProvider } from '@tonconnect/ui-react';

class PaymentService {
  /**
   * 初始化TON Connect
   */
  async init() {
    // 使用TON Connect SDK
    // 参考：https://docs.ton.org/develop/dapps/ton-connect/overview
  }
  
  /**
   * 充值购买道具
   */
  async purchaseProps(amount, propType) {
    // 调用TON支付
    // 成功后增加道具数量
  }
  
  /**
   * 扩展卡槽
   */
  async expandSlots() {
    // 支付7 TON/USDC
    // 成功后增加maxSlots
  }
  
  /**
   * 发送红包
   */
  async sendRedPacket(amount, recipient) {
    // 发送红包
    // 返回红包ID
  }
}
```

### 六、数据库设计

```sql
-- 用户表
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  telegram_id TEXT UNIQUE,
  wallet_address TEXT,
  max_slots INTEGER DEFAULT 7,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 游戏记录表
CREATE TABLE game_records (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  mode TEXT, -- 'free' | 'bet'
  status TEXT, -- 'win' | 'lose' | 'timeout'
  score INTEGER,
  eliminated_cards INTEGER,
  time_used INTEGER,
  rewards TEXT, -- JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 道具表
CREATE TABLE user_props (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  undo INTEGER DEFAULT 1,
  shuffle INTEGER DEFAULT 1,
  remove INTEGER DEFAULT 1,
  last_reset_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- NFT表
CREATE TABLE nfts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  type TEXT, -- 'caishen' | 'firework'
  token_id TEXT,
  game_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES game_records(id)
);

-- 排名表
CREATE TABLE rankings (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  period_start DATE,
  period_end DATE,
  total_score INTEGER,
  rank INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🎨 UI实现建议

### 使用纯DOM+CSS（推荐，简单）

```html
<div class="game-container">
  <div class="game-header">
    <div class="timer">150s</div>
    <div class="score">0</div>
    <div class="props">
      <button class="prop-btn" data-prop="undo">撤回 x1</button>
      <button class="prop-btn" data-prop="shuffle">洗牌 x1</button>
      <button class="prop-btn" data-prop="remove">移除 x1</button>
    </div>
  </div>
  
  <div class="game-board" id="gameBoard">
    <!-- 牌会动态插入这里 -->
  </div>
  
  <div class="tray" id="tray">
    <!-- 托盘卡槽 -->
  </div>
</div>
```

```css
.game-board {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.card {
  position: absolute;
  width: 60px;
  height: 80px;
  border: 2px solid #333;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  background-size: cover;
}

.card:hover {
  transform: scale(1.1);
}

.card.selected {
  animation: moveToTray 0.5s ease-out forwards;
}

.card.eliminated {
  animation: eliminate 0.5s ease-out forwards;
}

@keyframes moveToTray {
  to {
    transform: translateY(400px) scale(0.8);
  }
}

@keyframes eliminate {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(0); opacity: 0; }
}

.tray {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #f0f0f0;
  border-top: 2px solid #333;
}

.tray-slot {
  width: 60px;
  height: 80px;
  border: 2px dashed #999;
  border-radius: 8px;
}

.tray-slot.filled {
  border: 2px solid #333;
}
```

## 📱 Telegram集成

```javascript
// 使用Telegram Web App SDK
const tg = window.Telegram.WebApp;

// 初始化
tg.ready();
tg.expand();

// 获取用户信息
const user = tg.initDataUnsafe.user;
console.log('用户ID:', user.id);
console.log('用户名:', user.username);

// 发送数据到后端
tg.sendData(JSON.stringify({
  action: 'game_result',
  score: 100,
  status: 'win'
}));
```

## 🚀 性能优化

1. **使用CSS动画**而不是JavaScript动画
2. **虚拟滚动**如果牌很多
3. **图片预加载**
4. **防抖点击**避免重复操作
5. **使用requestAnimationFrame**做动画

## ✅ 开发检查清单

- [ ] 牌堆生成算法（确保有解）
- [ ] 消除检测逻辑
- [ ] 托盘管理
- [ ] 道具系统
- [ ] 倒计时系统
- [ ] 游戏状态管理
- [ ] 支付集成
- [ ] NFT系统
- [ ] 排名系统
- [ ] 红包系统
- [ ] 动画效果
- [ ] 音效（可选）
