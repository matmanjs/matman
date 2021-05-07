// import path from 'path';
import { PluginBase } from 'matman-plugin-core';

import { startWhistle } from './utils';


export default class PluginWhistle extends PluginBase {
  /**
   * 序列号
   */
  public seqId: string;


  public constructor() {
    super('whistle');

    this.seqId = `${this.name}-${Math.random()}`;
  }

  public setSeqId(seqId: string) {
    this.seqId = seqId;
  }


  public async setup() {
    console.log('==whistle== setup');

    await startWhistle({
      seqId: this.seqId,
    });
  }
}
