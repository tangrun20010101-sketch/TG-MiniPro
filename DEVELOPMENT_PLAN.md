# 开发计划

## 📅 项目时间线

**总开发时间：13-18个工作日**（每天工作4-6小时）

### 第一阶段：项目准备（1天）

#### 任务清单
- [ ] 环境搭建
  - [ ] 安装Node.js 18+
  - [ ] 安装Git
  - [ ] 配置开发环境
  - [ ] 创建Telegram Bot（@BotFather）
  - [ ] 获取Bot Token

- [ ] 项目初始化
  - [ ] 创建项目目录结构
  - [ ] 初始化Git仓库
  - [ ] 创建package.json
  - [ ] 安装基础依赖
  - [ ] 配置.gitignore

- [ ] 开发环境配置
  - [ ] 配置环境变量文件（.env）
  - [ ] 设置本地开发服务器
  - [ ] 配置ngrok（用于本地测试Telegram Webhook）

**交付物：**
- 项目基础结构
- 开发环境可运行
- Bot可以响应基础命令

---

### 第二阶段：核心游戏逻辑（4-5天）

#### Day 1-2: 牌堆生成算法

**目标：** 实现确保有解的牌堆生成算法

**任务：**
- [ ] 设计牌数据结构
- [ ] 实现反向生成算法
  - [ ] 生成牌组（每组3张相同）
  - [ ] 随机打乱算法
  - [ ] 分层放置逻辑
- [ ] 实现可见性检测（上层遮挡下层）
- [ ] 单元测试牌堆生成

**代码文件：**
- `backend/game/CardGenerator.js`
- `backend/game/Card.js`
- `tests/game/CardGenerator.test.js`

**验收标准：**
- 生成的牌堆确保有解
- 牌堆随机分布合理
- 可见性检测准确

---

#### Day 3: 托盘和消除系统

**目标：** 实现托盘管理和消除检测

**任务：**
- [ ] 实现托盘类（Tray）
  - [ ] 添加牌到托盘
  - [ ] 托盘容量管理（7个卡槽，可扩展）
  - [ ] 卡槽状态管理
- [ ] 实现消除检测算法
  - [ ] 检测3张相同牌
  - [ ] 自动消除逻辑
  - [ ] 消除后更新托盘
- [ ] 实现失败检测（托盘满且无法消除）
- [ ] 单元测试消除逻辑

**代码文件：**
- `backend/game/Tray.js`
- `backend/game/EliminationChecker.js`
- `tests/game/Tray.test.js`

**验收标准：**
- 托盘正确添加和移除牌
- 3张相同牌自动消除
- 失败检测准确

---

#### Day 4-5: 游戏主逻辑

**目标：** 整合所有游戏逻辑，实现完整游戏流程

**任务：**
- [ ] 实现游戏类（Game）
  - [ ] 游戏状态管理（waiting/playing/win/lose/timeout）
  - [ ] 游戏初始化
  - [ ] 选牌逻辑
  - [ ] 通关检测
  - [ ] 失败检测
- [ ] 实现倒计时系统
  - [ ] 150秒倒计时
  - [ ] 时间到自动结算
- [ ] 实现分数系统
  - [ ] 消除得分
  - [ ] 通关奖励
  - [ ] 时间奖励
- [ ] 实现游戏历史记录（用于撤回功能）
- [ ] 集成测试完整游戏流程

**代码文件：**
- `backend/game/Game.js`
- `backend/game/GameTimer.js`
- `backend/game/ScoreCalculator.js`
- `tests/game/Game.test.js`

**验收标准：**
- 游戏可以完整运行一局
- 通关和失败逻辑正确
- 倒计时准确
- 分数计算正确

---

### 第三阶段：前端UI开发（4-5天）

#### Day 1-2: 基础UI框架

**目标：** 搭建游戏界面基础框架

**任务：**
- [ ] 设计UI布局
  - [ ] 游戏区域（牌堆显示）
  - [ ] 托盘区域
  - [ ] 顶部UI（时间、分数、道具）
