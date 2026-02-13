# 文件组织和命名规范

## 📁 项目目录结构

```
Telegram-MiniPro/
├── README.md                          # 项目说明
├── package.json                       # Node.js依赖配置
├── .env                               # 环境变量（不提交）
├── .env.example                       # 环境变量示例
├── .gitignore                         # Git忽略文件
│
├── backend/                           # 后端代码
│   ├── server.js                      # 主服务器入口
│   ├── bot.js                         # Telegram Bot处理
│   │
│   ├── config/                        # 配置文件
│   │   ├── index.js                   # 配置入口
│   │   ├── database.js                # 数据库配置
│   │   ├── telegram.js                # Telegram配置
│   │   └── payment.js                 # 支付配置
│   │
│   ├── game/                          # 游戏逻辑
│   │   ├── CardGenerator.js           # 牌堆生成器
│   │   ├── Card.js                    # 牌类
│   │   ├── Tray.js                    # 托盘类
│   │   ├── Game.js                    # 游戏主类
│   │   ├── GameTimer.js               # 倒计时器
│   │   └── ScoreCalculator.js         # 分数计算器
│   │
│   ├── models/                        # 数据模型
│   │   ├── User.js                    # 用户模型
│   │   ├── GameRecord.js              # 游戏记录模型
│   │   ├── UserProps.js               # 道具模型
│   │   ├── NFT.js                     # NFT模型
│   │   ├── Ranking.js                 # 排名模型
│   │   └── Payment.js                 # 支付模型
│   │
│   ├── routes/                        # API路由
│   │   ├── index.js                   # 路由入口
│   │   ├── user.js                    # 用户路由
│   │   ├── game.js                    # 游戏路由
│   │   ├── payment.js                 # 支付路由
│   │   ├── nft.js                     # NFT路由
│   │   ├── ranking.js                 # 排名路由
│   │   └── redpacket.js               # 红包路由
│   │
│   ├── services/                      # 业务逻辑服务
│   │   ├── GameService.js             # 游戏服务
│   │   ├── PaymentService.js          # 支付服务
│   │   ├── TONService.js              # TON服务
│   │   ├── NFTService.js              # NFT服务
│   │   └── RankingService.js         # 排名服务
│   │
│   ├── middleware/                    # 中间件
│   │   ├── auth.js                    # 认证中间件
│   │   ├── errorHandler.js            # 错误处理
│   │   └── validator.js               # 数据验证
│   │
│   ├── database/                      # 数据库相关
│   │   ├── migrations/                # 数据库迁移
│   │   │   ├── 001_create_users.js
│   │   │   ├── 002_create_game_records.js
│   │   │   └── ...
│   │   └── seeds/                     # 种子数据
│   │       └── initial_data.js
│   │
│   ├── utils/                         # 工具函数
│   │   ├── logger.js                  # 日志工具
│   │   ├── helpers.js                 # 辅助函数
│   │   └── constants.js               # 常量定义
│   │
│   └── tests/                         # 后端测试
│       ├── unit/                      # 单元测试
│       ├── integration/               # 集成测试
│       └── fixtures/                  # 测试数据
│
├── frontend/                          # 前端代码
│   ├── index.html                     # 首页
│   ├── game.html                      # 游戏页面
│   ├── result.html                    # 结算页面
│   │
│   ├── css/                           # 样式文件
│   │   ├── common.css                 # 通用样式
│   │   ├── game.css                   # 游戏样式
│   │   ├── components.css            # 组件样式
│   │   └── animations.css             # 动画样式
│   │
│   ├── js/                            # JavaScript文件
│   │   ├── main.js                    # 主入口
│   │   ├── config.js                  # 前端配置
│   │   │
│   │   ├── game/                      # 游戏相关
│   │   │   ├── GameController.js      # 游戏控制器
│   │   │   ├── GameState.js           # 游戏状态
│   │   │   └── CardManager.js         # 牌管理器
│   │   │
│   │   ├── renderer/                  # 渲染相关
│   │   │   ├── CardRenderer.js        # 牌渲染器
│   │   │   ├── BoardRenderer.js       # 牌堆渲染器
│   │   │   └── TrayRenderer.js        # 托盘渲染器
│   │   │
│   │   ├── animations/                 # 动画相关
│   │   │   ├── EliminationAnimation.js # 消除动画
│   │   │   └── ParticleEffect.js      # 粒子效果
│   │   │
│   │   ├── api/                       # API调用
│   │   │   ├── api.js                 # API封装
│   │   │   └── websocket.js           # WebSocket（可选）
│   │   │
│   │   ├── payment/                   # 支付相关
│   │   │   └── TONConnect.js          # TON支付
│   │   │
│   │   ├── utils/                     # 工具函数
│   │   │   ├── performance.js         # 性能优化
│   │   │   ├── helpers.js             # 辅助函数
│   │   │   └── constants.js          # 常量定义
│   │   │
│   │   └── telegram/                  # Telegram集成
│   │       └── telegram.js            # Telegram SDK
│   │
│   └── assets/                        # 静态资源（最简方案）
│       ├── images/                    # 图片资源
│       │   ├── cards/                 # 福牌（组合方案：底图+道具图标）
│       │   │   ├── card_bg_default.png
│       │   │   ├── card_bg_glow.png
│       │   │   └── icons/             # 8种道具图标
│       │   ├── icons/                 # UI图标（5个：undo/shuffle/remove、free_mode/bet_mode）
│       │   │   ├── props/
│       │   │   └── modes/
│       │   ├── backgrounds/           # 背景（1张 game_bg.png）
│       │   ├── ui/                    # UI组件（托盘 tray_bg.png）
│       │   └── app/                   # 应用图标 icon_128.png
│       │
│       ├── sounds/                    # 音效（可选）
│       │   ├── click.mp3
│       │   ├── eliminate.mp3
│       │   └── win.mp3
│       │
│       └── fonts/                     # 字体（可选）
│           └── custom-font.woff2
│
├── docs/                              # 文档
│   ├── api/                           # API文档
│   └── deployment/                    # 部署文档
│
└── scripts/                           # 脚本文件
    ├── deploy.sh                      # 部署脚本
    ├── migrate.js                     # 数据库迁移脚本
    └── seed.js                        # 种子数据脚本
```

