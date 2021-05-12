/**
 * 跳转QQ登录
 */
export default function login() {
  // 注意，这里只是示例而已
  window.location.href = getQQLoginUrl(window.location.href);
}

export function getQQLoginUrl(redirectUrl) {
  return `https://graph.qq.com/oauth2.0/authorize?response_type=code &client_id=123456789&redirect_uri=${encodeURIComponent(redirectUrl)}`;
}
