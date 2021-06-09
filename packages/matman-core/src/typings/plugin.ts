import Pipeline from '../model/Pipeline';

export interface IPluginBase {
  name: string;
  seqId: string;

  initPlugin(pipeline: Pipeline): void;
  updatePlugin(pipeline: Pipeline, pluginConfigArr: any[]): void;

  setup(pipeline: Pipeline): Promise<void>;
  runTest(pipeline: Pipeline): Promise<void> ;
  teardown(pipeline: Pipeline): Promise<void>;

  setSeqId(seqId: string): void;
}
