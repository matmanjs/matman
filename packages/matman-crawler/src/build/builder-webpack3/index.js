import webpack from 'webpack';
import { createProdConfig } from './builder';

const utils = require('../utils');

/**
 * 获得 webpack 的配置结果
 *
 * @param {Object} [opts] 额外选项，可覆盖 config.js 中的配置
 * @param {Boolean} [isDevBuild] 是否为开发模式
 * @return {Promise}
 */
export function getWebpackConfig(opts, isDevBuild) {
    return utils.getConfig()
        .then((data) => {
            // console.log('config.getConfig then', data);

            return createProdConfig(data, opts, isDevBuild);
        });
}

/**
 * 通过 webpack 接口来调用构建
 * @param {Object} webpackConfig 传递给 webpack 构建的参数
 * @param {Function} callback 回调
 */
export function runBuild(webpackConfig, callback) {
    // 这个参数是临时值，传递给 webpack 时移除之
    delete webpackConfig._configParams;
    delete webpackConfig._crawlerParser;

    // 执行构建
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            throw err;
        }

        console.log(stats.toString({
            chunks: false,
            colors: true,
            children: false
        }));

        callback();
    });
}