---

## 📝 文件命名规范

### 1. 代码文件命名

#### JavaScript文件
- **使用驼峰命名法（camelCase）**
- 文件名应该描述文件的功能
- 类文件使用大驼峰（PascalCase）

**示例：**
```
✅ 正确：
- GameController.js
- cardRenderer.js
- userService.js
- CardGenerator.js

❌ 错误：
- game-controller.js
- card_renderer.js
- UserService.js (服务文件用小驼峰)
```

#### CSS文件
- **使用小写字母和连字符（kebab-case）**

**示例：**
```
✅ 正确：
- common.css
- game-board.css
- card-styles.css

❌ 错误：
- Common.css
- gameBoard.css
```

#### HTML文件
- **使用小写字母和连字符（kebab-case）**

**示例：**
```
✅ 正确：
- index.html
- game-board.html
- user-profile.html

❌ 错误：
- Index.html
- gameBoard.html
```

---

### 2. 资源文件命名

#### 图片文件命名规范

**格式：** `{类型}_{名称}_{状态}_{尺寸}.{扩展名}`

**命名规则：**
1. 使用小写字母
2. 使用下划线分隔
3. 按类型-名称-状态-尺寸的顺序

**示例：**

**福牌（组合方案）：**
```
cards/card_bg_default.png     # 统一底图 60×80
cards/card_bg_glow.png        # 发光底图
cards/icons/red_packet.png    # 道具图标 40×50
cards/icons/firecracker.png
```

**图标（最简：单状态）：**
```
icons/props/undo.png
icons/props/shuffle.png
icons/modes/free_mode.png
```

**按钮：** 无图片，用 CSS + 文字

**背景：**
```
backgrounds/game_bg.png
```

---

### 3. 资源文件组织

#### 福牌图片组织（组合方案）

福牌 = **统一卡牌底图** + **道具图标** 叠加渲染。

```
assets/images/cards/
├── card_bg_default.png   # 60×80px，统一卡牌底图（主图）
├── card_bg_glow.png      # 60×80px，统一卡牌底图（发光）
└── icons/                # 道具图标，居中贴到卡牌上
    ├── red_packet.png    # 40×50px
    ├── firecracker.png
    ├── dumpling.png
    ├── lantern.png
    ├── fu.png
    ├── ingot.png
    ├── caishen.png
    └── firework.png
```

#### UI图标组织（最简方案：5个图标）

保留 props（3个）+ modes（2个）；时间/分数/福签/代币、分享/设置/关闭 均用 CSS 或文字。

```
assets/images/icons/
├── props/                # 道具图标（3张）
│   ├── undo.png
│   ├── shuffle.png
│   └── remove.png
└── modes/                # 模式图标（2张）
    ├── free_mode.png
    └── bet_mode.png
```

---

## 🔧 程序调用方式

### 1. 前端资源路径配置

#### 创建资源路径配置文件

