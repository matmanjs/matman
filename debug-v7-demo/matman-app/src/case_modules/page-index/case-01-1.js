const { E2ERunner } = require('../../../../../packages/matman-core');
const caseModule = require('./case-01');

(async () => {
  const e2eRunner = new E2ERunner(
    '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/matman.config.js',
  );

  // 测试地址 https://now.qq.com/index.html
  await e2eRunner.setup();

  // await caseModule.handleDependencies();
  const result = await caseModule.run({
    show: true,
    doNotCloseBrowser: true,
    useRecorder: true,
  });

  console.log(JSON.stringify(result, null, 2));

  // 设置代理规则：项目 & mockstar

  // await e2eRunner.runTest();

  // await e2eRunner.teardown();
})();
