import fs from 'fs';
import path from 'path';

import { CrawlerParser } from 'matman-crawler';
import MatmanConfig from '../model/MatmanConfig';

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

    // 去掉 ./ ，例如 ./a/b 修改为 a/b
    const changedPath = filePath
        // linux 中去掉 ./ ，例如 ./a/b 修改为 a/b
        .replace(/^\.\//gi, '')
        // windows 中去掉 .\\ ，例如 .\\a\\b 修改为 a\\b
        .replace(/^\.\\\\/gi, '')
        // windows 中去掉 .\ ，例如 .\a\b 修改为 a\b
        .replace(/^\.\\/gi, '');

    const gap = '_';

    const curSep = /\//.test(changedPath) ? '/' : '\\';
    const arr = changedPath.split(curSep);

    // 获得新的文件名
    let newFileName = arr.pop();
    const fileNameArr = newFileName.split('.');
    if (fileNameArr.length > 1) {
        const lastOne = fileNameArr.pop();
        newFileName = fileNameArr.join('.') + gap + tag + '.' + lastOne;
    } else {
        newFileName = newFileName + gap + tag;
    }

    arr.push(newFileName);

    return arr.join(curSep);
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
 * 通过某个路径一直往上找，直到找到 matman.config.js 文件为止，并返回 matmanConfig 对象
 *
 * @param {String} basePath 起始路径
 * @return {null | MatmanConfig}
 */
export function findMatmanConfig(basePath) {
    // 获得 matman.config.js 的文件路径
    const configFilePath = getConfigFilePath(basePath);

    // 如果不是 config file，则从当前路径往上找 config file
    if (!configFilePath) {
        console.error('Can not find config file from basePath=' + basePath);
        return null;
    }

    // 获取 matman.config.js 中的配置项
    const configData = require(configFilePath) || {};

    // 根据配置内容获得 matmanConfig 的对象
    const matmanConfig = new MatmanConfig(configData.rootPath, configData);

    // 如果参数不合理
    let checkResult = matmanConfig.check();
    if (!checkResult.result) {
        console.error(checkResult.msg);
        return null;
    }

    return matmanConfig;
}

/**
 * 根据路径生成不带文件后缀的文件名
 *
 * 例如：
 *
 * /a/b/path -> root_a_b_path
 * a/b/path -> a_b_path
 * a/b/path/file.js -> a_b_path_file_js
 * ./a/b/path -> a_b_path
 * ../a/b/path -> parent_a_b_path
 * d:\\i\\am\\absolute -> d_i_am_absolute
 *
 * @param {String} targetPath 路径
 * @return {String}
 * @author {helinjiang}
 */
export function getFolderNameFromPath(targetPath) {
    return getSaveDirFromPath(targetPath)
        // linux 下的 / 修改为 _
        .replace(/\//gi, '_')

        // windows 下的 \\ 修改为 _
        .replace(/\\/gi, '_')
        .replace(/\\\\/gi, '_')

        // 将文件后缀的 . 修改为 _
        .replace(/\./gi, '_');
}

/**
 * 根据目标路径获得保存路径
 *
 * 例如：
 * /a/b/path -> root/a/b/path
 * a/b/path -> a/b/path
 * ../a/b/path -> parent/a/b/path
 * .. -> parent
 * d:\\i\\am\\absolute -> d\\i\\am\\absolute
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

    // windows 下，去掉 : 符号，即将 d:\\a\\path 修改为 d\\a\\path
    if (/:\\/gi.test(changedPath)) {
        changedPath = changedPath.replace(/:\\/gi, '\\');
    } else if (path.isAbsolute(changedPath)) {
        // linux / macOS 下，将 /a/path 修改为 root/a/path
        changedPath = `root${changedPath}`;
    }

    return changedPath
        // 将 .. 修改为 parent，例如 ../a/b 修改为 parent/a/b
        .replace(/\.\./gi, 'parent')

        // 去掉 ./ ，例如 ./a/b 修改为 a/b
        .replace(/^\.([^[\\||\/])*[\\||\/]/gi, '')

        // 将文件后缀的 . 修改为 _
        .replace(/\./gi, '_');
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
