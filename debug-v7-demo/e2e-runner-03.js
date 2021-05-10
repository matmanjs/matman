const path = require('path');
const { E2ERunner } = require('../packages/matman-e2e-runner/lib');
const { PluginApp } = require('../packages/matman-plugin-app/lib');
const { PluginWhistle } = require('../packages/matman-plugin-whistle/lib');
const { PluginPuppeteer, CaseModule } = require('../packages/matman-plugin-puppeteer/lib');
const { PluginMockstar } = require('../packages/matman-plugin-mockstar');
const { PluginTest } = require('../packages/matman-plugin-test');

(async () => {
  const e2eRunner = new E2ERunner({
    workspacePath: path.join(__dirname, '../'),
    outputPath: path.join(__dirname, '../.matman_output'),
  });

  // 测试地址 https://now.qq.com/index.html

  // TODO 读取 matman.config.js 中的内容
  const pluginApp = new PluginApp({
    definedInstanceDir: './src/plugins/app',
  });
  e2eRunner.addPlugin(pluginApp);

  // TODO 读取 matman.config.js 中的内容
  const pluginMockstar = new PluginMockstar({
    port: 9440,
  });
  e2eRunner.addPlugin(pluginMockstar);

  // TODO 读取 matman.config.js 中的内容
  const pluginWhistle = new PluginWhistle({
    port: 9430,
  });
  e2eRunner.addPlugin(pluginWhistle);

  // TODO 读取 matman.config.js 中的内容
  const pluginPuppeteer = new PluginPuppeteer({
    deviceDefinedInstanceDir: './src/plugins/puppeteer/device',
    networkConditionDefinedInstanceDir: './src/plugins/puppeteer/network-condition',
    screenshotConfig: true,
    // TODO 本地 chrome 浏览器的目录地址
    options: {},
  });
  e2eRunner.addPlugin(pluginPuppeteer);

  // TODO 读取 matman.config.js 中的内容
  const pluginTest = new PluginTest({
    definedInstanceDir: './src/plugins/test',
  });
  e2eRunner.addPlugin(pluginTest);

  await e2eRunner.setup();

  // await pluginPuppeteer.handleDependencies(pluginWhistle, pluginApp);

  const caseModule = new CaseModule({
    filename: __filename,
  });

  caseModule.setPluginApp(pluginApp);
  caseModule.setPluginWhistle(pluginWhistle);
  caseModule.setPluginMockstar(pluginMockstar);

  await caseModule.handleDependencies();

  // 设置代理规则：项目 & mockstar

  await e2eRunner.runTest();

  // await e2eRunner.teardown();
})();
