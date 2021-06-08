import Pipeline from '../model/Pipeline';

export interface IPluginBase {
  name: string;
  filename: string;
  seqId: string;

  initPlugin(pipeline: Pipeline): void;
  setup(pipeline: Pipeline): Promise<void>;
  runTest(pipeline: Pipeline): Promise<void> ;
  teardown(pipeline: Pipeline): Promise<void>;
  setSeqId(seqId: string): void;
}
