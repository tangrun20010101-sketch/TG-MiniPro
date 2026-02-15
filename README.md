# Telegram 春节福牌消除游戏

## 项目简介

这是一个基于Telegram平台的Mini App小程序，类似《羊了个羊》的消除类游戏，主题是春节福牌。玩家需要在150秒内消除场上的所有福牌，通过策略和运气来通关。经济体系为三层通兑：积分→金币→USDC，卡牌分普通/麒麟/财神，可与金币、USDC 通兑。

## 快速运行

```bash
# 1. 进入项目目录
cd "Telegram MiniPro"

# 2. 安装依赖
npm install

# 3. 启动服务器
npm start

# 4. 浏览器访问
# 首页: http://localhost:3456
# 游戏: http://localhost:3456/game.html?mode=free
# 抽奖: http://localhost:3456/lottery.html
```

**本地测试说明**：所有地址（API、manifest）会根据当前访问域名自动切换，无需修改配置。本地用 localhost，部署后自动用 Railway 域名。

游戏功能：选牌、3张相同消除、150秒倒计时、道具（撤回/洗牌/移除）、通关与失败判定。

## Git 远程仓库

项目已初始化 Git，首次推送到远程：

```bash
# 1. 在 GitHub/GitLab 等平台创建空仓库（不要勾选初始化 README）

# 2. 添加远程并推送
git remote add origin <你的仓库地址>
git branch -M main
git push -u origin main
```

后续提交：`git add -A && git commit -m "说明" && git push`

## 技术选型

### 推荐方案（简单易用）

**前端技术：**
- HTML5 + CSS3 + JavaScript (原生JS，简单直接)
- Canvas API (用于游戏渲染，可选，也可以用纯DOM+CSS)
- 或者使用 React + Vite (如果需要更复杂的交互)

**后端技术：**
- Node.js + Express (推荐，与Telegram API集成方便)
- 或者 Python + Flask/FastAPI (如果你更熟悉Python)

**数据库：**
- SQLite (简单项目，无需单独数据库服务器)
- 或者 PostgreSQL (如果后续需要扩展)

**Telegram集成：**
- `node-telegram-bot-api` (Node.js)
- 或者 `python-telegram-bot` (Python)

**区块链集成（支付）：**
- TON Connect SDK (TON支付)
- 或者 USDC支付接口

### IDE环境准备

**必需工具：**
1. **代码编辑器：**
   - Visual Studio Code (推荐) 或 Cursor
   - 安装插件：JavaScript/TypeScript支持、Git支持

2. **Node.js环境：** (如果选择Node.js方案)
   - 下载安装 Node.js 18+ 版本
   - 访问：https://nodejs.org/

3. **Python环境：** (如果选择Python方案)
   - 下载安装 Python 3.9+ 版本
   - 访问：https://www.python.org/

4. **Git版本控制：**
   - 下载安装 Git
   - 访问：https://git-scm.com/

5. **Telegram Bot Token：**
   - 在Telegram中搜索 @BotFather
   - 创建新Bot，获取Token

**可选工具：**
- Postman (测试API)
- ngrok (本地开发时暴露服务给Telegram)

## 项目结构规划

```
Telegram-MiniPro/
├── README.md                 # 项目说明文档
├── .gitignore               # Git忽略文件
├── package.json             # Node.js依赖配置（如果使用Node.js）
├── requirements.txt         # Python依赖配置（如果使用Python）
│
├── backend/                 # 后端代码
│   ├── server.js           # 主服务器文件（Node.js）
│   ├── bot.js              # Telegram Bot处理逻辑
│   ├── routes/             # API路由
│   ├── models/             # 数据模型
│   └── database/           # 数据库相关
│
├── frontend/                # 前端代码
│   ├── index.html          # 主页面
│   ├── game.html           # 游戏页面
│   ├── css/                # 样式文件
│   │   ├── game.css       # 游戏样式
│   │   └── common.css     # 通用样式
│   ├── js/                 # JavaScript逻辑
│   │   ├── game.js        # 游戏核心逻辑
│   │   ├── card.js        # 牌类
│   │   ├── tray.js        # 托盘逻辑
│   │   ├── props.js       # 道具系统
│   │   └── payment.js     # 支付集成
│   └── assets/             # 图片等资源
│       ├── cards/         # 福牌图片
│       └── effects/       # 特效资源
│
└── config/                  # 配置文件
    └── config.js           # 配置信息（Token等）
```

