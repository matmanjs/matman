import webpack from 'webpack';
import { createProdConfig } from './builder';

/**
 * 获得 webpack 的配置结果
 *
 * @param {MatmanConfig} matmanConfig
 * @param {Object} [opts] 额外选项
 * @return {Object}
 */
export function getWebpackConfig(matmanConfig, opts) {
    return Promise.resolve(createProdConfig(matmanConfig, opts));
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