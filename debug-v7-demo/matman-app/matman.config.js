const path = require('path');
const { PluginApp } = require('../../packages/matman-plugin-app');

const workspacePath = '/Users/helinjiang/gitprojects/matman-v7-demo';

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

  workspacePath: workspacePath,
  outputPath: path.join(workspacePath, '.matman_output'),
  plugins: [
    new PluginApp({
      definedInstanceDir: './src/plugins/app',
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
