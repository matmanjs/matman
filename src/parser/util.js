const fs = require('fs');
const _ = require('lodash');
const path = require('path');

/**
 * 获取 handlerData 信息
 *
 * @param {String} handlerName
 * @param {Object} handlerConfigDBState config.json中的数据
 * @param {Object} cacheData 缓存数据
 * @return {Object}
 */
function getMixinHandlerData(handlerName, handlerConfigDBState, cacheData) {
  // 至少得有 route 字段，否则报错
  // 我们是需要 route 字段来匹配的，因此是必须的
  if (!handlerConfigDBState.route) {
    console.error(handlerName + ' should define property of "route"! ');
    return null;
  }

  let data = _.merge({
    name: handlerName,
    description: handlerName,
    disable: false,
    method: 'get',
    priority: 0,
  }, cacheData, handlerConfigDBState);

  // 当前激活的是那个 module
  data.activeModule = data.activeModule || data.defaultModule;

  // 标签，用于过滤，字符串数组
  data.tags = _.union(['全部'], data.tags || []);

  return data;
}

module.exports = {
  getMixinHandlerData: getMixinHandlerData
};