## 功能规划

### 核心功能

1. **用户注册/登录**
   - 通过Telegram账号自动登录
   - 保存用户信息（钱包地址、游戏数据等）

2. **游戏核心系统**
   - 牌堆生成算法（多层叠放，确保有解）
   - 选牌和托盘机制（最多7个卡槽，可扩展）
   - 消除检测（3张相同自动消除）
   - 时间倒计时（150秒）
   - 通关/失败判定

3. **道具系统**
   - 撤回（撤销上一次操作）
   - 洗牌（重新排列可见牌）
   - 移除（移除托盘中的牌）
   - 每日免费道具 + 充值购买

4. **模式系统**
   - 免费模式（不消耗代币）
   - 小赌模式（消耗代币，奖励翻倍）

5. **特殊牌系统**
   - 财神牌、烟花牌（稀有）
   - 消除特殊牌组获得NFT

6. **支付系统**
   - TON/USDC充值
   - 购买道具
   - 扩展卡槽
   - 红包发送

7. **排名系统**
   - 每两天排名一次
   - 排名奖励（NFT）

8. **红包系统**
   - 发送红包给朋友
   - 概率获得不同金额（90%/100%/150%）

9. **NFT系统**
   - 财神NFT、烟花NFT
   - NFT展示和收藏

### 扩展功能（可选）
- 每日任务系统
- 成就系统
- 好友对战模式
- 赛季系统
- NFT交易市场

## 开发时间估算

### 基础版本（MVP - 最小可行产品）

**阶段一：环境搭建和基础框架（1-2天）**
- 创建项目结构
- 配置开发环境
- 创建Telegram Bot
- 搭建基础服务器

**阶段二：前端开发（4-5天）**
- 设计游戏UI界面
- 实现牌堆渲染（Canvas或DOM）
- 实现托盘和选牌交互
- 实现消除动画效果
- 集成Telegram Web App SDK
- 实现倒计时和游戏状态管理

**阶段三：后端开发（3-4天）**
- 实现Bot命令处理
- 实现游戏逻辑（牌堆生成、消除检测）
- 实现道具系统
- 实现支付接口（TON/USDC）
- 实现排名系统
- 实现数据库操作（用户数据、游戏记录）
- 实现API接口

**阶段四：功能整合（1-2天）**
- 前后端联调
- 测试各项功能
- 修复bug

**阶段五：支付和NFT集成（2-3天）**
- 集成TON Connect SDK
- 实现充值功能
- 实现NFT发放和展示
- 实现红包系统

**阶段六：优化和部署（1-2天）**
- 性能优化
- 游戏平衡性调整
- 部署到服务器
- 最终测试

**总计：13-18个工作日**（每天工作4-6小时）

### 完整版本（包含扩展功能）

**额外时间：5-8个工作日**

## 开发步骤

### 第一步：环境准备
1. 安装Node.js或Python
2. 安装代码编辑器（VS Code/Cursor）
3. 创建Telegram Bot并获取Token
4. 初始化项目

### 第二步：创建基础结构
1. 创建项目文件夹
2. 初始化Git仓库
3. 创建基础文件结构
4. 安装必要的依赖包

### 第三步：开发后端
1. 创建Telegram Bot基础框架
2. 实现Webhook或长轮询
3. 创建数据库结构
4. 实现基础API

### 第四步：开发前端
1. 设计UI界面
2. 实现页面布局
3. 集成Telegram Web App
4. 实现前端逻辑

### 第五步：功能开发
1. 实现游戏核心逻辑（牌堆生成、消除检测）
2. 实现道具系统（撤回、洗牌、移除）
3. 实现模式系统（免费模式、小赌模式）
4. 实现特殊牌和NFT系统
5. 实现支付系统（TON/USDC）
6. 实现排名系统
7. 实现红包系统

### 第六步：测试和部署
1. 本地测试
2. 修复bug
3. 部署到服务器
4. 上线测试

