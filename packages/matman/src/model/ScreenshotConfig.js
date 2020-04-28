import path from 'path';
import fse from 'fs-extra';
import fs from 'fs';

import { findCrawlerParser, getAbsolutePath, getFolderNameFromPath, getNewFilePathWithTag } from '../util';

export default class ScreenshotConfig {
    /**
     * 构造函数
     *
     * https://github.com/segmentio/nightmare#screenshotpath-clip
     *
     * @param {String | Boolean | Object} opts 是否启用截图，或者截图保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者截图配置
     * @param {String} [opts.path] 截图保存的完成文件名，如果不填写，则将根据当前路径自动生成名字
     * @param {String} [opts.clip] 截图的区域
     * @param {String} basePath 测试行为模块的目录
     * @param {String} [tag] 标记
     */
    constructor(opts, basePath, tag) {
        this.tag = tag;

        // 如果 this.tag 是存在的文件，则获取文件名
        if (fs.existsSync(this.tag)) {
            this.tag = path.basename(this.tag).replace(/\./gi, '_');
        }

        if (opts && (typeof opts === 'object')) {
            this.path = opts.path;
            this.clip = opts.clip;
        } else if (typeof opts === 'string') {
            this.path = this._getPath(opts, basePath);
        } else {
            this.path = this._getPath(undefined, basePath);
        }
    }

    getPathWithId(id) {
        return this.path.replace(/(.*)\.(.*)/, function (match, p1, p2) {
            return [p1, `${id}.${p2}`].join('_');
        });
    }

    _getPath(paramsPath, basePath) {
        // 如果传递了path，则直接使用 path
        if (paramsPath) {
            return getNewFilePathWithTag(getAbsolutePath(paramsPath, basePath), this.tag);
        }

        // 根据配置内容获得 crawlerParser 的对象
        const crawlerParser = findCrawlerParser(basePath);

        // 有可能找不到
        if (!crawlerParser) {
            console.error('Can not find crawlerParser by basePath', basePath);
            return '';
        }

        // 相对路径
        let relativePath = path.relative(crawlerParser.testerPath, basePath);
        let arr = relativePath.split(path.sep);

        // 文件名
        let folderName = arr.pop();

        if (this.tag) {
            folderName = `${folderName}_${this.tag}`;
        }

        // 需要保存的文件夹路径
        const saveDir = path.join(crawlerParser.screenshotPath, getFolderNameFromPath(arr.join(path.sep)));

        // 要保证这个目录存在，否则保存时会报错
        fse.ensureDirSync(saveDir);

        return path.join(saveDir, folderName + '.png');
    }

}
