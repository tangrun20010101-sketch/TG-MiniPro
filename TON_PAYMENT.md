# TON 支付集成指南

## 已完成的集成

1. **TON Connect 钱包连接**：首页已添加「连接钱包」按钮，用户可连接 Tonkeeper、Wallet.tg 等 TON 钱包
2. **manifest 配置**：`frontend/tonconnect-manifest.json` 已配置，供钱包发现应用
3. **支付模块**：`frontend/js/payment/TONConnect.js` 提供 `sendPayment` 等接口，供后续支付流程使用

## 用户使用流程

1. 打开游戏（Telegram 内或浏览器）
2. 点击首页「连接钱包」按钮
3. 选择钱包（Tonkeeper / Wallet.tg / MyTonWallet 等）并授权
4. 连接成功后即可进行后续支付操作

## 配置你的收款地址

要接收用户支付的 TON，需要配置你的 TON 钱包地址：

1. 安装 Tonkeeper 或 Wallet.tg，创建/导入钱包
2. 复制你的 TON 地址（格式如 `UQBxxxx...`）
3. 修改 `frontend/js/payment/TONConnect.js` 中的 `recipientAddress`：

```javascript
recipientAddress: 'UQB你的钱包地址xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
```

或在部署时通过环境变量传入（需在代码中增加读取逻辑）。

## 发起支付（开发参考）

```javascript
import { sendPayment, getRecipientAddress } from './payment/TONConnect.js';

// 支付 0.1 TON 到配置的收款地址
await sendPayment(getRecipientAddress(), 0.1, '充值金币');
```

金额单位是 TON（1 TON = 10^9 nanoTON，SDK 会自动转换）。充值后按经济系统规则到账金币（见 [ECONOMY_SYSTEM.md](./ECONOMY_SYSTEM.md)）。

## 注意事项

- **HTTPS**：TON Connect 要求应用通过 HTTPS 访问，本地 `http://localhost` 无法连接
- **manifest 地址**：manifest 的 `url` 需与部署域名一致，当前为 `https://tg-minipro-production.up.railway.app`
- **更换域名**：若部署域名变化，需同步修改：
  - `frontend/tonconnect-manifest.json` 中的 `url`、`iconUrl` 等
  - `frontend/index.html` 中 manifestUrl 的 fallback 地址
  - `frontend/js/payment/TONConnect.js` 中的 `manifestUrl`

## 官方文档

- [TON Connect 概述](https://docs.ton.org/ecosystem/ton-connect/overview)
- [dApp 集成指南](https://docs.ton.org/ecosystem/ton-connect/dapp)
- [Manifest 规范](https://docs.ton.org/ecosystem/ton-connect/manifest)
