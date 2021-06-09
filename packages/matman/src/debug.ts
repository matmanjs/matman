import _ from 'lodash';
import { Pipeline, IPageDriverOpts } from 'matman-core';

import { setPipelineJsonDataToEnv } from 'matman-plugin-test';

import CaseModule from './CaseModule';

interface IDebugCaseModuleOpts {
  doNotSetup?: boolean;
  showResultInConsole?: boolean;
}

export async function debugCaseModule(
  pipeline: Pipeline,
  caseModule: CaseModule,
  pageDriverOpts?: IPageDriverOpts,
  debugOpts?: IDebugCaseModuleOpts,
) {
  if (!debugOpts?.doNotSetup) {
    // 测试地址 https://now.qq.com/index.html
    await pipeline.setup();
  }

  // 一定要设置变量
  setPipelineJsonDataToEnv(pipeline);

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