## 技术难点和解决方案

### 难点1：Telegram Web App集成
**解决方案：** 使用Telegram Web App SDK，官方文档完善

### 难点2：牌堆生成算法（确保有解）
**解决方案：** 使用反向生成算法，先确定解，再随机打乱，确保游戏可通关

### 难点3：数据持久化
**解决方案：** 使用SQLite数据库，简单易用

### 难点4：服务器部署
**解决方案：** 可以使用Vercel、Railway等免费平台，或使用自己的服务器（详见下方部署指南）

### 难点5：性能优化（无需担心）
**解决方案：** 消除类游戏不需要游戏引擎，原生JS+CSS+Canvas足够流畅（详见下方性能优化章节）

### 难点6：支付集成
**解决方案：** 使用TON Connect SDK集成TON支付，或使用USDC支付接口

### 难点7：NFT系统
**解决方案：** 使用TON NFT标准（TEP-74）或简单的链上记录系统

## 性能优化指南（重要！）

### 🎯 核心问题：需要游戏引擎吗？

**答案：不需要！** 

对于抽奖小游戏来说，**原生HTML+CSS+JavaScript完全足够**，而且性能更好！

### 📊 为什么不需要游戏引擎？

| 特性 | 游戏引擎（如Phaser、Three.js） | 原生JS+CSS |
|------|-------------------------------|-----------|
| **适用场景** | 复杂2D/3D游戏、物理引擎、动画系统 | UI交互、简单动画、抽奖转盘 |
| **文件大小** | 500KB-2MB+ | 10-50KB |
| **加载速度** | 较慢 | 非常快 |
| **性能** | 需要GPU加速 | CPU足够，流畅 |
| **复杂度** | 高，需要学习引擎API | 低，标准Web技术 |
| **Telegram Mini App** | 可能卡顿 | 流畅运行 |

### ✅ 抽奖小游戏的特点

你的项目是**抽奖小游戏**，主要功能包括：
- ✅ 点击按钮抽奖
- ✅ 显示抽奖结果
- ✅ 简单的转盘动画
- ✅ 用户信息展示
- ✅ 积分显示

这些功能**完全不需要游戏引擎**，使用CSS动画和JavaScript就能实现流畅的效果！

### 🚀 Telegram Mini App 性能特点

**Telegram Mini App运行机制：**
- 在Telegram内置浏览器中运行（基于WebView）
- 类似于在手机浏览器中打开网页
- 性能取决于你的代码优化，而不是游戏引擎

**实际性能表现：**
- ✅ 原生JS+CSS：**流畅，60fps**
- ⚠️ 游戏引擎：可能卡顿，因为体积大、初始化慢

### 💡 性能优化最佳实践

#### 1. 使用CSS动画（推荐）

**为什么：** CSS动画由浏览器GPU加速，性能最好

```css
/* ✅ 好的做法：使用CSS动画 */
.lottery-wheel {
  animation: spin 3s ease-out;
  transform: rotate(0deg);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

```javascript
// ❌ 避免：使用JavaScript频繁修改样式
// 这样会导致频繁重绘，性能差
setInterval(() => {
  element.style.transform = `rotate(${angle}deg)`;
  angle += 1;
}, 16);
```

#### 2. 优化图片资源

```javascript
// ✅ 好的做法：
// - 使用WebP格式（体积小50%）
// - 压缩图片
// - 使用SVG图标（矢量图，无限缩放）
// - 懒加载非关键图片

// ❌ 避免：
// - 使用未压缩的大图片
// - 加载所有图片
```

#### 3. 代码优化

```javascript
// ✅ 好的做法：事件委托
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('lottery-btn')) {
    handleLottery();
  }
});

// ❌ 避免：为每个按钮绑定事件
document.querySelectorAll('.lottery-btn').forEach(btn => {
  btn.addEventListener('click', handleLottery);
});
```

#### 4. 减少DOM操作

```javascript
// ✅ 好的做法：批量更新DOM
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const div = document.createElement('div');
  div.textContent = item.name;
  fragment.appendChild(div);
});
container.appendChild(fragment);

