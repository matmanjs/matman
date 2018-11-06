import fs from 'fs';
import path from 'path';

import { CrawlerParser } from 'matman-crawler';

import { MATMAN_CONFIG_FILE as configFileName } from '../config';

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

    // 根据配置内容获得 crawlerParser 的对象
    const crawlerParser = new CrawlerParser(require(configFilePath));

    // 如果参数不合理
    let checkResult = crawlerParser.check();
    if (!checkResult.result) {
        console.error(checkResult.msg);
        return null;
    }

    return crawlerParser;
}

export function getFolderNameFromPath(targetPath) {
    // 路径为 ./xxx 类型时要先去掉 ./，然后再将所有的 / 替换为 _
    return targetPath
        .replace(/^\.([^[\\||\/])*[\\||\/]/gi, '')
        .replace(new RegExp(path.sep.replace(/\\/gi, '\\\\'), 'gi'), '_')
        .replace(/\./, '_');
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
