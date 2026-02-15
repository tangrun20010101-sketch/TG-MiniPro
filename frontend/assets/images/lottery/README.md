# 抽奖页素材（Figma 67-184）

## 目录结构

```
lottery/
├── wheel.png        # 转盘（固定，10 等分）560×560
├── draw_btn.png     # 中心「幸运」按钮（圆形金色）
├── qilin.png        # 麒麟图标（底部统计用）
├── wheel.svg        # 转盘占位（备用）
├── draw_btn.svg     # 按钮占位（备用）
└── README.md        # 本文件
```

## 页面结构（Figma）

- **顶部**：左返回、中金币、右设置
- **中央**：转盘 + 中心「幸运」按钮
- **底部**：麒麟数量、金币、财神数量

## 素材清单

| 文件 | 尺寸 | 用途 |
|------|------|------|
| wheel.png | 560×560 | 抽奖转盘主体 |
| draw_btn.png | 圆形 | 中心「幸运」按钮 |
| qilin.png | 56×56 | 底部麒麟统计图标（缺则用 caishen 占位） |

## 引用

- `lottery.html` 直接引用 `/assets/images/lottery/*.png`
- `assets.js` 配置 `lottery.wheel`、`lottery.pointer`、`lottery.drawBtn`

## 设计风格

- 主色：红色 #FF4444
- 辅色：金色 #FFD700
- 主题：春节、福牌、财神
