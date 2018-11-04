'use strict';

var operate = require('./operate');

/**
 * 适合简单的页面扫描场景，无交互行为。
 *
 * @param pageUrl
 * @param preloadClientScriptPath
 * @param opts
 * @returns {Promise<*>}
 */
function scan(pageUrl, preloadClientScriptPath) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return operate(pageUrl, preloadClientScriptPath, opts, function (testAction) {

    // scan 行为是一种特殊的操作，因为它只有一个行为，且结果也不再是数组
    testAction.addAction(function (nightmareRun) {
      return nightmareRun.wait(opts.wait || 500);
    });
  }).then(function (result) {
    // 去掉这个nightmare的返回。目前他没有什么其他的用处，但是在 JSON.stringify 时会报错
    if (result.globalInfo && result.globalInfo.recorder && result.globalInfo.recorder.nightmare) {
      delete result.globalInfo.recorder.nightmare;
    }

    // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
    result.data = result.data[0];

    return result;
  });
}

module.exports = scan;
//# sourceMappingURL=scan.js.map