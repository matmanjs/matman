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
    description: handlerName,
    disable: false,
    method: 'get',
    priority: 0,
    plugin: "mocker"
  }, cacheData, handlerConfigData);

  // 名字不能够再被修改，默认为文件夹名字
  data.name = handlerName;

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
 * @param {Object} handleModuleConfigData config.json中的数据
 * @return {Object}
 */
function getMixinHandleModuleData(handleModuleName, handleModuleConfigData) {

  // 始终以 config.json 中定义的为最高优先级（除了defaultModule字段），如果没定义，则使用 cache 值，最后才是默认值
  let data = _.merge({
    description: handleModuleName,
    priority: 0,
  }, handleModuleConfigData);

  // 名字不能够再被修改，默认为文件夹名字
  data.name = handleModuleName;

  // TODO 如果是 /id/:id 类型的，则此处可能会有问题，或许还需要把请求值放入到query中
  data.query = _.merge({}, data.query, { _m_target: handleModuleName });

  return data;
}

/**
 * 获取匹配路由的 Handler 信息
 *
 * @param {Array} allHandlerList 所有的 handler 列表
 * @param {String} route 路由规则
 * @param {Object} [params] 请求的参数
 * @return {Object}
 *
 */
function getMatchedHandler(allHandlerList, route, params = {}) {
  let matchedArr = [];
  let paramsKeyLength = Object.keys(params).length;

  allHandlerList.forEach((item) => {
    // 如果连 route 都没匹配，则无需后续处理
    if (route !== item.route) {
      return;
    }

    let obj = {
      match: 1,
      data: item
    };

    let routeExtra = item.routeExtra || {},
      routeExtraKeys = Object.keys(routeExtra),
      routeExtraKeyLength = routeExtraKeys.length;

    // 如果 routeExtra 为空，则放入数组中之后，无须再后续处理
    if (!routeExtraKeyLength) {
      matchedArr.push(obj);
      return;
    }

    // 如果 routeExtra 不为空，但请求参数为空，则肯定是匹配失败了的，无须放入数组
    if (routeExtraKeyLength && !paramsKeyLength) {
      return;
    }

    let isExistNotMatchedField = false;

    // 如果 routeExtra 不为空，且请求参数也为空，则为其计算匹配度
    routeExtraKeys.forEach((routeExtraKey) => {
      // 注意，这里都转化为字符串来比较
      if ((routeExtra[routeExtraKey] + '') === (params[routeExtraKey] + '')) {
        obj.match++;
      } else {
        // 如果定义了 routeExtra，就要全匹配，有一个不匹配都不行
        isExistNotMatchedField = true;
      }
    });

    if (!isExistNotMatchedField) {
      matchedArr.push(obj);
    }
  });

  return matchedArr.length ? matchedArr.sort((a, b) => {
    return b.match - a.match
  })[0].data : null;

}

module.exports = {
  getMixinHandlerData: getMixinHandlerData,
  getMixinHandleModuleData: getMixinHandleModuleData,
  getMatchedHandler: getMatchedHandler,
};
