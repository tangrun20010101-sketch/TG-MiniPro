# 技术文档

## 🏗️ 技术架构

### 整体架构

```
┌─────────────────────────────────────┐
│      Telegram Mini App (前端)       │
│  ┌──────────┐  ┌──────────────┐   │
│  │  游戏UI   │  │ Telegram SDK  │   │
│  └──────────┘  └──────────────┘   │
│         │              │            │
│         └──────┬───────┘            │
│                │ HTTP/WebSocket     │
└────────────────┼────────────────────┘
                 │
┌────────────────┼────────────────────┐
│      Backend API Server              │
│  ┌──────────┐  ┌──────────────┐    │
│  │ Express  │  │ Telegram Bot │    │
│  └──────────┘  └──────────────┘    │
│         │              │            │
│         └──────┬───────┘            │
│                │                    │
│  ┌─────────────┼──────────────┐    │
│  │ Game Logic  │ Payment API  │    │
│  └─────────────┴──────────────┘    │
└────────────────┼────────────────────┘
                 │
┌────────────────┼────────────────────┐
│           Database (SQLite/PostgreSQL)│
│  ┌──────────┐  ┌──────────────┐    │
│  │  Users   │  │ Game Records │    │
│  └──────────┘  └──────────────┘    │
└─────────────────────────────────────┘
                 │
┌────────────────┼────────────────────┐
│      Blockchain (TON)                │
│  ┌──────────┐  ┌──────────────┐    │
│  │ TON SDK  │  │ NFT Contract │    │
│  └──────────┘  └──────────────┘    │
└─────────────────────────────────────┘
```

---

## 📁 项目结构

```
Telegram-MiniPro/
├── README.md                    # 项目说明
├── GAME_DESIGN.md              # 游戏设计文档
├── PRODUCT_PLAN.md             # 产品方案
├── TECHNICAL_DOC.md            # 技术文档（本文件）
├── DEVELOPMENT_PLAN.md         # 开发计划
├── PERFORMANCE.md              # 性能优化指南
├── DEPLOYMENT.md               # 部署指南
│
├── .env                        # 环境变量（不提交）
├── .gitignore                  # Git忽略文件
├── package.json                # Node.js依赖
│
├── backend/                    # 后端代码
│   ├── server.js              # 主服务器文件
│   ├── bot.js                 # Telegram Bot处理
│   │
│   ├── config/                # 配置文件
│   │   ├── database.js        # 数据库配置
│   │   └── telegram.js        # Telegram配置
│   │
│   ├── game/                  # 游戏逻辑
│   │   ├── CardGenerator.js   # 牌堆生成
│   │   ├── Card.js            # 牌类
│   │   ├── Tray.js            # 托盘类
│   │   ├── Game.js            # 游戏主类
│   │   ├── GameTimer.js       # 倒计时
│   │   └── ScoreCalculator.js # 分数计算
│   │
│   ├── models/                # 数据模型
│   │   ├── User.js            # 用户模型
│   │   ├── GameRecord.js      # 游戏记录模型
│   │   ├── UserProps.js       # 道具模型
│   │   ├── NFT.js             # NFT模型
│   │   └── Ranking.js         # 排名模型
│   │
│   ├── routes/                # API路由
│   │   ├── user.js            # 用户路由
│   │   ├── game.js            # 游戏路由
│   │   ├── lottery.js         # 抽奖路由
│   │   ├── payment.js         # 支付路由
│   │   ├── nft.js             # NFT路由
│   │   └── ranking.js         # 排名路由
│   │
│   ├── services/              # 业务逻辑服务
│   │   ├── GameService.js     # 游戏服务
│   │   ├── PaymentService.js  # 支付服务
│   │   ├── TONService.js      # TON服务
│   │   ├── NFTService.js      # NFT服务
│   │   └── RankingService.js # 排名服务
│   │
│   ├── middleware/            # 中间件
│   │   ├── auth.js            # 认证中间件
│   │   ├── errorHandler.js    # 错误处理
│   │   └── validator.js       # 数据验证
│   │
│   ├── database/              # 数据库相关
│   │   ├── migrations/        # 数据库迁移
│   │   └── seeds/             # 种子数据
│   │
│   └── utils/                 # 工具函数
│       ├── logger.js          # 日志工具
│       └── helpers.js         # 辅助函数
│
├── frontend/                   # 前端代码
│   ├── index.html             # 首页
│   ├── game.html              # 游戏页面
│   │
│   ├── css/                   # 样式文件
│   │   ├── common.css         # 通用样式
│   │   ├── game.css           # 游戏样式
│   │   └── components.css     # 组件样式
│   │
│   ├── js/                    # JavaScript文件
│   │   ├── main.js            # 主入口
│   │   ├── telegram.js        # Telegram SDK集成
│   │   │
│   │   ├── game/              # 游戏相关
│   │   │   ├── GameController.js # 游戏控制器
│   │   │   └── GameState.js      # 游戏状态
│   │   │
│   │   ├── renderer/          # 渲染相关
│   │   │   ├── CardRenderer.js    # 牌渲染
│   │   │   ├── BoardRenderer.js   # 牌堆渲染
│   │   │   └── TrayRenderer.js    # 托盘渲染
│   │   │
│   │   ├── animations/        # 动画相关
│   │   │   ├── EliminationAnimation.js # 消除动画
│   │   │   └── ParticleEffect.js      # 粒子效果
│   │   │
│   │   ├── api/               # API调用
│   │   │   ├── api.js         # API封装
│   │   │   └── websocket.js   # WebSocket（可选）
│   │   │
│   │   ├── payment/           # 支付相关
│   │   │   └── TONConnect.js  # TON支付
│   │   │
│   │   └── utils/             # 工具函数
│   │       ├── performance.js # 性能优化
│   │       └── helpers.js     # 辅助函数
│   │
│   └── assets/                # 静态资源
│       ├── images/            # 图片
│       │   └── cards/         # 牌图片
│       ├── sounds/            # 音效（可选）
│       └── fonts/             # 字体
│
├── tests/                      # 测试文件
│   ├── unit/                  # 单元测试
│   ├── integration/           # 集成测试
│   └── e2e/                   # 端到端测试
│
└── docs/                       # 文档
    ├── api/                    # API文档
    └── deployment/             # 部署文档
```

