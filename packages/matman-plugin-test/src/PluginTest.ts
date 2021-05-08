// import path from 'path';
import { PluginBase } from 'matman-plugin-core';


export default class PluginTest extends PluginBase {
  public constructor() {
    super('test');
  }

  public async setup() {
    console.log('==test== setup');
  }

  public async runTest() {
    console.log('==test== runTest');
  }

  public async teardown() {
    console.log('==test== teardown');
  }
}
