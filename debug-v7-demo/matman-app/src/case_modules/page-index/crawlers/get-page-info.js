const { useJquery } = require('web-crawl-util');

/**
 * 标题
 */
function getTitleInfo() {
  const result = {
    isExist: useJquery.isExist('#root .verify-identity .section-title.verify-identity-title'),
  };

  if (result.isExist) {
    result.title = useJquery.getText('#root .verify-identity .section-title.verify-identity-title');
  }

  return result;
}

/**
 * 表单主区域
 */
function getFormContentInfo() {
  const result = {
    isExist: useJquery.isExist('#root .verify-identity .verify-identity-form-content'),
  };

  if (result.isExist) {
    result.nameValueLabel = $('#name-value').prev('.label').text();
    result.nameValue = $('#name-value').val();
    result.nameValuePlaceholder = $('#name-value').attr('placeholder');
    result.nameValueInputType = $('#name-value').attr('type');

    result.idValueLabel = $('#id-value').prev('.label').text();
    result.idValue = $('#id-value').val();
    result.idValuePlaceholder = $('#id-value').attr('placeholder');
    result.idValueInputType = $('#id-value').attr('type');
  }

  return result;
}

/**
 * 表单按钮
 */
function getFormBtnInfo() {
  const result = {
    isExist: useJquery.isExist('#verify-btn'),
  };

  if (result.isExist) {
    result.text = useJquery.getText('#verify-btn');
    result.isBtnActive = $('#verify-btn').hasClass('active');
  }

  return result;
}

/**
 * 表单按钮
 */
function getMessageTipsInfo() {
  const result = {
    isExist: useJquery.isExist('.message-tips'),
  };

  if (result.isExist) {
    result.text = useJquery.getText('.message-tips p');
    result.isSuccess = useJquery.isExist('.message-tips .icon-success');
  }

  return result;
}

module.exports = () => {
  return {
    titleInfo: getTitleInfo(),
    formContentInfo: getFormContentInfo(),
    formBtnInfo: getFormBtnInfo(),
    messageTipsInfo: getMessageTipsInfo(),
  };
};