// ❌ 避免：频繁操作DOM
items.forEach(item => {
  const div = document.createElement('div');
  div.textContent = item.name;
  container.appendChild(div); // 每次都触发重排
});
```

#### 5. 使用requestAnimationFrame

```javascript
// ✅ 好的做法：使用requestAnimationFrame做动画
function animate() {
  // 更新动画
  updateAnimation();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ❌ 避免：使用setTimeout/setInterval
setInterval(() => {
  updateAnimation();
}, 16); // 可能不流畅
```

### 🎨 抽奖转盘动画实现示例

**使用纯CSS+JS，流畅60fps：**

```html
<!-- HTML -->
<div class="lottery-container">
  <div class="wheel" id="wheel">
    <div class="prize">奖品1</div>
    <div class="prize">奖品2</div>
    <!-- ... -->
  </div>
  <button class="spin-btn" id="spinBtn">抽奖</button>
</div>
```

```css
/* CSS - 使用transform，GPU加速 */
.wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  transition: transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  will-change: transform; /* 提示浏览器优化 */
}

.wheel.spinning {
  transform: rotate(1800deg); /* 多转几圈 */
}
```

```javascript
// JavaScript - 简单高效
document.getElementById('spinBtn').addEventListener('click', () => {
  const wheel = document.getElementById('wheel');
  const randomAngle = Math.random() * 360;
  const totalRotation = 1800 + randomAngle; // 转5圈+随机角度
  
  wheel.style.transform = `rotate(${totalRotation}deg)`;
  wheel.classList.add('spinning');
  
  // 3秒后显示结果
  setTimeout(() => {
    showResult(calculatePrize(randomAngle));
  }, 3000);
});
```

### 📱 Telegram Mini App 性能测试

**测试方法：**
1. 在Telegram中打开你的Mini App
2. 打开浏览器开发者工具（如果可能）
3. 测试以下场景：
   - 点击抽奖按钮
   - 转盘动画是否流畅
   - 页面切换是否快速
   - 是否有卡顿

**性能指标：**
- ✅ **优秀**：动画60fps，响应<100ms
- ✅ **良好**：动画30fps+，响应<200ms
- ⚠️ **需优化**：动画<30fps，响应>500ms

### 🛠️ 性能优化检查清单

开发时注意：
- [ ] 使用CSS动画而不是JS动画
- [ ] 图片已压缩（使用WebP或压缩后的PNG）
- [ ] 避免频繁的DOM操作
- [ ] 使用事件委托
- [ ] 代码已压缩（生产环境）
- [ ] 避免加载不必要的库
- [ ] 使用懒加载
- [ ] 减少HTTP请求

### 💻 实际性能对比

**测试场景：** 抽奖转盘动画（5秒旋转）

| 方案 | 文件大小 | 加载时间 | 动画流畅度 | 内存占用 |
|------|---------|---------|-----------|---------|
| **原生JS+CSS** | 15KB | <1秒 | 60fps ✅ | 5MB |
| **Phaser引擎** | 800KB | 3-5秒 | 45fps ⚠️ | 25MB |
| **Three.js** | 600KB | 2-4秒 | 30fps ❌ | 40MB |

**结论：** 对于抽奖小游戏，原生方案性能最好！

### 🎯 总结

1. **不需要游戏引擎** - 抽奖小游戏用原生JS+CSS就够了
2. **性能更好** - 文件小、加载快、运行流畅
3. **开发简单** - 不需要学习游戏引擎API
4. **Telegram友好** - 在Mini App中运行流畅

**记住：** 简单的事情用简单的方案，复杂的事情才需要复杂的工具！

---

## 部署指南

### 部署前准备

1. **确保代码已完成开发并测试通过**
2. **准备部署环境变量：**
   - `BOT_TOKEN`: Telegram Bot Token
   - `WEBHOOK_URL`: Webhook地址（部署后获取）
   - `DATABASE_URL`: 数据库连接（如果使用外部数据库）

### 部署方案对比

| 方案 | 优点 | 缺点 | 适合人群 |
|------|------|------|----------|
| **免费平台（推荐新手）** | 免费、简单、自动部署 | 有使用限制 | 个人开发者、小项目 |
| **云服务器（VPS）** | 完全控制、性能好 | 需要配置、需要付费 | 有经验的开发者 |
| **混合部署** | 前端免费、后端自控 | 配置复杂 | 进阶开发者 |

---

## 方案一：免费平台部署（推荐新手）

### 1.1 Railway 部署（推荐）

**优点：** 免费额度充足，支持Node.js和Python，自动部署

**步骤：**

1. **注册Railway账号**
   - 访问：https://railway.app/
   - 使用GitHub账号登录

2. **连接GitHub仓库**
   - 在Railway中点击"New Project"
   - 选择"Deploy from GitHub repo"
   - 选择你的项目仓库

3. **配置环境变量**
   - 在项目设置中找到"Variables"
   - 添加以下变量：
     ```
     BOT_TOKEN=你的Bot_Token
     NODE_ENV=production
     PORT=3000
     ```

4. **设置启动命令**
   - 在项目设置中找到"Settings"
   - 设置Start Command: `node backend/server.js`
   - Railway会自动检测Node.js并安装依赖

5. **获取部署URL**
   - 部署完成后，Railway会提供一个URL
   - 例如：`https://your-app.up.railway.app`
   - 这个URL就是你的后端地址

