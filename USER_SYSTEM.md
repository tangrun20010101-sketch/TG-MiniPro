# 用户系统说明

## 功能概览

- **设置入口**：游戏页右上角齿轮图标
- **总积分**：用户累计积分（10000 积分 = 1 金币）
- **金币**：用户金币余额（可充值购买，1 USDC = 10 金币，充 10U 送 10 金币）
- **Telegram 连接**：在 Telegram 内打开时自动连接
- **充值入口**：设置内的 TON 钱包连接，连接后可充值

## 数据库（Railway PostgreSQL）

1. 在 Railway 项目中添加 **PostgreSQL** 服务
2. 在游戏服务的 Variables 中引用 `DATABASE_URL`
3. 启动时自动执行 `db/schema.sql` 创建表（含 users、game_records、daily_stats）

**无需预先建表**：首次部署或新增表结构后，服务启动时会自动执行 schema.sql。

## 排行榜

- **入口**：设置 → 用户排行榜
- **数据**：当日战绩（daily_stats 表），按当日积分排序
- **API**：GET /api/leaderboard?date=YYYY-MM-DD&limit=20

## API

| 接口 | 说明 |
|------|------|
| GET /api/user | 获取用户信息（需 Telegram initData） |
| POST /api/user/sync | 同步游戏结果（同时更新 daily_stats） |
| POST /api/user/wallet | 绑定 TON 钱包地址 |
| GET /api/leaderboard | 获取当日排行榜 |

## 本地开发

- 未配置 `DATABASE_URL` 时，API 会返回错误，但不影响游戏运行
- 在浏览器中打开时无 Telegram initData，设置中显示「未连接」
- 在 Telegram 内打开时才有完整功能
