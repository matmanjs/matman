import path from 'path';
import fse from 'fs-extra';

import { findCrawlerParser, getFolderNameFromPath } from '../util';

export default class SceenshotConfig {
    /**
     * 构造函数
     *
     * https://github.com/segmentio/nightmare#screenshotpath-clip
     *
     * @param {Object} [params] 额外参数
     * @param {String} [params.path] 截图保存的完成文件名，如果不填写，则将根据当前路径自动生成名字
     * @param {String} [params.clip] 截图的区域
     * @param {String} basePath 基础路径
     */
    constructor(params, basePath) {
        this.path = this._getPath(params.path, basePath);
        this.clip = params.clip;
    }

    getPathWithId(id) {
        return this.path.replace(/(.*)\.(.*)/, function (match, p1, p2) {
            return [p1, `${id}.${p2}`].join('_');
        });
    }

    _getPath(paramsPath, basePath) {
        // 如果传递了path，则直接使用 path
        if (paramsPath) {
            return paramsPath;
        }

        // 根据配置内容获得 crawlerParser 的对象
        const crawlerParser = findCrawlerParser(basePath);

        // 有可能找不到
        if (!crawlerParser) {
            return;
        }

        // 相对路径
        let relativePath = path.relative(crawlerParser.testPath, basePath);
        let arr = relativePath.split(path.sep);

        // 文件名
        const folderName = arr.pop();

        // 需要保存的文件夹路径
        const saveDir = path.join(crawlerParser.screenshotPath, getFolderNameFromPath(arr.join(path.sep)));

        // 要保证这个目录存在，否则保存时会报错
        fse.ensureDirSync(saveDir);

        return path.join(saveDir, folderName + '.png');
    }

}
