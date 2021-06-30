import Pipeline from '../model/Pipeline';
import { IMaterialBase } from './material';

export interface IViewMaterialsFolder {
  desc: string;
  type: 'folder';
  pluginName: string;
  materialName: string;
  children: IMaterialBase[];
  curMaterial?: IMaterialBase | null;
}

export interface IViewMaterialsGroup {
  desc: string;
  type: 'group';
  children: IViewMaterialsFolder[];
}

export type IViewMaterials = IViewMaterialsGroup [];

export interface IPluginBase {
  name: string;
  seqId: string;

  initPlugin(pipeline: Pipeline): void;

  updatePlugin(pipeline: Pipeline, pluginConfigArr: any[]): void;

  setup(pipeline: Pipeline): Promise<void>;

  runTest(pipeline: Pipeline): Promise<void>;

  teardown(pipeline: Pipeline): Promise<void>;

  setSeqId(seqId: string): void;

  getCurMaterial(): IMaterialBase | null;

  getViewMaterials(matmanRootPath: string): IViewMaterials;
}


