/**
 * API 路由
 * 用户数据、游戏记录等
 */

const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 * 从 Telegram initData 解析用户（简化版，生产环境需验证签名）
 */
function parseTelegramUser(initData) {
  if (!initData) return null;
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return {
      telegram_id: String(user.id),
      username: user.username || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null
    };
  } catch {
    return null;
  }
}

// 获取或创建用户
router.get('/user', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.query.initData;
  const tgUser = parseTelegramUser(initData);
  if (!tgUser) {
    return res.json({ ok: false, message: '需要 Telegram 身份' });
  }
  try {
    let user = await db.getUserByTelegramId(tgUser.telegram_id);
    if (!user) {
      user = await db.createOrUpdateUser({ ...tgUser, total_score: 0, total_credits: 0 });
    }
    res.json({
      ok: true,
      user: {
        telegram_id: user.telegram_id,
        total_score: user.total_score,
        total_credits: user.total_credits,
        wallet_address: user.wallet_address
      }
    });
  } catch (e) {
    console.error('GET /api/user', e);
    res.status(500).json({ ok: false, message: '服务器错误' });
  }
});

// 同步游戏结果
router.post('/user/sync', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  const tgUser = parseTelegramUser(initData);
  if (!tgUser) {
    return res.json({ ok: false, message: '需要 Telegram 身份' });
  }
  const { score = 0, credits_gain = 0, win = false } = req.body || {};
  try {
    const user = await db.createOrUpdateUser({
      ...tgUser,
      total_score: score,
      total_credits: credits_gain
    });
    if (user?.id) {
      await db.updateDailyStats(user.id, score, win);
    }
    if (win) {
      await db.getPool()?.query(
        'UPDATE users SET win_games = win_games + 1 WHERE telegram_id = $1',
        [tgUser.telegram_id]
      );
    }
    res.json({
      ok: true,
      user: {
        total_score: user.total_score,
        total_credits: user.total_credits
      }
    });
  } catch (e) {
    console.error('POST /api/user/sync', e);
    res.status(500).json({ ok: false, message: '服务器错误' });
  }
});

// 绑定钱包
router.post('/user/wallet', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  const tgUser = parseTelegramUser(initData);
  if (!tgUser) {
    return res.json({ ok: false, message: '需要 Telegram 身份' });
  }
  const { wallet_address } = req.body || {};
  if (!wallet_address) {
    return res.json({ ok: false, message: '缺少钱包地址' });
  }
  try {
    await db.getPool()?.query(
      'UPDATE users SET wallet_address = $2, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $1',
      [tgUser.telegram_id, wallet_address]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /api/user/wallet', e);
    res.status(500).json({ ok: false, message: '服务器错误' });
  }
});

// 排行榜（当日战绩）
router.get('/leaderboard', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
  try {
    const list = await db.getLeaderboard(date, limit);
    res.json({ ok: true, list, date });
  } catch (e) {
    console.error('GET /api/leaderboard', e);
    res.status(500).json({ ok: false, message: '服务器错误' });
  }
});

module.exports = router;
