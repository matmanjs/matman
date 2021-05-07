const path = require('path');
const { E2ERunner } = require('../packages/matman-e2e-runner');
const { PluginApp } = require('../packages/matman-plugin-app');

(async () => {
  const e2eRunner = new E2ERunner({
    workspacePath: path.join(__dirname, '../'),
    outputPath: path.join(__dirname, '../.matman_output'),
  });

  // TODO 读取 matman.config.js 中的内容
  const pluginApp = new PluginApp({
    definedInstanceDir: './src/plugins/app',
    options: {},
  });
  e2eRunner.addPlugin(pluginApp);

  await e2eRunner.setup();

  await e2eRunner.runTest();

  await e2eRunner.teardown();
})();
