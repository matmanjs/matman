'use strict';

var BasicActionWithClientScript = require('../model/BasicActionWithClientScript');

/**
 * 适合交互行为的操作
 *
 * @param pageUrl
 * @param preloadClientScriptPath
 * @param opts
 * @param callAction
 * @returns {Promise<*>}
 */
function operate(pageUrl, preloadClientScriptPath) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var callAction = arguments[3];

  var testAction = new BasicActionWithClientScript(pageUrl, preloadClientScriptPath, opts);

  // 用户的自定义行为
  if (typeof callAction === 'function') {
    callAction(testAction);
  }

  return testAction.getResult();
}

module.exports = operate;