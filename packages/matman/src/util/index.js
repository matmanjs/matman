import fs from 'fs';
import path from 'path';

import { CrawlerParser } from 'matman-crawler';

import { MATMAN_CONFIG_FILE as configFileName } from '../config';

/**
 * 获得绝对路径地址
 *
 * @param {String} targetPath 目标路径
 * @param {String} [basePath] 根路径，如果目标路径为相对路径，则将用该路径作为其根路径
 * @return {String}
 */
export function getAbsolutePath(targetPath, basePath) {
    if (!targetPath) {
        return '';
    }

    if (path.isAbsolute(targetPath)) {
        return targetPath;
    }

    return basePath ? path.resolve(basePath, targetPath) : path.resolve(targetPath);
}

/**
 * 通过追加标签，获得新的文件名
 *
 * @param {String} filePath 文件名路径
 * @param {String} [tag] 标签
 * @return {String}
 */
export function getNewFilePathWithTag(filePath, tag) {
    if (!tag) {
        return filePath;
    }

    const dirname = path.dirname(filePath);
    const basename = path.basename(filePath);
    const extname = path.extname(filePath);
    const gap = '_';

    return path.join(dirname, basename.replace(new RegExp(extname), `${gap}${tag}${extname}`));
}

/**
 * 从指定目录开始向上查找 config 配置文件。
 *
 * @param {String} configPath 起始路径，如果非法路径，则默认从当前文件的路径向上查找
 * @return {String}
 */
export function getConfigFilePath(configPath) {
    // 非法的路径时，默认为本文件夹的 dirname
    if (!configPath || !fs.existsSync(configPath)) {
        // console.log('Unknow configPath=' + configPath);
        configPath = __dirname;
    }

    // 如果不是 config file，则从当前路径往上找 config file
    if (configPath.indexOf(configFileName) < 0) {
        let result = _search(configPath);

        // 如果没有找到，则直接返回空路径即可
        if (!result) {
            return '';
        }

        configPath = path.resolve(result, configFileName);
    }

    return configPath;
}

/**
 * 通过某个路径，找到 crawlerParser 对象
 * @param {String} basePath 起始路径
 * @return {null | CrawlerParser}
 */
export function findCrawlerParser(basePath) {
    // 获得 matman.config.js 的文件路径
    const configFilePath = getConfigFilePath(basePath);

    // 如果不是 config file，则从当前路径往上找 config file
    if (!configFilePath) {
        console.error('Can not find config file by basePath=' + basePath);
        return null;
    }

    // 获取 matman.config.js 中的配置项
    const configData = require(configFilePath) || {};

    // 根据配置内容获得 crawlerParser 的对象
    const crawlerParser = new CrawlerParser(configData.rootPath, configData);

    // 如果参数不合理
    let checkResult = crawlerParser.check();
    if (!checkResult.result) {
        console.error(checkResult.msg);
        return null;
    }

    return crawlerParser;
}

/**
 * 根据路径生成不带文件后缀的文件名
 *
 * 例如：
 *
 * a/b/path -> a_b_path
 * a/b/path/file.js -> a_b_path_file_js
 * ./a/b/path -> a_b_path
 * ../a/b/path -> parent_a_b_path
 *
 * @param {String} targetPath 路径
 * @return {String}
 * @author {helinjiang}
 */
export function getFolderNameFromPath(targetPath) {
    // 路径为 ./xxx 类型时要先去掉 ./，然后再将所有的 / 替换为 _
    return targetPath
        .replace(/\.\./gi, 'parent')
        .replace(/^\.([^[\\||\/])*[\\||\/]/gi, '')
        .replace(new RegExp(path.sep.replace(/\\/gi, '\\\\'), 'gi'), '_')
        .replace(/\./, '_');
}

/**
 * 根据相对路径获得保存路径
 *
 * 例如：
 * /a/b/path -> root/a/b/path
 * a/b/path -> a/b/path
 * ../a/b/path -> parent/a/b/path
 * .. -> parent
 *
 * @param {String} targetPath 路径
 * @return {String}
 * @author {helinjiang}
 */
export function getSaveDirFromPath(targetPath) {
    // 找到相对路径，即从测试项目根目录到行为模块文件的路径，例如： page-xxx/cases/basic-check
    // 极端情况下可能存在下面几种类型的结果：
    //   a/b/path
    //   ../a/b/path
    //   ..
    // 截图保存的路径与源码路径一致，如果有 .. 则替换为 parent
    let changedPath = targetPath;

    if (path.isAbsolute(changedPath)) {
        if (/:\\/.test(changedPath)) {
            // windows 下，将 d:\a\path 修改为 d\a\path
            changedPath = changedPath.replace(/:/gi, '');
        } else {
            // linux / macOS 下，将 /a/path 修改为 root/a/path
            changedPath = `root${changedPath}`;
        }
    }

    return changedPath
        .replace(/\.\./gi, 'parent')
        .replace(/^\.([^[\\||\/])*[\\||\/]/gi, '');
}

/**
 * 在指定的路径中，获得配置文件的路径。
 *
 * 寻找的规则：从指定的路径开始，依次往上级目录查找，一直到根目录为止，如果找到，则停止。
 *
 * @param {String} [targetPath] 目标路径
 * @return {String}
 */
function _search(targetPath) {
    let currDir = targetPath || process.cwd();
    let isExist = true;

    while (!fs.existsSync(path.join(currDir, configFileName))) {
        currDir = path.join(currDir, '../');

        // unix跟目录为/， win32系统根目录为 C:\\格式的
        if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
            isExist = false;
            // console.log('未找到 ' + configFileName);
            break;
        }
    }

    return isExist ? currDir : '';
}