---

## 🗄️ 数据库设计

### 用户表 (users)

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  wallet_address TEXT,
  max_slots INTEGER DEFAULT 7,
  total_score INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  win_games INTEGER DEFAULT 0,
  total_fukien INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
```

---

### 游戏记录表 (game_records)

```sql
CREATE TABLE game_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  mode TEXT NOT NULL, -- 'free' | 'bet'
  status TEXT NOT NULL, -- 'win' | 'lose' | 'timeout'
  score INTEGER DEFAULT 0,
  eliminated_cards INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  time_used INTEGER DEFAULT 0,
  time_limit INTEGER DEFAULT 150,
  bet_amount INTEGER DEFAULT 0, -- 小赌模式下的投注金额
  rewards TEXT, -- JSON格式：{fukien: 10, tokens: 100, nft: []}
  game_data TEXT, -- JSON格式：游戏状态快照
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_game_records_user_id ON game_records(user_id);
CREATE INDEX idx_game_records_status ON game_records(status);
CREATE INDEX idx_game_records_created_at ON game_records(created_at);
```

---

### 用户道具表 (user_props)

```sql
CREATE TABLE user_props (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  undo INTEGER DEFAULT 1,
  shuffle INTEGER DEFAULT 1,
  remove INTEGER DEFAULT 1,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_props_user_id ON user_props(user_id);
CREATE INDEX idx_user_props_reset_date ON user_props(last_reset_date);
```

---

### NFT表 (nfts)

```sql
CREATE TABLE nfts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'caishen' | 'firework'
  token_id TEXT UNIQUE,
  game_id INTEGER,
  metadata TEXT, -- JSON格式：NFT元数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES game_records(id)
);

CREATE INDEX idx_nfts_user_id ON nfts(user_id);
CREATE INDEX idx_nfts_type ON nfts(type);
CREATE INDEX idx_nfts_token_id ON nfts(token_id);
```

---

### 排名表 (rankings)

```sql
CREATE TABLE rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_score INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  rank INTEGER,
  reward TEXT, -- JSON格式：奖励信息
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_rankings_period ON rankings(period_start, period_end);
CREATE INDEX idx_rankings_user_id ON rankings(user_id);
CREATE INDEX idx_rankings_rank ON rankings(rank);
```

---

### 支付记录表 (payments)

```sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'props' | 'slots' | 'bet'
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'TON', -- 'TON' | 'USDC'
  transaction_hash TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'failed'
  metadata TEXT, -- JSON格式：支付元数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_hash ON payments(transaction_hash);
```

---

### 红包表 (red_packets)

```sql
CREATE TABLE red_packets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'TON',
  actual_amount DECIMAL(10, 2), -- 实际获得的金额
  multiplier DECIMAL(3, 2), -- 倍数：0.9, 1.0, 1.5
  status TEXT DEFAULT 'pending', -- 'pending' | 'opened' | 'expired'
  transaction_hash TEXT,
  link TEXT UNIQUE, -- 红包链接
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  opened_at TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE INDEX idx_red_packets_sender_id ON red_packets(sender_id);
CREATE INDEX idx_red_packets_receiver_id ON red_packets(receiver_id);
CREATE INDEX idx_red_packets_status ON red_packets(status);
CREATE INDEX idx_red_packets_link ON red_packets(link);
```

---

## 🔌 API设计

### 基础信息

**Base URL:** `https://your-domain.com/api`

