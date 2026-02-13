# 美术资源清单与替换指南

> 更新素材时，直接替换对应路径下的文件即可（保持文件名不变）。  
> 修改 `assets.js` 仅在有**新增/删除**牌型或路径变更时。

---

## 📁 资源目录结构（实际路径）

```
frontend/assets/images/
│
├── cards/                          # 一、福牌（直接卡牌图，无底图）
│   └── icons/                      # 每张为完整卡牌图 60×80
│       ├── bianpao.png
│       ├── caishen.png
│       ├── hua.png
│       ├── jiaozi.png
│       ├── lantern.png
│       ├── shizi.png
│       ├── tiehua.png
│       ├── xingxing.png
│       ├── yuanbao.png
│       └── yun.png
│
├── icons/
│   ├── header/                     # 游戏页顶部按钮
│   │   ├── back.png                # 左上角返回
│   │   └── setting.png             # 右上角设置
│   ├── stats/                      # 标题区域积分/代币图标
│   │   ├── jifen.png               # 积分图标
│   │   └── daibi.png               # 代币图标
│   ├── dialog/                     # 清盘弹窗按钮
│   │   ├── retry.png               # 重来
│   │   └── home.png                # 首页
│   └── props/                      # 游戏内道具图标
│       ├── undo.png                # 撤回
│       ├── shuffle.png             # 洗牌
│       ├── remove.png              # 移出
│       ├── freemode.png            # 免费模式（首页等）
│       └── betmode.png             # 小赌模式（首页等）
│
├── ui/                             # 三、UI 背景与按钮
│   ├── tray_bg.png                # 托盘背景（含竹叶装饰）
│   ├── dialog_bg.png               # 清盘弹窗背景（渐变+装饰）
│   └── buttons/                   # 按钮图片（可选，当前用 CSS）
│       ├── btn_free.png           # 首页「免费」按钮 120×120
│       └── btn_bet.png           # 首页「小赌」按钮 140×120
│
├── backgrounds/                    # 四、背景
│   └── game_bg.png                # 游戏/首页共用背景
│
└── app/                            # 五、应用品牌
    └── Logo.png                    # Code Coin Logo（首页）
```

---

## 📋 资源快速对照表

| 用途 | 文件路径 | 建议尺寸 | 替换说明 |
|------|----------|----------|----------|
| **卡牌** | `cards/icons/*.png` | 任意尺寸，保持比例不拉伸 | 牌堆/托盘 90×90 居中显示 |
| **撤回图标** | `icons/props/undo.png` | 24×24 | 底部绿色按钮内 |
| **洗牌图标** | `icons/props/shuffle.png` | 24×24 | 底部绿色按钮内 |
| **移出图标** | `icons/props/remove.png` | 24×24 | 底部绿色按钮内 |
| **返回图标** | `icons/header/back.png` | 24×24 | 游戏页左上角返回 |
| **设置图标** | `icons/header/setting.png` | 24×24 | 游戏页右上角设置 |
| **积分图标** | `icons/stats/jifen.png` | 32×32 | 标题区域积分 |
| **代币图标** | `icons/stats/daibi.png` | 32×32 | 标题区域代币 |
| **免费模式** | `icons/props/freemode.png` | 48×48 | 首页「免费」按钮（当前用 CSS 文字） |
| **小赌模式** | `icons/props/betmode.png` | 48×48 | 首页「小赌」按钮（当前用 CSS 文字） |
| **托盘背景** | `ui/tray_bg.png` | 1080×200 | 底部托盘 |
| **清盘弹窗背景** | `ui/dialog_bg.png` | 建议 400×500 | 游戏结束弹窗 |
| **重来图标** | `icons/dialog/retry.png` | 40×40 | 清盘弹窗重来按钮 |
| **首页图标** | `icons/dialog/home.png` | 40×40 | 清盘弹窗首页按钮 |
| **全屏背景** | `backgrounds/game_bg.png` | 1080×1920 | 首页 + 游戏页 |
| **品牌 Logo** | `app/Logo.png` | 64×64 | 首页 Code Coin 图标 |

---

## 🎴 一、福牌素材

### 直接卡牌

每张卡牌为**完整图片**，无需底图或发光叠加。任意尺寸会按比例缩放居中显示，**不拉伸变形**。

### 卡牌图片（10 种）