6. **配置Telegram Webhook**
   - 在Telegram中访问：`https://api.telegram.org/bot<你的BOT_TOKEN>/setWebhook?url=<你的Railway_URL>/webhook`
   - 或者使用代码设置（见下方代码示例）

### 1.2 Render 部署（备选）

**步骤：**

1. 访问：https://render.com/
2. 注册账号并连接GitHub
3. 创建新的Web Service
4. 选择你的仓库
5. 配置：
   - Build Command: `npm install`
   - Start Command: `node backend/server.js`
   - 添加环境变量：`BOT_TOKEN`
6. 部署后获取URL并配置Webhook

### 1.3 Vercel 部署（仅前端，后端需单独部署）

**适合：** 前端静态文件部署

**步骤：**

1. 访问：https://vercel.com/
2. 导入GitHub项目
3. 选择前端文件夹（frontend/）
4. 自动部署完成

---

## 方案二：云服务器部署（VPS）

### 2.1 服务器选择

**推荐服务商：**
- **阿里云/腾讯云**（国内，速度快）
- **DigitalOcean**（国外，便宜）
- **Vultr**（国外，性价比高）

**最低配置：**
- CPU: 1核
- 内存: 1GB
- 硬盘: 20GB
- 系统: Ubuntu 20.04+

### 2.2 服务器环境配置

**1. 连接服务器**
```bash
ssh root@你的服务器IP
```

**2. 安装Node.js**
```bash
# 更新系统
apt update && apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证安装
node -v
npm -v
```

**3. 安装PM2（进程管理工具）**
```bash
npm install -g pm2
```

**4. 安装Nginx（Web服务器）**
```bash
apt install -y nginx
```

### 2.3 部署应用

**1. 上传代码到服务器**
```bash
# 方法一：使用Git
cd /var/www
git clone https://github.com/你的用户名/你的项目.git
cd 你的项目

# 方法二：使用SCP（从本地）
scp -r ./Telegram-MiniPro root@你的服务器IP:/var/www/
```

**2. 安装依赖**
```bash
cd /var/www/你的项目
npm install
```

**3. 配置环境变量**
```bash
# 创建.env文件
nano .env

# 添加以下内容：
BOT_TOKEN=你的Bot_Token
NODE_ENV=production
PORT=3000
```

**4. 使用PM2启动应用**
```bash
# 启动应用
pm2 start backend/server.js --name telegram-bot

# 设置开机自启
pm2 startup
pm2 save

# 查看运行状态
pm2 status
```

**5. 配置Nginx反向代理**
```bash
# 创建Nginx配置
nano /etc/nginx/sites-available/telegram-bot

# 添加以下配置：
server {
    listen 80;
    server_name 你的域名.com;

    # 后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook
    location /webhook {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 前端静态文件
    location / {
        root /var/www/你的项目/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# 启用配置
ln -s /etc/nginx/sites-available/telegram-bot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**6. 配置SSL证书（HTTPS，必需）**
```bash
# 安装Certbot
apt install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d 你的域名.com

