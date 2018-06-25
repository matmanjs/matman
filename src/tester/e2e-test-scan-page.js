const { WebEventRecorder } = require('nightmare-handler');
const E2eTestAction = require('./E2eTestAction');

/**
 * 适合简单的页面扫描场景，无交互行为。
 *
 * @param pageUrl
 * @param preloadClientScriptPath
 * @param opts
 * @param {Object} params 额外的参数
 * @param {Boolean} [params.useRecorder] 是否需要记录器
 * @returns {Promise<*>}
 */
function scanPage(pageUrl, preloadClientScriptPath, opts = {}, params = {}) {
  let actionHandle = new E2eTestAction(pageUrl, preloadClientScriptPath, opts);

  // 使用记录器
  if (params.useRecorder) {
    actionHandle.onNightmareCreated = function (self) {
      // 记录器
      self.globalInfo.recorder = new WebEventRecorder(self.nightmare);
    };
  }

  actionHandle.addAction(function (nightmareRun) {
    return nightmareRun.wait(opts.wait || 500);
  });

  return actionHandle.getResult()
    .then(function (result) {
      // 去掉这个nightmare的返回。目前他没有什么其他的用处，但是在 JSON.stringify 时会报错
      if (result.globalInfo && result.globalInfo.recorder && result.globalInfo.recorder.nightmare) {
        delete result.globalInfo.recorder.nightmare;
      }

      // 由于此处返回的是一个元素的数组，不便于后续处理，因此需要转义为对象返回
      result.data = result.data[0];

      return result;
    });
}

module.exports = scanPage;