- [ ] 实现基础HTML结构
- [ ] 实现CSS样式
  - [ ] 响应式布局
  - [ ] 卡片样式
  - [ ] 动画效果（CSS）
- [ ] 集成Telegram Web App SDK
  - [ ] 初始化SDK
  - [ ] 获取用户信息
  - [ ] 主题适配

**代码文件：**
- `frontend/index.html`
- `frontend/game.html`
- `frontend/css/game.css`
- `frontend/css/common.css`
- `frontend/js/telegram.js`

**验收标准：**
- UI布局正确
- 响应式设计适配手机
- Telegram SDK集成成功

---

#### Day 3: 牌堆渲染和交互

**目标：** 实现牌堆的显示和点击交互

**任务：**
- [ ] 实现牌堆渲染
  - [ ] 使用DOM或Canvas渲染牌
  - [ ] 显示牌的层级关系
  - [ ] 显示可见/不可见状态
- [ ] 实现点击交互
  - [ ] 点击选牌
  - [ ] 牌移动到托盘的动画
  - [ ] 点击反馈效果
- [ ] 实现牌的视觉反馈
  - [ ] 悬停效果
  - [ ] 选中效果
  - [ ] 不可点击提示

**代码文件：**
- `frontend/js/renderer/CardRenderer.js`
- `frontend/js/renderer/BoardRenderer.js`
- `frontend/js/interaction/CardInteraction.js`

**验收标准：**
- 牌堆正确显示
- 点击交互流畅
- 动画效果自然

---

#### Day 4: 托盘和消除动画

**目标：** 实现托盘的显示和消除动画

**任务：**
- [ ] 实现托盘渲染
  - [ ] 显示7个卡槽
  - [ ] 显示卡槽中的牌
  - [ ] 空卡槽提示
- [ ] 实现消除动画
  - [ ] 3张相同牌闪烁
  - [ ] 消除粒子效果
  - [ ] 消除音效（可选）
- [ ] 实现失败提示
  - [ ] 托盘满时的视觉提示
  - [ ] 无法消除的警告

**代码文件：**
- `frontend/js/renderer/TrayRenderer.js`
- `frontend/js/animations/EliminationAnimation.js`
- `frontend/js/animations/ParticleEffect.js`

**验收标准：**
- 托盘正确显示
- 消除动画流畅
- 失败提示清晰

---

#### Day 5: UI完善和优化

**目标：** 完善UI细节，优化用户体验

**任务：**
- [ ] 实现游戏状态UI
  - [ ] 开始界面
  - [ ] 游戏进行界面
  - [ ] 通关界面
  - [ ] 失败界面
  - [ ] 结算界面
- [ ] 实现倒计时显示
- [ ] 实现分数显示
- [ ] 实现道具按钮UI
- [ ] 性能优化
  - [ ] 图片预加载
  - [ ] 动画优化
  - [ ] 防抖点击

**代码文件：**
- `frontend/js/ui/GameUI.js`
- `frontend/js/ui/GameStateUI.js`
- `frontend/js/utils/PerformanceOptimizer.js`

**验收标准：**
- 所有UI状态正确显示
- 交互流畅无卡顿
- 性能良好（60fps）

---

### 第四阶段：后端API开发（3-4天）

#### Day 1: 用户系统

**目标：** 实现用户注册、登录、信息管理

**任务：**
- [ ] 设计用户数据模型
- [ ] 实现用户注册（Telegram自动登录）
- [ ] 实现用户信息获取
- [ ] 实现用户信息更新
- [ ] 实现用户钱包绑定（TON钱包）

**代码文件：**
- `backend/models/User.js`
- `backend/routes/user.js`
- `backend/middleware/auth.js`
- `backend/database/migrations/001_create_users.js`