**`frontend/js/config/assets.js`**（组合方案）
```javascript
const ASSETS_CONFIG = {
  cards: {
    background: {
      default: '/assets/images/cards/card_bg_default.png',
      glow: '/assets/images/cards/card_bg_glow.png'
    },
    icons: {
      red_packet: '/assets/images/cards/icons/red_packet.png',
      firecracker: '/assets/images/cards/icons/firecracker.png',
      // ... 共8种
    }
  },
  icons: { props: {...}, modes: {...} },
  backgrounds: {...},
  ui: { trayBg: '...' }
};

// 获取牌组成部分
getCardParts(cardType, state) {
  return {
    background: this.cards.background[state],
    icon: this.cards.icons[cardType]
  };
}
```

#### 使用资源路径

**`frontend/js/utils/AssetLoader.js`**（组合方案）
```javascript
// 加载牌：分别加载底图+道具图标
async loadCardParts(cardType, state) {
  const { background, icon } = ASSETS_CONFIG.getCardParts(cardType, state);
  const [bgImg, iconImg] = await Promise.all([
    this.loadImage(background),
    this.loadImage(icon)
  ]);
  return { background: bgImg, icon: iconImg };
}
```

#### 在代码中使用

**`frontend/js/renderer/CardRenderer.js`**（组合方案：底图+图标分层绘制）
```javascript
import getAssetLoader from '../utils/AssetLoader.js';

class CardRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.assetLoader = getAssetLoader();
  }
  
  /**
   * 渲染牌（组合方案：底图+道具图标分层绘制）
   */
  async renderCard(card, state = 'default') {
    const { background, icon } = await this.assetLoader.loadCardParts(card.type, state);
    const ctx = this.canvas.getContext('2d');
    const { x, y } = card.position;
    ctx.drawImage(background, x, y, 60, 80);
    ctx.drawImage(icon, x + 10, y + 15, 40, 50);  // 道具居中
  }
  
  async renderGlow(card) {
    await this.renderCard(card, 'glow');
  }
}
```

---

### 2. 后端资源路径配置

#### 静态资源服务配置

**`backend/server.js`**
```javascript
const express = require('express');
const path = require('path');

const app = express();

// 静态资源目录
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// 前端页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/game.html'));
});
```

---

### 3. 资源路径常量定义

#### 前端常量文件

**`frontend/js/utils/constants.js`**
```javascript
// 资源路径常量
export const ASSET_PATHS = {
  // 牌类型
  CARD_TYPES: {
    RED_PACKET: 'red_packet',
    FIRECRACKER: 'firecracker',
    DUMPLING: 'dumpling',
    LANTERN: 'lantern',
    FU: 'fu',
    INGOT: 'ingot',
    CAISHEN: 'caishen',
    FIREWORK: 'firework'
  },
  
  // 牌状态（组合方案只需 default + glow）
  CARD_STATES: {
    DEFAULT: 'default',
    GLOW: 'glow'
  },
  
  // 基础路径
  BASE_PATH: '/assets/images',
  
  // 组合方案：使用 ASSETS_CONFIG.getCardParts(cardType, state)
  
  // 获取图标路径
  getIconPath(category, name) {
    return `${this.BASE_PATH}/icons/${category}/${name}.png`;
  }
};

// 使用示例（组合方案）
// const { background, icon } = ASSETS_CONFIG.getCardParts('red_packet', 'default');
```

---

### 4. 环境变量配置

#### 开发/生产环境路径

**`frontend/js/config/env.js`**
```javascript
const isDevelopment = process.env.NODE_ENV === 'development';

export const CONFIG = {
  // API基础URL
  API_BASE_URL: isDevelopment 
    ? 'http://localhost:3000/api' 
    : 'https://your-domain.com/api',
  
  // 资源基础URL
  ASSETS_BASE_URL: isDevelopment
    ? '/assets'
    : 'https://cdn.your-domain.com/assets',
  
  // CDN配置（生产环境）
  CDN_CONFIG: {
    enabled: !isDevelopment,
    baseUrl: 'https://cdn.your-domain.com'
  }
};
```

---

## 📋 文件命名检查清单

### 代码文件
- [ ] 使用驼峰命名（camelCase）
- [ ] 文件名清晰描述功能
- [ ] 类文件使用大驼峰（PascalCase）

### 资源文件
- [ ] 使用小写字母
- [ ] 使用下划线分隔
- [ ] 包含类型、名称、状态信息
- [ ] 尺寸信息（可选）

### 目录结构
- [ ] 按功能模块组织
- [ ] 资源文件分类清晰
- [ ] 便于查找和维护

---

## 🔍 文件查找辅助

### 创建文件查找工具

