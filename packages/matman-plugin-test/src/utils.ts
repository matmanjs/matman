import { E2ERunner } from 'matman-core';

const globalAny: any = global;

export interface IE2ERunnerJsonData {
  extraInfo: {
    matmanRootPath: string;
  },
  pluginApp?: any;
  pluginWhistle?: any;
  pluginMockstar?: any;
}

export function setE2ERunnerJsonDataToEnv(e2eRunnerFromParams?: E2ERunner): string {
  let e2eRunner = e2eRunnerFromParams;

  // 如果参数没有传递 e2eRunner，则从全局环境里面去取
  if (!e2eRunner || !(e2eRunner instanceof E2ERunner)) {
    // 该参数为全局参数
    if (!globalAny.matmanE2ERunner) {
      return '';
    }

    e2eRunner = globalAny.matmanE2ERunner as E2ERunner;
  }

  const e2eRunnerJsonData: IE2ERunnerJsonData = {
    extraInfo: {
      matmanRootPath: e2eRunner.matmanConfig.matmanRootPath,
    },
  };

  const pluginApp = e2eRunner.matmanConfig.getPlugin('app') ;
  if (pluginApp) {
    e2eRunnerJsonData.pluginApp = pluginApp;
  }

  const pluginWhistle = e2eRunner.matmanConfig.getPlugin('whistle') ;
  if (pluginWhistle) {
    e2eRunnerJsonData.pluginWhistle = pluginWhistle;
  }

  const pluginMockstar = e2eRunner.matmanConfig.getPlugin('mockstar') ;
  if (pluginMockstar) {
    e2eRunnerJsonData.pluginMockstar = pluginMockstar;
  }

  const saveStr = JSON.stringify(e2eRunnerJsonData);

  process.env.MATMAN_E2E_RUNNER_JSON_DATA_STR = JSON.stringify(e2eRunnerJsonData);

  return saveStr;
}

export function getE2ERunnerJsonDataFromEnv(): IE2ERunnerJsonData | null {
  const e2eRunnerJsonDataStr = process.env.MATMAN_E2E_RUNNER_JSON_DATA_STR ;

  if (!e2eRunnerJsonDataStr) {
    return null;
  }

  try {
    return JSON.parse(e2eRunnerJsonDataStr) as IE2ERunnerJsonData;
  } catch (e) {
    return null;
  }
}
