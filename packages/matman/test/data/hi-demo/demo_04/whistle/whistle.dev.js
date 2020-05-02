const { getDevRules } = require('./index');

/**
 * 动态生成 whistle 规则
 *
 * @param {Function} cb 回调函数，接受两个参数 name(规则集名字) 和 rules(具体规则)
 * @param {Object} [util] 工具集
 * @param {Number} [util.port] 当前 whistle 启动的端口
 * @param {Function} [util.existsPlugin] 判断指定的 whistle 插件是否存在，接受一个 name 参数，返回一个 Boolean 值
 */
module.exports = (cb, util) => {
    console.log('即将动态设置 whistle 规则...');

    const result = getDevRules(util);

    console.log('whistle 规则信息为：\n', JSON.stringify(result, null, 2));

    cb(result);

    console.log('动态设置 whistle 规则已完成！');
};