**认证方式:** Telegram Web App InitData验证

**响应格式:** JSON

---

### 用户API

#### 注册/登录用户

```http
POST /api/user/register
Content-Type: application/json

{
  "telegram_id": "123456789",
  "username": "user123",
  "first_name": "John",
  "init_data": "query_id=..." // Telegram Web App InitData
}

Response 200:
{
  "success": true,
  "data": {
    "user_id": 1,
    "telegram_id": "123456789",
    "wallet_address": null,
    "max_slots": 7,
    "props": {
      "undo": 1,
      "shuffle": 1,
      "remove": 1
    }
  }
}
```

#### 获取用户信息

```http
GET /api/user/info
Headers:
  Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "user_id": 1,
    "telegram_id": "123456789",
    "username": "user123",
    "wallet_address": "0x...",
    "max_slots": 7,
    "total_score": 1000,
    "total_games": 50,
    "win_games": 10,
    "total_fukien": 500,
    "total_tokens": 1000,
    "props": {
      "undo": 1,
      "shuffle": 1,
      "remove": 1
    }
  }
}
```

#### 绑定钱包

```http
POST /api/user/bind-wallet
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "wallet_address": "0x..."
}

Response 200:
{
  "success": true,
  "message": "Wallet bound successfully"
}
```

---

### 游戏API

#### 创建游戏

```http
POST /api/game/create
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "mode": "free" // "free" | "bet"
}

Response 200:
{
  "success": true,
  "data": {
    "game_id": "game_123",
    "board": [...], // 牌堆数据
    "time_limit": 150,
    "mode": "free"
  }
}
```

#### 执行游戏操作（选牌）

```http
POST /api/game/action
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "game_id": "game_123",
  "action": "select_card",
  "card_id": "card_001"
}

Response 200:
{
  "success": true,
  "data": {
    "tray": [...], // 更新后的托盘
    "eliminated": false, // 是否消除
    "eliminated_cards": [], // 消除的牌
    "score": 10,
    "game_status": "playing" // "playing" | "win" | "lose"
  }
}
```

#### 使用道具

```http
POST /api/game/prop
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "game_id": "game_123",
  "prop_type": "undo" // "undo" | "shuffle" | "remove"
}

Response 200:
{
  "success": true,
  "data": {
    "board": [...], // 更新后的牌堆（如果是洗牌）
    "tray": [...], // 更新后的托盘（如果是撤回或移除）
    "props": {
      "undo": 0,
      "shuffle": 1,
      "remove": 1
    }
  }
}
```

#### 结束游戏

```http
POST /api/game/end
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "game_id": "game_123",
  "status": "win" // "win" | "lose" | "timeout"
}

Response 200:
{
  "success": true,
  "data": {
    "game_record_id": 1,
    "score": 100,
    "rewards": {
      "fukien": 20,
      "tokens": 100,
      "nft": []
    }
  }
}
```

#### 获取游戏历史

```http
GET /api/game/history?page=1&limit=10
Headers:
  Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "records": [...],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

### 抽奖 API

#### 抽奖

```http
POST /api/lottery/draw
Content-Type: application/json

{
  "initData": "..."  // Telegram initData，用户身份
}

Response 200:
{
  "ok": true,
  "angle": 324,       // 0, 36, 72, 108, 144, 180, 216, 252, 324, 360 之一
  "cardType": "caishen"  // "normal" | "qilin" | "caishen"
}

Response 400:
{
  "ok": false,
  "message": "金币不足"
}
```

**概率**：麒麟 36° 1%，财神 324° 0.01%，普通 8 档均分 98.99%。详见 [LOTTERY_DESIGN.md](./LOTTERY_DESIGN.md)。

---

### 道具API

#### 获取道具数量

```http
GET /api/props
Headers:
  Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "undo": 1,
    "shuffle": 1,
    "remove": 1,
    "next_reset": "2026-02-10T00:00:00Z"
  }
}
```

#### 购买道具

```http
POST /api/props/purchase
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "prop_type": "undo", // "undo" | "shuffle" | "remove"
  "amount": 2, // USDC/TON
  "transaction_hash": "0x..."
}

Response 200:
{
  "success": true,
  "data": {
    "props": {
      "undo": 2,
      "shuffle": 1,
      "remove": 1
    }
  }
}
```

---

### 支付API

#### 创建支付订单

```http
POST /api/payment/create
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "props", // "props" | "slots" | "bet"
  "amount": 2,
  "currency": "TON"
}

Response 200:
{
  "success": true,
  "data": {
    "order_id": "order_123",
    "amount": 2,
    "currency": "TON",
    "wallet_address": "0x...", // 收款地址
    "memo": "Order order_123"
  }
}
```

#### 支付回调

```http
POST /api/payment/callback
Content-Type: application/json

