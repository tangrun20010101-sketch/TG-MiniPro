/**
 * 环境配置：根据当前访问地址自动切换
 * 本地 http://localhost:3456 → 使用本地
 * 部署 https://xxx.railway.app → 使用部署地址
 */
export const APP_BASE = typeof window !== 'undefined' ? window.location.origin : '';
export const IS_LOCAL = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.host);
