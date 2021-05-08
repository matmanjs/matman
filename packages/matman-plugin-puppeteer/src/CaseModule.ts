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

    debugger;

    const whistleRule = pluginApp.getWhistleRule();
    if (whistleRule) {
      pluginWhistle.setRules({
        getWhistleRules: () => whistleRule.getConfig(),
      });
    }
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
