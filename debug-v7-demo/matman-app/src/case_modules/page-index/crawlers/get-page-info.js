const { useJquery } = require('web-crawl-util');

function getFormContentInfo() {
  const result = {
    isExist: useJquery.isExist(
      '#root .verify-identity .verify-identity-form-content',
    ),
  };

  if (result.isExist) {
    result.nameValueLabel = $('#name-value').prev('.label').text();
    result.nameValue = $('#name-value').val();
    result.nameValuePlaceholder = $('#name-value').attr('placeholder');
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

module.exports = () => {
  return {
    formContentInfo: getFormContentInfo(),
    formBtnInfo: getFormBtnInfo()
  };
};
