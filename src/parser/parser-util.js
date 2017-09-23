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
 * 获取 handle_module 信息
 *
 * @param {Array} allHandlerList 所有的 handler 列表
 * @param {String} route 路由规则
 * @param {Object} [params] 请求的参数
 * @return {Object}
 *
 */
function getMatchedHandler(allHandlerList, route, params = {}) {
  //===============================================================
  // 1. 找出所有匹配 route 的元素，可能有多个
  //===============================================================
  let arr = [];

  allHandlerList.forEach((item) => {
    if (route === item.route) {
      arr.push(item);
    }
  });

  // 如果只有一个匹配，则一定是它
  if (arr.length < 2) {
    return arr[0];
  }

  //===============================================================
  // 2. 不仅校验 route ，还需要校验 routeExtra 属性
  //===============================================================
  let paramsKeyLength = Object.keys(params).length;
  let pureOne;

  for (let i = 0, length = arr.length; i < length; i++) {
    let curHandlerData = arr[i],
      routeExtra = curHandlerData.routeExtra || {},
      routeExtraKeys = Object.keys(routeExtra),
      routeExtraKeyLength = routeExtraKeys.length;

    if (!routeExtraKeyLength) {
      // 如果没有配置限定

      if (!paramsKeyLength) {
        // 如果请求参数也为空，则就是它了
        return curHandlerData;
      }

      // 如果请求参数不为空，这个很难判断，但如果没有其他精准匹配结果，则返回它
      pureOne = curHandlerData;

    } else {
      // 如果配置了限定

      if (!paramsKeyLength) {
        // 如果请求参数也为空，则肯定不是它
        continue;
      }

      let isFound = true;

      // 如果请求参数不为空，则对比参数值
      for (let k = 0; k < routeExtraKeyLength; k++) {
        let field = routeExtraKeys[k];

        // 这里都转化为字符串来比较，一旦不相等，则不再判断了
        if ((routeExtra[field] + '') !== (params[field] + '')) {
          isFound = false;
          break;
        }
      }

      if (isFound) {
        return curHandlerData;
      }
    }
  }

  return pureOne;
}

module.exports = {
  getMixinHandlerData: getMixinHandlerData,
  getMixinHandleModuleData: getMixinHandleModuleData,
  getMatchedHandler: getMatchedHandler,
};