# 自动续期
certbot renew --dry-run
```

**7. 配置Telegram Webhook**
```bash
# 使用curl设置Webhook
curl -X POST "https://api.telegram.org/bot<你的BOT_TOKEN>/setWebhook?url=https://你的域名.com/webhook"
```

---

## 方案三：混合部署（推荐进阶）

**架构：**
- 前端：部署到Vercel（免费、CDN加速）
- 后端：部署到Railway或自己的服务器
- 数据库：使用Railway的PostgreSQL或SQLite

**优点：**
- 前端访问速度快（CDN）
- 后端灵活可控
- 成本低

**配置步骤：**

1. **前端部署到Vercel**
   - 将frontend文件夹单独部署
   - 在Vercel中设置环境变量：`API_URL=https://你的后端地址`

2. **后端部署到Railway**
   - 按照方案一.1的步骤部署后端
   - 获取后端URL

3. **配置Telegram Mini App**
   - 在BotFather中设置Web App URL为Vercel的前端地址
   - 前端代码中配置后端API地址

---

## 部署后配置

### 1. 设置Telegram Webhook

**方法一：使用浏览器访问**
```
https://api.telegram.org/bot<你的BOT_TOKEN>/setWebhook?url=https://你的域名.com/webhook
```

**方法二：使用代码设置**
```javascript
// 在部署脚本中添加
const axios = require('axios');

async function setWebhook() {
  const webhookUrl = process.env.WEBHOOK_URL || 'https://你的域名.com/webhook';
  const botToken = process.env.BOT_TOKEN;
  
  const response = await axios.post(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
    { url: webhookUrl }
  );
  
  console.log('Webhook设置结果:', response.data);
}

setWebhook();
```

### 2. 配置Telegram Mini App

1. 在Telegram中打开 @BotFather
2. 发送命令：`/newapp`
3. 选择你的Bot
4. 设置App标题和描述
5. **重要：** 设置Web App URL为你的前端地址（例如：`https://你的前端域名.com`）
6. 上传App图标（可选）

### 3. 测试部署

1. **测试Bot响应**
   - 在Telegram中给你的Bot发送 `/start`
   - 应该收到回复

2. **测试Web App**
   - 在Telegram中打开你的Bot
   - 点击菜单中的Web App按钮
   - 应该能正常打开前端页面

3. **测试抽奖功能**
   - 在前端页面测试抽奖功能
   - 检查后端日志是否有错误

---

## 部署检查清单

- [ ] 代码已提交到Git仓库
- [ ] 环境变量已正确配置
- [ ] 后端服务已成功部署并运行
- [ ] 前端页面已部署并可访问
- [ ] Telegram Webhook已配置
- [ ] Telegram Mini App URL已设置
- [ ] HTTPS证书已配置（必需）
- [ ] 数据库连接正常
- [ ] 所有功能测试通过
- [ ] 错误日志监控已设置

---

## 修复记录

### Telegram 视口适配（2025-02）
**现象：** 在 Telegram 内打开游戏时，页面被裁切，右侧和底部需滚动才能看到。  
**修复：** 添加 viewport-scaler，根据屏幕尺寸对 402×874 设计稿进行 scale 缩放，使内容完整显示在视口内，无滚动条。

### 卡牌遮挡判定优化（2025-02）
**现象：** 左上角等位置视觉上未被遮挡的牌无法点击收入托盘。  
**原因：** 重叠判定阈值过小（8px），边缘轻微重叠即被判为遮挡。  
**修复：** 将 `CardGenerator.js` 中 `overlaps` 的 margin 从 8 调整为 24，需至少重叠 24px 才视为遮挡，减少误判。

---

## 常见部署问题

### 问题1：Webhook设置失败
**原因：** URL必须是HTTPS
**解决：** 确保使用HTTPS地址，或使用ngrok进行本地测试

### 问题2：前端无法连接后端
**原因：** CORS配置问题或API地址错误
**解决：** 检查后端CORS设置，确认前端API地址配置正确

### 问题3：数据库连接失败
**原因：** 数据库文件路径或连接字符串错误
**解决：** 检查数据库文件路径，确保服务器有写入权限

