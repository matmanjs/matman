import showDialog from '../project-dialog';
import { callByIframe } from '../base-call-protocol';

/**
 * 跳转至QQ钱包
 */
export function jumpToQQWallet() {
  // QQ钱包认证地址
  const qqWalletUrl = `${window.location.protocol}//now.qq.com/qq_mobile/add_card.html?_wv=5123&uin=12345678`;

  const jsbridge = `mqqapi://forward/url?url_prefix=${window.btoa(qqWalletUrl)}&version=1&src_type=web`;

  console.log('[jumpToQQWallet] jsbridge', jsbridge);

  callByIframe(jsbridge);
}

/**
 * 弹出对话框提示是否去实名认证
 */
export function showDialogToGoQQWallet() {
  showDialog({
    enterText: '去认证',
    text: '根据相关政策需求，您需要前往QQ钱包>设置>实名认证中添加银行卡，以完成实名认证',
    skin: 'dlg-go-qq-wallet',
    onEnter: () => {
      jumpToQQWallet();
    }
  });
}
