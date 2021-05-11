const path = require('path');
const { E2ERunner } = require('../packages/matman-e2e-runner/lib');

(async () => {
  const e2eRunner = new E2ERunner(path.join(__dirname, './matman-app/matman.config.js'));

  // 测试地址 https://now.qq.com/index.html
  await e2eRunner.setup();

  global.matmanE2ERunner = e2eRunner;

  await e2eRunner.runTest();

  // await e2eRunner.teardown();
})();
