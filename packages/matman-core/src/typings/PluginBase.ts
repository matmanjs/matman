import E2ERunner from '../model/E2ERunner';

export interface IPluginBase {
  name: string;
  seqId: string;

  initPlugin(e2eRunner: E2ERunner): void;
  setup(e2eRunner: E2ERunner): Promise<void>;
  runTest(e2eRunner: E2ERunner): Promise<void> ;
  teardown(e2eRunner: E2ERunner): Promise<void>;
  setSeqId(seqId: string): void;
}