**API端点：**
- `POST /api/user/register` - 用户注册
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/info` - 更新用户信息
- `POST /api/user/bind-wallet` - 绑定钱包

**验收标准：**
- 用户可以通过Telegram登录
- 用户信息正确保存和获取
- 钱包绑定功能正常

---

#### Day 2: 游戏API

**目标：** 实现游戏相关的API接口

**任务：**
- [ ] 实现游戏创建API
- [ ] 实现游戏状态保存
- [ ] 实现游戏操作API（选牌、使用道具）
- [ ] 实现游戏结算API
- [ ] 实现游戏历史查询

**代码文件：**
- `backend/models/GameRecord.js`
- `backend/routes/game.js`
- `backend/services/GameService.js`

**API端点：**
- `POST /api/game/create` - 创建新游戏
- `POST /api/game/action` - 执行游戏操作（选牌）
- `POST /api/game/prop` - 使用道具
- `POST /api/game/end` - 结束游戏
- `GET /api/game/history` - 获取游戏历史

**验收标准：**
- 游戏可以创建和保存
- 游戏操作API正常
- 游戏状态正确保存

---

#### Day 3: 道具和支付系统

**目标：** 实现道具系统和支付接口

**任务：**
- [ ] 实现道具数据模型
- [ ] 实现每日道具重置
- [ ] 实现道具购买API
- [ ] 集成TON Connect SDK
- [ ] 实现支付回调处理
- [ ] 实现卡槽扩展功能

**代码文件：**
- `backend/models/UserProps.js`
- `backend/routes/payment.js`
- `backend/services/PaymentService.js`
- `backend/services/TONService.js`

**API端点：**
- `GET /api/props` - 获取道具数量
- `POST /api/props/purchase` - 购买道具
- `POST /api/payment/ton` - TON支付
- `POST /api/payment/callback` - 支付回调
- `POST /api/slots/expand` - 扩展卡槽

**验收标准：**
- 道具系统正常
- 支付流程完整
- 卡槽扩展功能正常

---

#### Day 4: 排名和NFT系统

**目标：** 实现排名系统和NFT发放

**任务：**
- [ ] 实现排名计算逻辑
- [ ] 实现排名查询API
- [ ] 实现NFT数据模型
- [ ] 实现NFT发放逻辑
- [ ] 实现NFT查询API
- [ ] 实现红包系统API

**代码文件：**
- `backend/models/Ranking.js`
- `backend/models/NFT.js`
- `backend/routes/ranking.js`
- `backend/routes/nft.js`
- `backend/routes/redpacket.js`
- `backend/services/RankingService.js`
- `backend/services/NFTService.js`

**API端点：**
- `GET /api/ranking` - 获取排名
- `GET /api/nft/list` - 获取NFT列表
- `POST /api/nft/claim` - 领取NFT
- `POST /api/redpacket/send` - 发送红包
- `POST /api/redpacket/open` - 打开红包

**验收标准：**
- 排名系统正常
- NFT发放和查询正常
- 红包系统正常

---

### 第五阶段：前后端联调（2天）

#### Day 1: API集成

**任务：**
- [ ] 前端调用后端API
- [ ] 处理API错误
- [ ] 实现加载状态
- [ ] 实现错误提示
- [ ] 测试所有API接口

**验收标准：**
- 前后端通信正常
- 错误处理完善
- 用户体验良好

---

#### Day 2: 功能测试

**任务：**
- [ ] 完整游戏流程测试
- [ ] 道具功能测试
- [ ] 支付流程测试
- [ ] 排名系统测试
- [ ] NFT系统测试
- [ ] 修复发现的bug

**验收标准：**
- 所有功能正常
- 无明显bug
- 性能良好

---

### 第六阶段：支付和区块链集成（2-3天）

#### Day 1-2: TON支付集成

**任务：**
- [ ] 集成TON Connect SDK
- [ ] 实现钱包连接
- [ ] 实现支付流程
- [ ] 实现支付验证
- [ ] 测试支付功能

**代码文件：**
- `frontend/js/payment/TONConnect.js`
- `backend/services/TONPaymentService.js`

**验收标准：**
- 可以连接TON钱包
- 支付流程完整
- 支付验证准确

---

#### Day 3: NFT系统

**任务：**
- [ ] 设计NFT元数据
- [ ] 实现NFT发放逻辑
- [ ] 实现NFT展示
- [ ] 测试NFT功能

**验收标准：**
- NFT可以正确发放
- NFT可以正确展示
- NFT数据准确

---

### 第七阶段：测试和优化（2天）

#### Day 1: 功能测试

**任务：**
- [ ] 编写测试用例
- [ ] 执行功能测试
- [ ] 执行压力测试
- [ ] 修复bug
- [ ] 性能优化

**验收标准：**
- 所有功能正常
- 无明显bug
- 性能达标

---

#### Day 2: 用户体验优化

**任务：**
- [ ] UI/UX优化
- [ ] 动画优化
- [ ] 加载优化
- [ ] 错误提示优化
- [ ] 最终测试

**验收标准：**
- 用户体验良好
- 交互流畅
- 无明显问题

---

### 第八阶段：部署上线（1-2天）

#### Day 1: 部署准备

**任务：**
- [ ] 准备生产环境配置
- [ ] 配置数据库
- [ ] 配置环境变量
- [ ] 代码优化和压缩
- [ ] 准备部署文档

---

#### Day 2: 部署和测试

**任务：**
- [ ] 部署到服务器
- [ ] 配置域名和SSL
- [ ] 配置Telegram Webhook
- [ ] 生产环境测试
- [ ] 监控设置

**验收标准：**
- 生产环境正常运行
- 所有功能正常
- 性能良好

---

## 📊 开发里程碑

### 里程碑1：核心游戏逻辑完成（第5天）
- ✅ 牌堆生成算法
- ✅ 消除检测系统
- ✅ 游戏主逻辑

### 里程碑2：前端UI完成（第10天）
- ✅ 游戏界面
- ✅ 交互功能
- ✅ 动画效果

### 里程碑3：后端API完成（第14天）
- ✅ 用户系统
- ✅ 游戏API
- ✅ 支付系统

### 里程碑4：功能完整（第17天）
- ✅ 前后端联调完成
- ✅ 支付集成完成
- ✅ NFT系统完成

### 里程碑5：上线（第18天）
- ✅ 测试完成
- ✅ 部署完成
- ✅ 正式上线

---

## 🎯 每周目标

### 第1周（Day 1-5）
- 完成项目准备
- 完成核心游戏逻辑
- 完成基础UI框架

### 第2周（Day 6-10）
- 完成前端UI开发
- 完成后端API开发
- 完成前后端联调

### 第3周（Day 11-15）
- 完成支付集成
- 完成NFT系统
- 完成测试和优化

### 第4周（Day 16-18）
- 完成部署上线
- 完成文档整理
- 项目交付

---

## 📝 开发注意事项

1. **代码规范**
   - 使用ES6+语法
   - 添加注释
   - 遵循命名规范

2. **版本控制**
   - 每天提交代码
   - 使用有意义的commit message
   - 重要功能使用分支开发

3. **测试**
   - 每个功能都要测试
   - 重要功能编写单元测试
   - 定期进行集成测试

4. **文档**
   - 及时更新文档
   - API文档要完整
   - 代码注释要清晰

5. **性能**
   - 注意性能优化
   - 避免不必要的渲染
   - 使用合适的算法

---

## 🔄 迭代计划

### 迭代1：MVP版本（核心功能）
- 基础游戏逻辑
- 简单UI
- 基本API

### 迭代2：完整功能版本
- 道具系统
- 支付系统
- 排名系统

### 迭代3：优化版本
- 性能优化
- UI优化
- 用户体验优化

---

## 📞 问题处理

遇到问题时：
1. 先查看文档
2. 搜索类似问题
3. 记录问题和解决方案
4. 更新文档

---

## ✅ 每日检查清单

每天开发前：
- [ ] 查看昨日进度
- [ ] 确认今日目标
- [ ] 检查代码是否有错误

每天开发后：
- [ ] 提交代码
- [ ] 更新进度
- [ ] 记录问题和解决方案
- [ ] 更新文档
