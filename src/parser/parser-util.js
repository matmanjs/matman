const fs = require('fs');
const _ = require('lodash');
const path = require('path');

/**
 * 获取 handlerData 信息
 *
 * @param {String} handlerName 该 handler 名字
 * @param {Object} handlerConfigData config.json中的数据
 * @param {Object} cacheData 缓存数据
 * @return {Object}
 */
function getMixinHandlerData(handlerName, handlerConfigData, cacheData) {
  // 至少得有 route 字段，否则报错
  // 我们是需要 route 字段来匹配的，因此是必须的
  if (!handlerConfigData.route) {
    console.error(handlerName + ' should define property of "route"! ');
    return null;
  }

  // 始终以 config.json 中定义的为最高优先级（除了defaultModule字段），如果没定义，则使用 cache 值，最后才是默认值
  let data = _.merge({
    name: handlerName,
    description: handlerName,
    disable: false,
    method: 'get',
    priority: 0,
  }, cacheData, handlerConfigData);

  // 当前激活的是哪个 module，优先使用 cache 中
  data.activeModule = data.activeModule || data.defaultModule;

  // 标签，用于过滤，字符串数组，合并
  data.tags = _.union(['全部'], data.tags || []);

  return data;
}

/**
 * 获取 handle_module 信息
 *
 * @param {String} handleModuleName 该 handle_module 名字
 * @param {Object} handleModuleConfigDBState config.json中的数据
 * @return {Object}
 */
function getMixinHandleModuleData(handleModuleName, handleModuleConfigDBState) {

  // 始终以 config.json 中定义的为最高优先级（除了defaultModule字段），如果没定义，则使用 cache 值，最后才是默认值
  let data = _.merge({
    name: handleModuleName,
    description: handleModuleName,
    priority: 0,
  }, handleModuleConfigDBState);

  // TODO 如果是 /id/:id 类型的，则此处可能会有问题，或许还需要把请求值放入到query中
  data.query = _.merge({}, data.query, { _m_target: handleModuleName });

  return data;
}

module.exports = {
  getMixinHandlerData: getMixinHandlerData,
  getMixinHandleModuleData: getMixinHandleModuleData,
};
