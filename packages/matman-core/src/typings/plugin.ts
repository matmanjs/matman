import Pipeline from '../model/Pipeline';
import { IMaterialBase } from './material';

export interface ICurMaterial {
  [key: string]: IMaterialBase;
}

export interface IViewMaterialsFolder {
  desc: string;
  type: 'folder';
  pluginName: string;
  materialName: string;
  children: IMaterialBase[];
  curMaterial: ICurMaterial;
}

export interface IViewMaterialsGroup {
  desc: string;
  type: 'group';
  children: IViewMaterialsFolder[];
}

export type IViewMaterials = IViewMaterialsGroup [];

export interface IPluginBase {
  id: string;
  seqId: string;

  initPlugin(pipeline: Pipeline): void;

  updatePlugin(pipeline: Pipeline, pluginConfigArr: any[]): void;

  setup(pipeline: Pipeline): Promise<void>;

  runTest(pipeline: Pipeline): Promise<void>;

  teardown(pipeline: Pipeline): Promise<void>;

  setSeqId(seqId: string): void;

  getCurMaterial(): ICurMaterial;

  getViewMaterials(matmanRootPath: string): IViewMaterials;
}


