const path = require('path');

const {
  PluginApp,
  PluginWhistle,
  PluginMockstar,
  PluginPuppeteer,
  PluginTest,
} = require('../../packages/matman');

// new pipeline 时可以传递一些值，初始化覆盖，适用于 run test 场景

// FIXME: 如果不是同源测试方式，例如只是针对测试环境的测试，该怎么办呢？
const workspacePath = path.resolve(__dirname, '../../test/data/project-react-h5');

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
      materialDir: './src/materials/app',
      // activated: 'prod.js',
    }),
    new PluginWhistle({
      port: 9430,
    }),
    new PluginMockstar({
      mockerDir: './src/dependencies/mockstar/mockers',
      materialDir: './src/case_modules/*/materials/mock-services',
      port: 9440,
    }),
    new PluginPuppeteer({
      deviceMaterialDir: './src/materials/puppeteer/device',
      networkConditionMaterialDir: './src/materials/puppeteer/network-condition',
      userActionMaterialDir: './src/case_modules/*/materials/user-actions',
      webCrawlerMaterialDir: './src/case_modules/*/materials/web-crawlers',
      screenshotConfig: true,
      // TODO 本地 chrome 浏览器的目录地址
      options: {},
    }),
    new PluginTest({
      materialDir: './src/materials/test',
      // activated: 'all.js',
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
