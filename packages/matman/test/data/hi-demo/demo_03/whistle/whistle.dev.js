const path = require('path');

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

    // 规则内容，具体语法请参考： http://wproxy.org/whistle/
    // 注意：如果涉及到正则表达式，则 \ 需要修改为 \\ (用两个反斜杠)，否则自动设置到 whistle 时会被丢失
    const ruleList = [
        `www.baidu.com ${path.join(__dirname, '../local-project')}/baidu.html`
    ];

    cb({
        name: `matman_demo_03_${util.port}`,
        rules: ruleList.join('\n')
    });

    console.log('动态设置 whistle 规则已完成！');
};
