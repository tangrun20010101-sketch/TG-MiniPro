# 本地测试指南

## 启动

```bash
npm install
npm start
```

浏览器打开：http://localhost:3456

## 地址自动切换

- **API**：使用相对路径，自动请求当前域名
- **manifest**：服务端根据请求 host 动态生成，本地即 `http://localhost:3456`
- **资源**：全部相对路径，无需配置

## 注意事项

- **TON 钱包**：本地 http 环境下 TON Connect 可能无法连接（需 HTTPS），但不影响游戏核心功能
- **数据库**：未配置 `DATABASE_URL` 时，用户 API 不可用，游戏仍可正常玩
- **Telegram**：在浏览器中打开时无 Telegram 身份，设置中显示「未连接」
