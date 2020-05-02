import path from 'path';

import { getAbsolutePath, getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath } from '../util';

export default class CoverageConfig {
    /**
     * 构造函数
     *
     * @param {MatmanConfig} matmanConfig
     * @param {String | Boolean | Object} opts 是否启用覆盖率，或者覆盖率保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者覆盖率配置
     * @param {String} [opts.path] 覆盖率保存的完成文件名，如果不填写，则将根据当前路径自动生成名字
     * @param {Object} [opts.tag] 标记
     * @param {String} [caseModuleFilePath] 测试案例模块的目录
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
            this.path = this._getCoverageFullPath(opts.path, matmanConfig.coveragePath);

        } else if (typeof opts === 'string') {
            // 如果 opts 为字符串，则代表设置的是覆盖率文件保存路径
            this.path = this._getCoverageFullPath(opts, matmanConfig.coveragePath);
        } else {
            // 其他情况自动生成覆盖率文件保存路径
            const relativeSavePath = getSaveDirFromPath(path.relative(matmanConfig.testerPath, caseModuleFilePath));
            const saveFileName = getFolderNameFromPath(path.basename(caseModuleFilePath)) + '.json';
            this.path = this._getCoverageFullPath(path.join(relativeSavePath, saveFileName), matmanConfig.coveragePath);
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
     * 获得完整的覆盖率文件保存路径
     *
     * @param targetPath 原始路径
     * @param basePath 根目录
     * @return {String} 新的路径
     * @author helinjiang
     * @private
     */
    _getCoverageFullPath(targetPath, basePath) {
        return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
    }
}
