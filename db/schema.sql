-- 用户表 (PostgreSQL)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  wallet_address TEXT,
  max_slots INTEGER DEFAULT 7,
  total_score INTEGER DEFAULT 0,
  total_credits INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  win_games INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);

-- 游戏记录表
CREATE TABLE IF NOT EXISTS game_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  mode TEXT NOT NULL,
  status TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  credits_gain INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_game_records_user ON game_records(user_id);

-- 用户当日战绩表（用于排行榜）
CREATE TABLE IF NOT EXISTS daily_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_score INTEGER DEFAULT 0,
  daily_games INTEGER DEFAULT 0,
  daily_wins INTEGER DEFAULT 0,
  UNIQUE(user_id, stat_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_score ON daily_stats(stat_date, daily_score DESC);
