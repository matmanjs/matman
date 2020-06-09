import path from 'path';
import webpack from 'webpack';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CleanWebpackPlugin from 'clean-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import StringReplaceWebpackPlugin from 'string-replace-webpack-plugin';
import MatmanConfig from 'matman/src/model/MatmanConfig';

import CrawlerParser from '../../model/CrawlerParser';

/**
 * 创建用于生产环境中的webpack打包配置
 *
 * @param {MatmanConfig} matmanConfig
 * @return {Object}
 */
export function createProdConfig(matmanConfig: MatmanConfig): webpack.Configuration {
  // 设置打包规则
  const prodRules = [];

  // 设置一些entry文件的代码，比如自动打包 jQuery 库进去
  prodRules.push(_getAppendBeforeRule(matmanConfig.crawlerMatch));

  // 设置打包插件
  const prodPlugins = [];

  // 清空, https://github.com/johnagan/clean-webpack-plugin/issues/17
  prodPlugins.push(
    new CleanWebpackPlugin([matmanConfig.crawlerBuildPath], {
      root: matmanConfig.rootPath,
      verbose: true,
      dry: false,
    }),
  );

  // 替换
  prodPlugins.push(new StringReplaceWebpackPlugin());

  // 设置NODE_ENV 为 production
  prodPlugins.push(_setDefinePlugin('production'));

  // https://webpack.js.org/plugins/banner-plugin/
  // 手动增加 window.getPageInfo 导出定义，这样 client script 就无需手动写方法了 #29
  prodPlugins.push(
    new webpack.BannerPlugin({
      banner: 'window.getPageInfo = ',
      raw: true,
    }),
  );

  // 设置 webpack 配置
  const prodConfig: webpack.Configuration = {};

  // 关闭 sourceMap
  // https://webpack.js.org/configuration/devtool/
  // prodConfig.devtool = 'hidden-source-map';

  // 这里的 entry 需要自动生成
  prodConfig.entry = new CrawlerParser(matmanConfig).getEntry();

  prodConfig.output = {
    filename: '[name].js',
    path: matmanConfig.crawlerBuildPath,
  };
  prodConfig.module = {
    rules: prodRules,
  };

  prodConfig.plugins = prodPlugins;

  return prodConfig;
}

/**
 * 获得插入部分前置代码的配置，只限定在 client script 打包文件中才使用，而不是所有js文件
 *
 * @param {RegExp} clientScriptMatch
 * @returns {{test: RegExp, loader: string}}
 * @private
 */
function _getAppendBeforeRule(clientScriptMatch: RegExp) {
  return {
    test: clientScriptMatch,
    loader: path.join(__dirname, '../../../asserts/webpack/webpack-loader-insert-js'),
  };
}

/**
 * 设置NODE_ENV，否则 线上会报 warning.
 * https://stackoverflow.com/questions/30030031
 */
function _setDefinePlugin(env: any) {
  return new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
  });
}
