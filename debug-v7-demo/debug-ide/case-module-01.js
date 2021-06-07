const path = require('path');
const { Pipeline, searchFilePath, MATMAN_CONFIG_FILE } = require('../../packages/matman-core');
const { setPipelineJsonDataToEnv } = require('../../packages/matman-plugin-test');

const caseModule = require('../matman-app/src/case_modules/page-index/case-01');

(async () => {
  // 自动获取 matman.config.js 路径
  const matmanConfigFilePath = searchFilePath(caseModule.filename, MATMAN_CONFIG_FILE);

  console.log('--matmanConfigFilePath--', matmanConfigFilePath);

  const pipeline = new Pipeline(matmanConfigFilePath);

  // 测试地址 https://now.qq.com/index.html
  await pipeline.setup();

  // 一定要设置变量
  setPipelineJsonDataToEnv(pipeline);

  // await caseModule.handleDependencies();
  const result = await caseModule.run({
    show: true,
    doNotCloseBrowser: false,
  });

  console.log('\n===========================');
  console.log('');
  console.log('The run result is in the follow file: ');
  console.log('');
  console.log(caseModule.pageDriver.matmanResultConfig.path);
  console.log('');
  console.log('===========================\n');

  console.log(JSON.stringify(result, null, 2));

})();
