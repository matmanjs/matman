const path = require('path');
const { MatmanPluginApp } = require('./npm/matman-plugin-app');
const { MatmanPluginMockstar } = require('./npm/matman-plugin-mockstar');
const { MatmanPluginPuppeteer } = require('./npm/matman-plugin-puppeteer');

// 更多配置说明，请参考 https://matmanjs.github.io/matman/api/matman-config.html
module.exports = {
  // matman-app 项目根目录
  rootPath: __dirname,

  // 是否自动注入 JQuery
  crawlerInjectJQuery: true,

  // 测试对象的根目录
  // caseModulesPath: path.resolve(__dirname, './src/case_modules'),

  // 爬虫脚本构建之后的目录
  // crawlerBuildPath: path.resolve(__dirname, './build/crawler-script'),

  // 屏幕截图保存的路径
  // screenshotPath: path.resolve(__dirname, './build/screenshot_output'),

  // 覆盖率文件保存路径
  // coveragePath: path.resolve(__dirname, './build/coverage_output'),

  // matman 执行结果保存路径
  // matmanResultPath: path.resolve(__dirname, './build/matman_result_output'),

  // 是否为开发模式
  // isDevBuild: false,

  workspacePath: path.join(__dirname, '../'),
  outputPath: path.join(__dirname, '../.matman_output'),
  plugins: [
    new MatmanPluginApp({
      definedInstanceDir: './src/plugins/app',
      options: {},
    }),
    new MatmanPluginMockstar({
      definedInstanceDir: './src/plugins/mockstar',
      // TODO 是否需要自动注册代理规则？
      options: {},
    }),
    new MatmanPluginPuppeteer({
      deviceDefinedInstanceDir: './src/plugins/puppeteer/device',
      networkConditionDefinedInstanceDir: './src/plugins/puppeteer/network-condition',
      screenshotConfig: true,
      // TODO 本地 chrome 浏览器的目录地址
      options: {},
    }),
  ],
  pluginSettings: {
    appInstance: './src/plugins/app',
  },
  events: {
    setup: () => {
      // install -> build project
      // w2 start
    },
    teardown: () => {
      // 归档产物等操作
    },
  },
  ide: {},
};
