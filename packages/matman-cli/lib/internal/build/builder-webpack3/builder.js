'use strict';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');

const e2eBuild = require('../../../../business/e2e-build');

class Builder {

  /**
   * 创建用于生产环境中的webpack打包配置
   *
   * @param {Object} params
   * @param {String} params.rootPath 项目根目录
   * @param {String} params.buildPath
   * @param {String} params.mockServerPath
   * @param {String} params.e2eTestPath 端对端测试项目的根目录
   * @param {String} params.clientScriptBuildPath 输出打包后的 client script 的路径
   * @param {RegExp} params.clientScriptMatch 正则表达式，用于匹配路径中那些文件是 client script
   * @param {Object} params.entry 传递给webpack 的 entry属性属性
   * @param {Object} opts
   */
  static createProdConfig(params = {}, opts = {}) {
    const clientScriptHandler = e2eBuild.getClientScriptHandler(params);

    // 设置打包规则
    const prodRules = [];

    // 设置一些entry文件的代码，比如自动打包 jQuery 库进去
    prodRules.push(Builder._getAppendBeforeRule(clientScriptHandler.regMatch));

    // 设置打包插件
    let prodPlugins = [];

    // 清空, https://github.com/johnagan/clean-webpack-plugin/issues/17
    prodPlugins.push(new CleanWebpackPlugin([clientScriptHandler.buildPath], {
      root: params.rootPath,
      verbose: true,
      dry: false
    }));

    // 替换
    prodPlugins.push(new StringReplaceWebpackPlugin());

    // 设置NODE_ENV 为 production
    prodPlugins.push(Builder._setDefinePlugin('production'));

    // https://webpack.js.org/plugins/banner-plugin/
    // 手动增加 window.getPageInfo 导出定义，这样 client script 就无需手动写方法了 #29
    prodPlugins.push(new webpack.BannerPlugin({
      banner: 'window.getPageInfo = ',
      raw: true
    }));

    // 设置 webpack 配置
    const prodConfig = {};

    // 这里的 entry 需要自动生成
    prodConfig.entry = clientScriptHandler.getEntry();

    prodConfig.output = {
      filename: '[name].js',
      path: clientScriptHandler.buildPath
    };
    prodConfig.module = {
      rules: prodRules
    };
    prodConfig.plugins = prodPlugins;

    // config 文件配置项
    prodConfig._configParams = params;
    prodConfig._clientScriptHandler = clientScriptHandler;

    return prodConfig;
  }

  /**
   * 获得插入部分前置代码的配置，只限定在 client script 打包文件中才使用，而不是所有js文件
   *
   * @param {RegExp} clientScriptMatch
   * @returns {{test: RegExp, loader: string}}
   * @private
   */
  static _getAppendBeforeRule(clientScriptMatch) {
    return {
      test: clientScriptMatch,
      loader: path.join(__dirname, './webpack/webpack-loader-insert-js')
    };
  }

  /**
   * 设置NODE_ENV，否则 线上会报 warning.
   * https://stackoverflow.com/questions/30030031
   */
  static _setDefinePlugin(env) {
    return new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    });
  }
}

module.exports = Builder;