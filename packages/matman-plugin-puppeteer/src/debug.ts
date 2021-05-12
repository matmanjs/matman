import _ from 'lodash';
import { E2ERunner } from 'matman-core';
import { IPageDriverOpts } from 'matman';

import { setE2ERunnerJsonDataToEnv } from 'matman-plugin-test';

import CaseModule from './CaseModule';

interface IDebugCaseModuleOpts{
  doNotSetup?: boolean;
  showResultInConsole?: boolean;
}

export async function debugCaseModule(
  caseModule: CaseModule,
  pageDriverOpts?: IPageDriverOpts,
  debugOpts?: IDebugCaseModuleOpts,
) {
  const e2eRunner = new E2ERunner('/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/matman.config.js');

  if (!debugOpts?.doNotSetup) {
    // 测试地址 https://now.qq.com/index.html
    await e2eRunner.setup();
  }

  // 一定要设置变量
  setE2ERunnerJsonDataToEnv(e2eRunner);

  // await caseModule.handleDependencies();
  const result = await caseModule.run(_.merge({
    show: true,
    doNotCloseBrowser: false,
  }, pageDriverOpts));

  console.log('\n===========================');
  console.log('');
  console.log('The run result is in the follow file: ');
  console.log('');
  console.log(caseModule.pageDriver?.matmanResultConfig?.path);
  console.log('');
  console.log('===========================\n');

  if (debugOpts?.showResultInConsole) {
    console.log(JSON.stringify(result, null, 2));
  }

  // TODO 关闭和清理

  return result;
}