| 文件名 | 用途 | 在 assets.js 中的 key |
|--------|------|----------------------|
| `bianpao.png` | 鞭炮 | `bianpao` |
| `caishen.png` | 财神 | `caishen` |
| `hua.png` | 花 | `hua` |
| `jiaozi.png` | 饺子 | `jiaozi` |
| `lantern.png` | 灯笼 | `lantern` |
| `shizi.png` | 狮子 | `shizi` |
| `tiehua.png` | 贴花 | `tiehua` |
| `xingxing.png` | 星星 | `xingxing` |
| `yuanbao.png` | 元宝 | `yuanbao` |
| `yun.png` | 云 | `yun` |

**新增牌型**：在 `frontend/js/config/assets.js` 的 `cards.icons` 里添加对应 key 和路径。牌图可任意尺寸，会保持比例居中显示。

---

## 🎨 二、按钮与图标

### 按钮素材存放位置

| 文件 | 用途 | 尺寸 |
|------|------|------|
| `ui/buttons/btn_free.png` | 首页「免费」按钮 | 120×120 |
| `ui/buttons/btn_bet.png` | 首页「小赌」按钮 | 140×120 |

当前首页按钮为 **CSS 描边 + 文字**，若改用图片，将上述文件放入对应路径后，在 `index.html` 和 `game.css` 中改为图片引用即可。

### 当前实现方式

| 界面 | 元素 | 实现方式 | 可替换素材 |
|------|------|----------|------------|
| 首页 | 免费按钮 | CSS 红底金边 + 文字「免费」 | `ui/buttons/btn_free.png` |
| 首页 | 小赌按钮 | CSS 红底金边 + 文字「小赌」 | `ui/buttons/btn_bet.png` |
| 首页 | Code Coin Logo | `app/Logo.png` | 直接替换 |
| 游戏页 | 移出/洗牌/撤回 | `icons/props/*.png` | 直接替换 |

### 道具图标（游戏页底部）

| 文件 | 用途 |
|------|------|
| `undo.png` | 撤回按钮 |
| `shuffle.png` | 洗牌按钮 |
| `remove.png` | 移出按钮 |

### 顶部按钮图标（游戏页）

| 文件 | 路径 | 用途 |
|------|------|------|
| `back.png` | `icons/header/back.png` | 左上角返回 |
| `setting.png` | `icons/header/setting.png` | 右上角设置 |

### 模式图标（可选）

| 文件 | 用途 |
|------|------|
| `freemode.png` | 免费模式入口（若用图标模式） |
| `betmode.png` | 小赌模式入口（若用图标模式） |

---

## 🖼️ 三、背景与 UI

| 文件 | 用途 |
|------|------|
| `backgrounds/game_bg.png` | 首页、游戏页全屏背景 |
| `ui/tray_bg.png` | 游戏页底部托盘 |

---

## 🖼️ 四、应用品牌

| 文件 | 用途 |
|------|------|
| `app/Logo.png` | 首页 Code Coin 图标 |

---

## 📐 尺寸规格

| 类型 | 尺寸 |
|------|------|
| 牌堆卡片 | 110×110 |
| 托盘卡片 | 90×90 |
| 道具图标 / 顶部按钮 | 24×24 |
| 模式图标 | 48×48 |
| 背景 | 1080×1920 |
| 托盘 | 1080×200 |
| Logo | 64×64（建议） |

---

## 🔄 替换素材步骤

1. **直接替换**：用新图覆盖原文件，**保持文件名不变**。
2. **新增牌型**：把新图片放到 `cards/icons/`，并在 `assets.js` 的 `cards.icons` 里添加对应项。
3. **修改按钮**：若用图片代替 CSS 按钮，需在 `index.html` 和 `game.css` 中改为 `<img>` 或 `background-image`。

---

## 📂 文件引用位置（代码）

| 资源 | 引用位置 |
|------|----------|
| 卡牌 | `assets.js`、`BoardRenderer.js`、`AssetLoader.js` |
| 道具图标 | `game.html`、`assets.js` |
| 背景 | `index.html`、`game.html`、`GameController.js`、`game.css` |
| Logo | `index.html` |

---

## 🎨 设计风格

- **主色**：红色 (#FF4444)
- **辅色**：金色 (#FFD700)
- **主题**：春节、福牌、财神等吉祥元素
- **格式**：PNG，支持透明
