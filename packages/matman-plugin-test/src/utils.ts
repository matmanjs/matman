import { Pipeline } from 'matman-core';

const globalAny: any = global;

export interface IPipelineJsonData {
  extraInfo: {
    matmanRootPath: string;
  },
  pluginApp?: any;
  pluginWhistle?: any;
  pluginMockstar?: any;
}

export function setPipelineJsonDataToEnv(pipelineFromParams?: Pipeline): string {
  let pipeline = pipelineFromParams;

  // 如果参数没有传递 pipeline，则从全局环境里面去取
  if (!pipeline || !(pipeline instanceof Pipeline)) {
    // 该参数为全局参数
    if (!globalAny.matmanPipeline) {
      return '';
    }

    pipeline = globalAny.matmanPipeline as Pipeline;
  }

  const pipelineJsonData: IPipelineJsonData = {
    extraInfo: {
      matmanRootPath: pipeline.matmanConfig.matmanRootPath,
    },
  };

  const pluginApp = pipeline.matmanConfig.getPlugin('app') ;
  if (pluginApp) {
    pipelineJsonData.pluginApp = pluginApp;
  }

  const pluginWhistle = pipeline.matmanConfig.getPlugin('whistle') ;
  if (pluginWhistle) {
    pipelineJsonData.pluginWhistle = pluginWhistle;
  }

  const pluginMockstar = pipeline.matmanConfig.getPlugin('mockstar') ;
  if (pluginMockstar) {
    pipelineJsonData.pluginMockstar = pluginMockstar;
  }

  const saveStr = JSON.stringify(pipelineJsonData);

  process.env.MATMAN_E2E_RUNNER_JSON_DATA_STR = JSON.stringify(pipelineJsonData);

  return saveStr;
}

export function getPipelineJsonDataFromEnv(): IPipelineJsonData | null {
  const pipelineJsonDataStr = process.env.MATMAN_E2E_RUNNER_JSON_DATA_STR ;

  if (!pipelineJsonDataStr) {
    return null;
  }

  try {
    return JSON.parse(pipelineJsonDataStr) as IPipelineJsonData;
  } catch (e) {
    return null;
  }
}
