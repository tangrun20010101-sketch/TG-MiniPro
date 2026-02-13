# 快速部署指南

## 🎯 最简单的部署方法（5分钟搞定）

### 方法一：Railway一键部署（推荐新手）

1. **注册Railway账号**
   - 访问 https://railway.app/
   - 使用GitHub账号登录

2. **部署项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的项目仓库
   - Railway会自动检测并部署

3. **配置环境变量**
   - 在项目设置中找到 "Variables"
   - 添加：`BOT_TOKEN` = 你的Bot Token

4. **获取部署地址**
   - 部署完成后，Railway会给你一个URL
   - 例如：`https://your-app.up.railway.app`

5. **设置Webhook**
   - 在浏览器访问：
   ```
   https://api.telegram.org/bot<你的BOT_TOKEN>/setWebhook?url=https://your-app.up.railway.app/webhook
   ```

6. **完成！** 🎉
   - 在Telegram中测试你的Bot

---

## 📋 详细步骤说明

### 步骤1：准备Bot Token

1. 在Telegram中搜索 @BotFather
2. 发送 `/newbot`
3. 按提示创建Bot
4. 保存Bot Token（类似：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）

### 步骤2：选择部署平台

**选项A：Railway（最简单）**
- ✅ 免费额度充足
- ✅ 自动部署
- ✅ 支持HTTPS
- ⏱️ 5分钟完成

**选项B：Render（备选）**
- ✅ 免费
- ✅ 简单易用
- ⏱️ 10分钟完成

**选项C：自己的服务器（进阶）**
- ✅ 完全控制
- ❌ 需要配置
- ⏱️ 30分钟完成

### 步骤3：部署代码

#### Railway部署步骤：

```bash
# 1. 确保代码已推送到GitHub
git add .
git commit -m "准备部署"
git push

# 2. 在Railway中：
# - 点击 "New Project"
# - 选择 "Deploy from GitHub repo"
# - 选择你的仓库
# - 等待部署完成
```

#### Render部署步骤：

1. 访问 https://render.com/
2. 注册并连接GitHub
3. 创建新的 "Web Service"
4. 选择你的仓库
5. 配置：
   - Build Command: `npm install`
   - Start Command: `node backend/server.js`
6. 添加环境变量：`BOT_TOKEN`
7. 点击 "Create Web Service"

### 步骤4：配置Telegram

1. **设置Webhook**
   ```
   https://api.telegram.org/bot<你的BOT_TOKEN>/setWebhook?url=<你的部署URL>/webhook
   ```

2. **设置Mini App**（在BotFather中）
   - 发送 `/newapp` 给 @BotFather
   - 选择你的Bot
   - 设置Web App URL为你的前端地址

### 步骤5：测试

1. 在Telegram中打开你的Bot
2. 发送 `/start`
3. 应该收到回复
4. 点击Web App按钮，应该能打开页面

---

## 🔧 常见问题解决

### Q1: Webhook设置失败？
**A:** 确保URL是HTTPS开头，Telegram要求必须使用HTTPS

### Q2: Bot没有响应？
**A:** 
- 检查环境变量BOT_TOKEN是否正确
- 查看部署平台的日志
- 确认Webhook已正确设置

### Q3: 前端页面打不开？
**A:**
- 检查前端是否已部署
- 确认URL配置正确
- 检查浏览器控制台错误

### Q4: 数据库连接失败？
**A:**
- 检查数据库文件路径
- 确保有写入权限
- 如果使用SQLite，确保文件存在

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看部署平台的日志
2. 检查环境变量配置
3. 确认所有URL都是HTTPS
4. 查看README.md中的详细部署指南

---

## ✅ 部署检查清单

部署前：
- [ ] 代码已测试通过
- [ ] 已推送到GitHub
- [ ] 已获取Bot Token

部署中：
- [ ] 已选择部署平台
- [ ] 已配置环境变量
- [ ] 已获取部署URL

部署后：
- [ ] Webhook已设置
- [ ] Bot能正常响应
- [ ] Web App能正常打开
- [ ] 所有功能测试通过

---

**祝你部署顺利！** 🚀
