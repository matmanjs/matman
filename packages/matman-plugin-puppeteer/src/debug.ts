import { E2ERunner } from 'matman-core';

import CaseModule from './CaseModule';

export async function debugCaseModule(caseModule: CaseModule) {
  const e2eRunner = new E2ERunner('/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/matman.config.js');


  // 测试地址 https://now.qq.com/index.html
  await e2eRunner.setup();

  // await caseModule.handleDependencies();
  const result = await caseModule.run({
    show: true,
    doNotCloseBrowser: true,
  });

  console.log(JSON.stringify(result, null, 2));


  // TODO 关闭和清理
}