{
  "transaction_hash": "0x...",
  "order_id": "order_123",
  "amount": 2,
  "currency": "TON"
}

Response 200:
{
  "success": true
}
```

---

### NFT API

#### 获取NFT列表

```http
GET /api/nft/list?user_id=1
Headers:
  Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "nfts": [
      {
        "id": 1,
        "type": "caishen",
        "token_id": "nft_001",
        "metadata": {...},
        "created_at": "2026-02-09T10:00:00Z"
      }
    ],
    "total": 1
  }
}
```

#### 领取NFT

```http
POST /api/nft/claim
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "game_id": "game_123",
  "nft_type": "caishen"
}

Response 200:
{
  "success": true,
  "data": {
    "nft": {
      "id": 1,
      "type": "caishen",
      "token_id": "nft_001"
    }
  }
}
```

---

### 排名API

#### 获取排名

```http
GET /api/ranking?period_start=2026-02-09&period_end=2026-02-11
Headers:
  Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "period": {
      "start": "2026-02-09",
      "end": "2026-02-11"
    },
    "rankings": [
      {
        "rank": 1,
        "user_id": 1,
        "username": "user1",
        "total_score": 10000,
        "win_count": 50
      }
    ],
    "my_ranking": {
      "rank": 10,
      "total_score": 5000,
      "win_count": 25
    }
  }
}
```

---

### 红包API

#### 发送红包

```http
POST /api/redpacket/send
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "receiver_id": 2,
  "amount": 100,
  "currency": "TON"
}

Response 200:
{
  "success": true,
  "data": {
    "red_packet_id": 1,
    "link": "https://t.me/your_bot?start=redpacket_123"
  }
}
```

#### 打开红包

```http
POST /api/redpacket/open
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "link": "redpacket_123"
}

Response 200:
{
  "success": true,
  "data": {
    "amount": 100,
    "actual_amount": 90,
    "multiplier": 0.9
  }
}
```

---

## 🔐 安全设计

### 认证机制

1. **Telegram Web App认证**
   - 使用Telegram Web App InitData
   - 验证InitData签名
   - 提取用户信息

2. **JWT Token**
   - 登录后生成JWT Token
   - Token有效期：7天
   - 刷新Token机制

---

### 数据验证

1. **输入验证**
   - 使用Joi或类似库验证输入
   - 防止SQL注入
   - 防止XSS攻击

2. **支付验证**
   - 验证交易哈希
   - 验证交易金额
   - 验证交易状态

---

### 错误处理

```javascript
// 统一错误响应格式
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

---

## 🚀 性能优化

### 前端优化

1. **资源优化**
   - 图片压缩（WebP格式）
   - 代码压缩和混淆
   - CDN加速

2. **渲染优化**
   - 使用CSS动画
   - 虚拟滚动（如果牌很多）
   - 防抖和节流

3. **网络优化**
   - API请求合并
   - 数据缓存
   - 懒加载

---

### 后端优化

1. **数据库优化**
   - 索引优化
   - 查询优化
   - 连接池

2. **缓存策略**
   - Redis缓存（可选）
   - 内存缓存
   - CDN缓存

3. **API优化**
   - 响应压缩
   - 分页查询
   - 批量操作

---

## 📊 监控和日志

### 日志系统

1. **日志级别**
   - ERROR: 错误日志
   - WARN: 警告日志
   - INFO: 信息日志
   - DEBUG: 调试日志

2. **日志内容**
   - 用户操作
   - API请求
   - 错误信息
   - 性能指标

---

### 监控指标

1. **系统指标**
   - CPU使用率
   - 内存使用率
   - 磁盘使用率

2. **应用指标**
   - API响应时间
   - 错误率
   - 并发用户数

3. **业务指标**
   - 游戏次数
   - 通关率
   - 支付成功率

---

## 🔧 开发工具

### 代码质量

- ESLint（代码检查）
- Prettier（代码格式化）
- Jest（单元测试）

### 开发工具

- Nodemon（自动重启）
- ngrok（本地测试）
- Postman（API测试）

---

## 📝 API文档生成

使用Swagger/OpenAPI生成API文档：

```javascript
// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Telegram Mini App API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
```

---

## ✅ 技术验收标准

### 代码质量

- [ ] 代码通过ESLint检查
- [ ] 代码覆盖率 > 80%
- [ ] 所有API有文档
- [ ] 所有函数有注释

### 性能标准

- [ ] API响应时间 < 500ms
- [ ] 页面加载时间 < 2s
- [ ] 动画流畅度 60fps
- [ ] 数据库查询 < 100ms

### 安全标准

- [ ] 通过安全扫描
- [ ] 输入验证完善
- [ ] 支付验证准确
- [ ] 数据加密存储
