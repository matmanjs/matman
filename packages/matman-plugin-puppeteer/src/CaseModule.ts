// import path from 'path';
import { PluginWhistle } from 'matman-plugin-whistle';
import { PluginApp } from 'matman-plugin-app';


interface ICaseModuleOpts {
  filename?: string;
}


export default class CaseModule {
  public filename?: string;

  public constructor(opts: ICaseModuleOpts) {
    this.filename = opts.filename;
  }

  public async handleDependencies(pluginWhistle: PluginWhistle, pluginApp: PluginApp) {
    console.log('==CaseModule== handleDependencies');

    // appInstance
    // mockstarInstance

    // buildApp
    // useMockServer

    // TODO 从 instance 里面读取 setup 方法并执行
    // const activeInstance = '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/app/dev.js';
    const activeInstance = '/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/app/prod.js';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const instance = require(activeInstance)();

    console.log('--PluginPuppeteer instance--', instance);

    pluginWhistle.setRules({
      getWhistleRules: instance.getWhistleRules,
    });
  }
}


// module.exports = new CaseModule({
//   filename: __filename,
//   dependencies: {
//     appRunner: true,
//     mockRunner: mockOfBasic,
//   },
//   extends: {
//     device: iPhone6,
//     networkCondition: fast3G,
//   },
//   handler: handlerOfBasicCheck,
//   crawler: './crawlers/get-page-info.js',
// });
