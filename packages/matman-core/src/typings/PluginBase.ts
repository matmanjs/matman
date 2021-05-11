export interface IPluginBase {
  name: string;
  seqId: string;

  setup(): Promise<void>;
  runTest(): Promise<void> ;
  teardown(): Promise<void>;
  setSeqId(seqId: string): void;
}
