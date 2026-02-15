/**
 * 游戏服务器
 * 静态资源 + API（用户、数据库）
 * Railway 部署时需配置 DATABASE_URL（添加 PostgreSQL 服务后自动提供）
 */

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3456;
const ROOT = path.join(__dirname, 'frontend');

app.use(express.json());

// 动态 manifest（必须在 static 之前）：根据请求 host 生成，本地/部署通用
app.get('/tonconnect-manifest.json', (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  const base = `${proto}://${host}`;
  res.set('Access-Control-Allow-Origin', '*');
  res.json({
    url: base,
    name: '春节福牌消除',
    iconUrl: `${base}/assets/images/app/Logo.png`,
    termsOfUseUrl: `${base}/`,
    privacyPolicyUrl: `${base}/`
  });
});

app.use(express.static(ROOT));

app.use('/api', require('./routes/api'));

app.get('*', (req, res) => {
  const url = req.url.split('?')[0];
  const file = url === '/' ? '/index.html' : url;
  res.sendFile(path.join(ROOT, file), (err) => {
    if (err) res.status(404).send('Not Found');
  });
});

async function start() {
  try {
    await db.initDb();
  } catch (e) {
    console.warn('数据库初始化跳过:', e.message);
  }
  app.listen(PORT, () => {
    console.log('\n  🌟 福牌消除游戏已启动');
    console.log(`  📱 本地访问: http://localhost:${PORT}`);
    console.log(`  🗄️  数据库: ${process.env.DATABASE_URL ? '已连接' : '未配置'}`);
    console.log('\n');
  });
}

start().catch((e) => {
  console.error('启动失败:', e);
  process.exit(1);
});
