import MatmanConfig from '../config/MatmanConfig';

import { IViewMaterials } from './plugin';
import { IMaterialBase } from './material';

export interface IPipelineOpts {
  pluginAppCurMaterial?: IMaterialBase;
  pluginMochaCurMaterial?: IMaterialBase;
}

export interface IPipeline {
  name: string;
  filename: string;
  matmanConfig: MatmanConfig;
  seqId: string;

  opts? : IPipelineOpts;

  setup(): Promise<void> ;
  runTest(): Promise<void> ;
  teardown(): Promise<void> ;

  updatePlugin(pluginConfigArr: any[]): void;
  initPlugin(): void;

  getViewMaterials(): IViewMaterials;
}


