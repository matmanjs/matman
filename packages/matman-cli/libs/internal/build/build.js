'use strict';

const path = require('path');
const fs = require('fs');

const matmanCrawler = require('matman-crawler');

/**
 *
 * @param {Object} args 参数
 * @param {Boolean} [args.dev] 是否为开发者模式，使用方式: --dev
 * @param {String} [args.config] 自定义配置文件，使用方式: --config=mockstar.config.js
 */
module.exports = function (args) {
    // console.log(args);
    const cwd = process.cwd();
    const isDevBuild = !!args.dev;
    const config = args.config || 'matman.config.js';

    // 绝对路径
    let configAbsolutePath = path.resolve(cwd, config);

    // 一定要检查config文件是否存在
    if (fs.existsSync(configAbsolutePath)) {
        console.log('Load config file:', configAbsolutePath);
    } else {
        console.error('Unkown config file: ', configAbsolutePath);
        return Promise.reject();
    }

    // 获取 matman.config.js 配置文件中的内容
    let matmanConfig = require(configAbsolutePath);

    // 开发模式
    if (isDevBuild) {
        matmanConfig.isDevBuild = isDevBuild;
    }

    return matmanCrawler.build(matmanConfig);
};
