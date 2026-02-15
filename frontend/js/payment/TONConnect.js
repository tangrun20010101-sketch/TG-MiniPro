/**
 * TON Connect 支付模块
 * 用于连接 TON 钱包并发起支付
 * 文档：https://docs.ton.org/ecosystem/ton-connect/dapp
 */

const TON_CONFIG = {
  manifestUrl: (typeof window !== 'undefined' ? window.location.origin : '') + '/tonconnect-manifest.json',
  // 收款地址：请替换为你的 TON 钱包地址
  recipientAddress: 'UQBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  // 1 TON = 10^9 nanoTON
  TON_TO_NANO: 1e9
};

let tonConnectUI = null;

/**
 * 初始化 TON Connect
 * @param {string} buttonRootId - 连接按钮挂载的 DOM 元素 id
 * @returns {Promise<object>} TON Connect UI 实例
 */
export async function initTONConnect(buttonRootId = 'ton-connect') {
  if (typeof window === 'undefined') return null;

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js';
  script.async = true;

  return new Promise((resolve) => {
    script.onload = () => {
      tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: TON_CONFIG.manifestUrl,
        buttonRootId
      });
      tonConnectUI.onStatusChange((wallet) => {
        if (wallet) {
          window.dispatchEvent(new CustomEvent('ton:connected', { detail: wallet }));
        } else {
          window.dispatchEvent(new CustomEvent('ton:disconnected'));
        }
      });
      resolve(tonConnectUI);
    };
    document.head.appendChild(script);
  });
}

/**
 * 获取当前连接的钱包
 */
export function getWallet() {
  return tonConnectUI?.wallet ?? null;
}

/**
 * 是否已连接钱包
 */
export function isConnected() {
  return !!tonConnectUI?.wallet;
}

/**
 * 打开连接钱包弹窗
 */
export function openConnectModal() {
  tonConnectUI?.openModal?.();
}

/**
 * 发送 TON 支付
 * @param {string} toAddress - 收款地址
 * @param {number} amountTON - 支付金额（TON）
 * @param {string} comment - 交易备注（可选）
 * @returns {Promise<object>} 交易结果
 */
export async function sendPayment(toAddress, amountTON) {
  if (!tonConnectUI?.wallet) {
    throw new Error('请先连接钱包');
  }

  const amountNano = String(Math.floor(amountTON * TON_CONFIG.TON_TO_NANO));

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: toAddress,
        amount: amountNano
      }
    ]
  };

  return tonConnectUI.sendTransaction(transaction);
}

/**
 * 设置收款地址（部署时配置）
 */
export function setRecipientAddress(address) {
  TON_CONFIG.recipientAddress = address;
}

/**
 * 获取配置的收款地址
 */
export function getRecipientAddress() {
  return TON_CONFIG.recipientAddress;
}
