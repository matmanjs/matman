const _ = require('lodash');
const { useJquery } = require('web-crawl-util');
const getPageInfo = require('./get-page-info');

/**
 * 打开对话框提示去QQ钱包认证
 */
function getDlgGoQQWalletInfo() {
  const result = {
    isExist: useJquery.isExist('.dlg-go-qq-wallet'),
  };

  if (result.isExist) {
    const parentSelector = '.dlg-go-qq-wallet';
    result.text = useJquery.getText(
      '.dialog-inner .dialog-text .text',
      parentSelector,
    );
    result.btnCancelText = useJquery.getText(
      '.dialog-inner .dialog-buttons .dialog-btn.cancel',
      parentSelector,
    );
    result.btnOkText = useJquery.getText(
      '.dialog-inner .dialog-buttons .dialog-btn.ok',
      parentSelector,
    );
  }

  return result;
}

module.exports = () => {
  return _.merge({}, getPageInfo(), {
    dlgGoQQWalletInfo: getDlgGoQQWalletInfo(),
  });
};
