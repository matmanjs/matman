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
     * @param {boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Array}
     */
    getAllMocker(isReset) {
        // 1. 获取所有的 handler
        fsHandler.search.getAll(this.basePath, { globs: ['*'] }).forEach((item) => {
            // 限制只处理文件夹类型的，不允许在 basePath 目录下有非文件夹的存在
            if (!item.isDirectory()) {
                console.error(`${path.join(item.basePath, item.relativePath)} SHOULD BE Directory!`);
                return;
            }

            // 模块名字，默认取文件名，
            // 在根目录下，每个子文件夹就是一个 mocker 单位，其名字即为文件夹名字
            let name = path.basename(item.relativePath);

            console.log('找到 mocker ：', name);

        });

    }
}

module.exports = MockerParser;