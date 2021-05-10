// import path from 'path';
import { PluginWhistle } from 'matman-plugin-whistle';
import { PluginApp } from 'matman-plugin-app';
import { PluginMockstar } from 'matman-plugin-mockstar';
import { getPuppeteerDefinedDevice } from 'matman-runner-puppeteer';

interface ICaseModuleOpts {
  filename?: string;
}

export default class CaseModule {
  public filename?: string;

  public constructor(opts: ICaseModuleOpts) {
    this.filename = opts.filename;
  }

  public async handleDependencies(pluginWhistle: PluginWhistle, pluginApp: PluginApp, pluginMockstar: PluginMockstar) {
    console.log('==CaseModule== handleDependencies');

    // appInstance
    // mockstarInstance

    // buildApp
    // useMockServer


    // const whistleRule = pluginApp.getWhistleRule();
    // if (whistleRule) {
    //   pluginWhistle.setRules({
    //     getWhistleRules: () => whistleRule.getConfig(),
    //   });
    // }


    const whistleRuleFromApp = pluginApp.getWhistleRule();
    const whistleRuleFromMockstar = pluginMockstar.getWhistleRule();


    if (whistleRuleFromApp || whistleRuleFromMockstar) {
      pluginWhistle.setRules({
        getWhistleRules: () => {
          const name = 'none';
          const newContentArr: string[] = [];

          if (whistleRuleFromApp) {
            const contentFromApp = whistleRuleFromApp.getConfig().rules;
            newContentArr.push('\n# === plugin app begin ===\n');
            newContentArr.push(contentFromApp);
            newContentArr.push('\n# === plugin app end ===\n');
          }

          if (whistleRuleFromMockstar) {
            const contentFromMockstar = whistleRuleFromMockstar.getConfig().rules;
            newContentArr.push('\n# === plugin mockstar begin ===\n');
            newContentArr.push(contentFromMockstar);
            newContentArr.push('\n# === plugin mockstar end ===\n');
          }

          return {
            name,
            rules: newContentArr.join('\n'),
          };
        },
      });
    }
  }

  public async handleExtends() {
    console.log('==CaseModule== handleExtends');

    // 获取 deviceInstance
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const deviceInstance01 = require('/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/puppeteer/device/iPhone6.js');
    console.log(deviceInstance01);

    // 获取 deviceInstance
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const deviceInstance02 = require('/Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/plugins/puppeteer/device/iPhoneXCustom.js');
    const r = deviceInstance02((deviceName: string) => {
      const definedDevice = getPuppeteerDefinedDevice(deviceName);
      if (!definedDevice) {
        throw new Error(`${deviceName} is not in puppeteer.devices! Please check https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts`);
      }

      return definedDevice;
    });
    console.log(r);
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
