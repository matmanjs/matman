const path = require('path');
const { PluginApp } = require('../../packages/matman-plugin-app');
const { PluginWhistle } = require('../../packages/matman-plugin-whistle');
const { PluginMockstar } = require('../../packages/matman-plugin-mockstar');
const { PluginPuppeteer } = require('../../packages/matman-plugin-puppeteer');
const { PluginTest } = require('../../packages/matman-plugin-test');

const workspacePath = '/Users/helinjiang/gitprojects/matman-v7-demo';

// 更多配置说明，请参考 https://matmanjs.github.io/matman/api/matman-config.html
module.exports = {
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

  // 用于同源测试的项目源码的根目录，一般指 package.json 的目录
  workspacePath: workspacePath,

  // 测试产物的输出目录
  outputPath: path.join(workspacePath, '.matman_output'),

  // matman-app 项目根目录
  // matmanRootPath: __dirname,

  // 插件列表
  plugins: [
    new PluginApp({
      definedInstanceDir: './src/plugins/app',
      activeInstance: 'prod.js',
    }),
    new PluginWhistle({
      port: 9430,
    }),
    new PluginMockstar({
      definedInstanceDir: './src/plugins/mockstar',
      port: 9440,
    }),
    new PluginPuppeteer({
      deviceDefinedInstanceDir: './src/plugins/puppeteer/device',
      networkConditionDefinedInstanceDir: './src/plugins/puppeteer/network-condition',
      screenshotConfig: true,
      // TODO 本地 chrome 浏览器的目录地址
      options: {},
    }),
    new PluginTest({
      definedInstanceDir: './src/plugins/test',
      activeInstance: 'all.js',
    }),
  ],
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
