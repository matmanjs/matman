import path from 'path';

import { getAbsolutePath, getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath } from '../util';

export default class ScreenshotConfig {
    /**
     * 构造函数
     *
     * https://github.com/segmentio/nightmare#screenshotpath-clip
     *
     * @param {MatmanConfig} matmanConfig
     * @param {String | Boolean | Object} opts 是否启用截图，或者截图保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者截图配置
     * @param {String} [opts.path] 截图保存的完成文件名，绝对路径，例如 `/root/xyz.png`，如果不填写，则将根据当前路径自动生成截图文件名字
     * @param {Object} [opts.clip] 截图的区域，例如 { x: 0, y: 0, width: 0, height: 0 }
     * @param {String} [opts.tag] 标记
     * @param {String} [caseModuleFilePath] 测试行为模块的目录
     * @param {String} [tag] 标记
     * @author helinjiang
     */
    constructor(matmanConfig, opts, caseModuleFilePath, tag) {
        this.tag = tag;

        if (opts && (typeof opts === 'object')) {
            // 对象中传递的标记优先
            if (opts.tag) {
                this.tag = opts.tag;
            }

            // 如果传递了对象
            this.path = this._getScreenshotFullPath(opts.path, matmanConfig.screenshotPath);

            // 截图的区域，例如 { x: 0, y: 0, width: 0, height: 0 }
            // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winsetthumbnailclipregion-windows
            this.clip = opts.clip;

        } else if (typeof opts === 'string') {
            // 如果 opts 为字符串，则代表设置的是截图保存路径
            this.path = this._getScreenshotFullPath(opts, matmanConfig.screenshotPath);
        } else {
            // 其他情况自动生成截图保存路径
            const relativeSavePath = getSaveDirFromPath(path.relative(matmanConfig.testerPath, caseModuleFilePath));
            const saveFileName = getFolderNameFromPath(path.basename(caseModuleFilePath)) + '.png';
            this.path = this._getScreenshotFullPath(path.join(relativeSavePath, saveFileName), matmanConfig.screenshotPath);
        }
    }

    /**
     * 根据一个标志获得新的路径
     *
     * @param {String | Number} id 标志
     * @return {string} 新的路径
     * @author helinjiang
     */
    getPathWithId(id) {
        return this.path.replace(/(.*)\.(.*)/, function (match, p1, p2) {
            return [p1, `${id}.${p2}`].join('_');
        });
    }

    /**
     * 获得完整的截图文件保存路径
     *
     * @param targetPath 原始路径
     * @param basePath 根目录
     * @return {String} 新的路径
     * @author helinjiang
     * @private
     */
    _getScreenshotFullPath(targetPath, basePath) {
        return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
    }
}