**`scripts/find-asset.js`**
```javascript
const fs = require('fs');
const path = require('path');

/**
 * 查找资源文件
 * @param {string} assetName - 资源名称
 * @param {string} type - 资源类型 (card|icon|button|background)
 */
function findAsset(assetName, type = 'card') {
  const basePath = path.join(__dirname, '../frontend/assets/images');
  let searchPath;
  
  switch(type) {
    case 'card':
      searchPath = path.join(basePath, 'cards', assetName);
      break;
    case 'icon':
      searchPath = path.join(basePath, 'icons', assetName);
      break;
    case 'button':
      searchPath = path.join(basePath, 'buttons', assetName);
      break;
    case 'background':
      searchPath = path.join(basePath, 'backgrounds', assetName);
      break;
  }
  
  if (fs.existsSync(searchPath)) {
    const files = fs.readdirSync(searchPath);
    console.log(`Found ${files.length} files in ${searchPath}:`);
    files.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log(`Asset not found: ${searchPath}`);
  }
}

// 使用示例
// node scripts/find-asset.js red_packet card
```

---

## ✅ 最佳实践

1. **统一命名规范**
   - 代码文件：camelCase
   - 资源文件：snake_case
   - 目录：kebab-case

2. **路径管理**
   - 使用配置文件管理路径
   - 避免硬编码路径
   - 支持环境变量配置

3. **资源预加载**
   - 游戏开始前预加载关键资源
   - 使用AssetLoader统一管理
   - 缓存已加载的资源

4. **错误处理**
   - 资源不存在时使用默认图片
   - 记录资源加载错误
   - 提供友好的错误提示

---

## 📝 示例：完整的资源调用流程

```javascript
// 1. 导入配置和工具
import ASSETS_CONFIG from './config/assets.js';
import getAssetLoader from './utils/AssetLoader.js';

// 2. 创建资源加载器
const assetLoader = getAssetLoader();

// 3. 预加载资源
await assetLoader.preloadCards();

// 4. 在渲染时使用
const card = {
  type: 'red_packet',
  position: { x: 100, y: 200 }
};

// 渲染默认状态
await cardRenderer.renderCard(card, 'default');

// 渲染发光效果（消除时）
await cardRenderer.renderCard(card, 'glow');
```

---

**按照这个规范组织文件，可以确保：**
1. ✅ 文件结构清晰
2. ✅ 命名规范统一
3. ✅ 便于程序调用
4. ✅ 易于维护和扩展

---

## 📦 示例文件

项目中已包含以下示例文件，可以直接参考使用：

### 1. 资源路径配置示例
**文件：** `frontend/js/config/assets.example.js`

**用途：** 包含所有资源的路径配置

**使用方法：**
```bash
# 复制示例文件
cp frontend/js/config/assets.example.js frontend/js/config/assets.js

# 根据实际情况修改路径
```

### 2. 资源加载器示例
**文件：** `frontend/js/utils/AssetLoader.example.js`

**用途：** 资源加载工具类，统一管理资源加载

**使用方法：**
```bash
# 复制示例文件
cp frontend/js/utils/AssetLoader.example.js frontend/js/utils/AssetLoader.js

# 在代码中导入使用
import getAssetLoader from './utils/AssetLoader.js';
const assetLoader = getAssetLoader();
```

### 3. 资源使用示例
**文件：** `frontend/js/examples/asset-usage.example.js`

**用途：** 展示如何在代码中使用资源加载器

**包含示例：**
- 预加载资源
- Canvas渲染牌
- DOM中使用图片
- CSS背景图片
- 创建图标按钮
- 游戏初始化
- 加载统计

---

## 🚀 快速开始

### 步骤1: 复制示例文件

```bash
# 复制资源配置文件
cp frontend/js/config/assets.example.js frontend/js/config/assets.js

# 复制资源加载器
cp frontend/js/utils/AssetLoader.example.js frontend/js/utils/AssetLoader.js
```

### 步骤2: 修改资源路径

编辑 `frontend/js/config/assets.js`，根据实际资源位置修改路径。

### 步骤3: 在代码中使用

```javascript
// 导入资源加载器
import getAssetLoader from './utils/AssetLoader.js';
import ASSETS_CONFIG from './config/assets.js';

// 获取实例
const assetLoader = getAssetLoader();

// 预加载资源
await assetLoader.preloadCards();

// 获取牌组成部分
const { background, icon } = await assetLoader.loadCardParts('red_packet', 'default');
// background 和 icon 为已加载的 Image 对象，可分层绘制
```

---

## 📚 更多参考

- **完整示例：** 查看 `frontend/js/examples/asset-usage.example.js`
- **资源清单：** 查看 `ART_ASSETS.md`
- **技术文档：** 查看 `TECHNICAL_DOC.md`
