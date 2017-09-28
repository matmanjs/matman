"use strict";

exports.__esModule = true;
exports.initGetList = initGetList;
exports.initGetOne = initGetOne;
exports.initPostOne = initPostOne;
exports.initGetOneReadMe = initGetOneReadMe;
/**
 * 获得所有的 handler 列表
 * @param router
 * @param pluginName
 * @param callback
 */
function initGetList(router, pluginName, callback) {
  router.get("/sys-cgi/" + pluginName, callback);
}

/**
 * 获得指定的 handler 信息
 * @param router
 * @param pluginName
 * @param handlerNameField
 * @param callback
 */
function initGetOne(router, pluginName, handlerNameField, callback) {
  router.get("/sys-cgi/" + pluginName + "/:" + handlerNameField, callback);
}

/**
 * 更新指定的 handler 信息
 * @param router
 * @param pluginName
 * @param handlerNameField
 * @param callback
 */
function initPostOne(router, pluginName, handlerNameField, callback) {
  router.post("/sys-cgi/" + pluginName + "/:" + handlerNameField, callback);
}

/**
 * 获得指定的 handler 的 readme 信息
 * @param router
 * @param pluginName
 * @param handlerNameField
 * @param callback
 */
function initGetOneReadMe(router, pluginName, handlerNameField, callback) {
  router.get("/sys-cgi/" + pluginName + "/:" + handlerNameField + "/readme", callback);
}
//# sourceMappingURL=base-router.js.map