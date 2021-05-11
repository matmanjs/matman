const path = require('path');
const { E2ERunner } = require('../packages/matman-core');

(async () => {
  const e2eRunner = new E2ERunner(path.join(__dirname, './matman-app/matman.config.js'));

  // 测试地址 https://now.qq.com/index.html
  await e2eRunner.setup();

  console.log(global.matmanE2ERunner);

  process.env.HELINJIANG = 'hhlljj';

  // global.matmanE2ERunner = e2eRunner;

  await e2eRunner.runTest();

  console.log(global.matmanE2ERunner);

  // await e2eRunner.teardown();
})();
