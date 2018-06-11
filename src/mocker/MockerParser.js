const path = require('path');
const fsHandler = require('fs-handler');

class MockerParser {
    /**
     * 构造函数
     *
     * @param {Object} opts 参数
     * @param {String} opts.basePath mocker的根目录
     * @param {Array} [opts.matmanMockers] MatmanMocker 列表
     */
    constructor(opts) {
        this.basePath = opts.basePath;
        this.matmanMockers = Array.isArray(opts.matmanMockers) ? [...opts.matmanMockers] : [];
    }

    /**
     * 获取所有的 mocker 信息
     *
     * @param {Boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Array}
     */
    getAllMocker(isReset) {
        let mockerList = [];

        // 1. 获取所有的 mocker，约定：this.basePath 的每个子目录都是一个独立的 mocker
        fsHandler.search.getAll(this.basePath, { globs: ['*'] }).forEach((item) => {
            // 限制只处理文件夹类型的，不允许在 basePath 目录下有非文件夹的存在
            if (!item.isDirectory()) {
                console.error(`${path.join(item.basePath, item.relativePath)} SHOULD BE Directory!`);
                return;
            }

            // 模块名字，默认取文件名，
            // 在根目录下，每个子文件夹就是一个 mocker 单位，其名字即为文件夹名字
            // let name = path.basename(item.relativePath);
            // console.log('\n找到 mocker ：', name, item);

            // 获得 require 这个模块的相对路径
            let requirePath = getRequirePath(path.join(this.basePath, item.relativePath));
            // console.log('requirePath ：', requirePath);

            mockerList.push(require(requirePath));
        });

        // TODO 2018/6/2 helinjiang: 如果isReset=true，则还需要及时更新到 this.matmanMockers
        // TODO 2018/6/2 helinjiang: 还要返回 this.matmanMockers 中数据

        return mockerList;
    }

    /**
     * 通过名字获取指定的 mocker
     *
     * @param {String} mockerName 名字
     * @param {Boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Object} MatmanMocker 对象
     */
    getMockerByName(mockerName, isReset) {
        let mockerList = this.getAllMocker(isReset);

        return mockerList.filter((item) => {
            return item.name === mockerName;
        })[0];
    }

    /**
     * 通过路由及请求参数获取 handler 的信息
     *
     * @param {String} route 路由规则
     * @param {Object} [params] 请求的参数
     * @return {Object}
     */
    getMockerByRoute(route, params = {}) {
        const allMockerList = this.getAllMocker();
        const paramsKeyLength = Object.keys(params).length;

        let matchedArr = [];

        allMockerList.forEach((item) => {
            const mockerConfig = item.config || {};

            // 如果连 route 都没匹配，则无需后续处理
            if (route !== mockerConfig.route) {
                return;
            }

            let obj = {
                match: 1,
                data: item
            };

            let routeExtra = mockerConfig.routeExtra || {},
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
            return b.match - a.match;
        })[0].data : null;
    }

    /**
     * 通过名字获取指定的 mock module
     *
     * @param {String} mockerName mocker 名字
     * @param {String} mockModuleName mock module 名字
     * @param {Boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Object} MatmanMockModule 对象
     */
    getMockModuleByName(mockerName, mockModuleName, isReset) {
        let mocker = this.getMockerByName(mockerName, isReset);

        // 有可能找不到 mocker
        if (!mocker) {
            console.error('Can not find mock module!', mockerName, mockModuleName);
            return null;
        }

        return mocker.mockModuleList.filter((item) => {
            return item.name === mockModuleName;
        })[0];
    }

}

/**
 * 获得传递给 require 的模块路径，相对于当前文件
 *
 * @param {String} absolutePath 绝对路径
 * @returns {String}
 */
function getRequirePath(absolutePath) {
    // 获得 require 这个模块的相对路径
    let relativePath = path.relative(__dirname, absolutePath);

    // 注意，path.relative 方法返回的结果中，如果是相对当前目录的，则其会把 './' 去掉，
    // 例如， './path/a/b' 会被返回 'path/a/b'
    // 此时如果 require('path/a/b') ，node 会先去 node_modules 模块寻找，
    // 而不是当前目录去寻找，修改为 require('./path/a/b') 就不会有这样问题，
    // 因此，这种情况下一定要补上一个 './'，
    if (relativePath.indexOf('..') < 0) {
        relativePath = './' + relativePath;
    }

    // 需要将“\”替换为“/”，因为 require 语法中模块的路径是以 "/" 来分目录层级的
    return relativePath.replace(/\\/gi, '/');
}

module.exports = MockerParser;