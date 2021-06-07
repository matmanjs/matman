import _ from 'lodash';
import { E2ERunner, IPageDriverOpts, MATMAN_CONFIG_FILE, searchFilePath } from 'matman-core';

import { setE2ERunnerJsonDataToEnv } from 'matman-plugin-test';

import CaseModule from './CaseModule';

interface IDebugCaseModuleOpts {
  doNotSetup?: boolean;
  showResultInConsole?: boolean;
}

export async function debugCaseModule(
  caseModule: CaseModule,
  pageDriverOpts?: IPageDriverOpts,
  debugOpts?: IDebugCaseModuleOpts,
) {
  // 自动获取 matman.config.js 路径
  const matmanConfigFilePath = searchFilePath(caseModule.filename, MATMAN_CONFIG_FILE);
  const e2eRunner = new E2ERunner(matmanConfigFilePath);

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
