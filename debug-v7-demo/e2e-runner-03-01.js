const path = require('path');
const { E2ERunner } = require('../packages/matman-e2e-runner/lib');

const { PluginPuppeteer, CaseModule } = require('../packages/matman-plugin-puppeteer/lib');
(async () => {
  const e2eRunner = new E2ERunner({
    workspacePath: path.join(__dirname, '../'),
    outputPath: path.join(__dirname, '../.matman_output'),
  });

  // 测试地址 https://now.qq.com/index.html

  // TODO 读取 matman.config.js 中的内容
  const pluginPuppeteer = new PluginPuppeteer({
    deviceDefinedInstanceDir: './src/plugins/puppeteer/device',
    networkConditionDefinedInstanceDir: './src/plugins/puppeteer/network-condition',
    screenshotConfig: true,
    // TODO 本地 chrome 浏览器的目录地址
    options: {},
  });
  e2eRunner.addPlugin(pluginPuppeteer);

  await e2eRunner.setup();

  // await pluginPuppeteer.handleDependencies(pluginWhistle, pluginApp);

  const caseModule = new CaseModule({
    filename: __filename,
  });

  await caseModule.handleExtends();

  // 设置代理规则：项目 & mockstar

  await e2eRunner.runTest();

  // await e2eRunner.teardown();
})();
