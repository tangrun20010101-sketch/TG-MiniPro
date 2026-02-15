/**
 * 数据库连接（PostgreSQL）
 * Railway 添加 PostgreSQL 后会自动提供 DATABASE_URL
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let pool = null;

function getPool() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('DATABASE_URL 未设置，数据库功能不可用');
    return null;
  }
  pool = new Pool({
    connectionString: url,
    ssl: url.includes('railway') ? { rejectUnauthorized: false } : false
  });
  return pool;
}

async function initDb() {
  const p = getPool();
  if (!p) return;
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await p.query(schema);
    console.log('数据库初始化完成');
  } catch (e) {
    console.error('数据库初始化失败:', e.message);
  }
}

async function getUserByTelegramId(telegramId) {
  const p = getPool();
  if (!p) return null;
  const r = await p.query(
    'SELECT * FROM users WHERE telegram_id = $1',
    [String(telegramId)]
  );
  return r.rows[0] || null;
}

async function createOrUpdateUser(data) {
  const p = getPool();
  if (!p) return null;
  const {
    telegram_id,
    username,
    first_name,
    last_name,
    wallet_address,
    total_score,
    total_credits
  } = data;
  const r = await p.query(
    `INSERT INTO users (telegram_id, username, first_name, last_name, wallet_address, total_score, total_credits, total_games, win_games)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0), COALESCE($7, 0), 0, 0)
     ON CONFLICT (telegram_id) DO UPDATE SET
       username = EXCLUDED.username,
       first_name = EXCLUDED.first_name,
       last_name = EXCLUDED.last_name,
       wallet_address = COALESCE(EXCLUDED.wallet_address, users.wallet_address),
       total_score = users.total_score + COALESCE(EXCLUDED.total_score, 0),
       total_credits = users.total_credits + COALESCE(EXCLUDED.total_credits, 0),
       total_games = users.total_games + 1,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [telegram_id, username || null, first_name || null, last_name || null, wallet_address || null, total_score || 0, total_credits || 0]
  );
  return r.rows[0];
}

async function updateUserCredits(telegramId, deltaCredits) {
  const p = getPool();
  if (!p) return null;
  const r = await p.query(
    'UPDATE users SET total_credits = total_credits + $2, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = $1 RETURNING *',
    [String(telegramId), deltaCredits]
  );
  return r.rows[0];
}

async function updateDailyStats(userId, score, win) {
  const p = getPool();
  if (!p) return;
  await p.query(
    `INSERT INTO daily_stats (user_id, stat_date, daily_score, daily_games, daily_wins)
     VALUES ($1, CURRENT_DATE, $2, 1, $3)
     ON CONFLICT (user_id, stat_date) DO UPDATE SET
       daily_score = daily_stats.daily_score + EXCLUDED.daily_score,
       daily_games = daily_stats.daily_games + 1,
       daily_wins = daily_stats.daily_wins + EXCLUDED.daily_wins`,
    [userId, score || 0, win ? 1 : 0]
  );
}

async function getLeaderboard(date, limit = 20) {
  const p = getPool();
  if (!p) return [];
  const r = await p.query(
    `SELECT u.telegram_id, u.username, u.first_name, d.daily_score, d.daily_games, d.daily_wins,
            ROW_NUMBER() OVER (ORDER BY d.daily_score DESC) as rank
     FROM daily_stats d
     JOIN users u ON u.id = d.user_id
     WHERE d.stat_date = $1::date
     ORDER BY d.daily_score DESC
     LIMIT $2`,
    [date || new Date().toISOString().slice(0, 10), limit]
  );
  return r.rows;
}

module.exports = {
  getPool,
  initDb,
  getUserByTelegramId,
  createOrUpdateUser,
  updateUserCredits,
  updateDailyStats,
  getLeaderboard
};