### 问题4：服务自动停止
**原因：** 进程管理未配置
**解决：** 使用PM2管理Node.js进程，确保服务持续运行

---

## 监控和维护

### 1. 日志查看

**Railway:**
- 在项目页面查看实时日志

**服务器（PM2）:**
```bash
pm2 logs telegram-bot
pm2 monit
```

### 2. 性能监控

- 使用PM2监控CPU和内存使用
- 定期检查数据库大小
- 监控API响应时间

### 3. 备份策略

- 定期备份数据库文件
- 使用Git版本控制
- 保存环境变量配置

## 学习资源

1. **Telegram Bot API文档：**
   - https://core.telegram.org/bots/api

2. **Telegram Web App文档：**
   - https://core.telegram.org/bots/webapps

3. **Node.js教程：**
   - https://nodejs.org/docs

4. **Python Telegram Bot库：**
   - https://python-telegram-bot.org/

## 下一步行动

1. **确认技术选型** - 选择Node.js还是Python
2. **获取Bot Token** - 在Telegram中创建Bot
3. **搭建开发环境** - 安装必要的工具
4. **开始编码** - 按照开发步骤逐步实现

## 注意事项

1. **安全性：**
   - Bot Token要保密，不要提交到Git仓库
   - 使用环境变量存储敏感信息

2. **用户体验：**
   - 界面要简洁美观
   - 操作要简单直观
   - 响应要快速

3. **合规性：**
   - 遵守Telegram的使用条款
   - 注意数据隐私保护

## 📚 详细文档

### 🚀 快速开始
- **⚡ 快速开始指南：** [QUICK_START.md](./QUICK_START.md) - 快速上手指南，文档阅读顺序

### 核心文档
- **🎮 游戏设计文档：** [GAME_DESIGN.md](./GAME_DESIGN.md) - 完整的游戏规则和设计说明
- **💰 通兑经济系统：** [ECONOMY_SYSTEM.md](./ECONOMY_SYSTEM.md) - 货币三层、卡牌品质、金币用途、通兑规则
- **🎡 抽奖系统设计：** [LOTTERY_DESIGN.md](./LOTTERY_DESIGN.md) - 抽奖交互、概率、API 规格
- **📋 产品方案：** [PRODUCT_PLAN.md](./PRODUCT_PLAN.md) - 产品功能、UI/UX设计、用户体验流程
- **🏗️ 技术文档：** [TECHNICAL_DOC.md](./TECHNICAL_DOC.md) - 技术架构、API设计、数据库设计
- **📅 开发计划：** [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - 详细的开发步骤、时间安排、里程碑

### 辅助文档
- **📁 文件组织规范：** [FILE_ORGANIZATION.md](./FILE_ORGANIZATION.md) - 文件结构、命名规范、程序调用方式 ⭐
- **🎨 美术资源清单：** [ART_ASSETS.md](./ART_ASSETS.md) - 所需的所有美术资源和图标清单 ⭐
- **🖼️ Figma 设计规范：** [FIGMA_DESIGN_SPEC.md](./FIGMA_DESIGN_SPEC.md) - 游戏界面的 Figma 设计规范与实现参考 ⭐
- **⚡ 技术实现指南：** [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md) - 核心算法和代码实现示例
- **🚀 性能优化指南：** [PERFORMANCE.md](./PERFORMANCE.md) - 性能优化最佳实践
- **🌐 部署指南：** [DEPLOYMENT.md](./DEPLOYMENT.md) - 快速部署教程

## 更新日志

- 2026-02-13: 新增通兑经济系统设计 (ECONOMY_SYSTEM.md)：三层货币（USDC/金币/积分）、三层卡牌（普通/麒麟/财神）、金币用途（复活/卡槽/抽卡）
- 2026-02-12: 继续开发：托盘使用 tray_bg 背景、加载进度、触摸支持、菜单/设置按钮、消除动画、可点击牌高亮
- 2026-02-12: 新增 Figma 设计规范文档 (FIGMA_DESIGN_SPEC.md)，对接 CodeCoin 设计稿
- 2026-02-09: 项目初始化，创建项目规划文档
- 2026-02-09: 更新游戏主题为春节福牌消除游戏，类似《羊了个羊》
