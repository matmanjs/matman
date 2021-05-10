import path from 'path';
import _ from 'lodash';

import { getLocalWhistleServer, launch, PageDriverAsync } from 'matman';

import { PluginWhistle } from 'matman-plugin-whistle';
import { PluginApp } from 'matman-plugin-app';
import { PluginMockstar } from 'matman-plugin-mockstar';
import { BrowserRunner, getPuppeteerDefinedDevice } from 'matman-runner-puppeteer';


interface ICaseModuleOpts {
  filename: string;
  handler: (pageDriver: PageDriverAsync) => PageDriverAsync;
  crawler: string;
}

export default class CaseModule {
  public filename: string;
  public handler: (pageDriver: PageDriverAsync) => PageDriverAsync;
  public crawler: string;


  public pluginWhistle?: PluginWhistle;
  public pluginApp?: PluginApp;
  public pluginMockstar?: PluginMockstar;

  public constructor(opts: ICaseModuleOpts) {
    this.filename = opts.filename;
    this.handler = opts.handler;
    this.crawler = opts.crawler;
  }

  public setPluginWhistle(pluginWhistle: PluginWhistle) {
    this.pluginWhistle = pluginWhistle;
  }

  public setPluginApp(pluginApp: PluginApp) {
    this.pluginApp = pluginApp;
  }

  public setPluginMockstar(pluginMockstar: PluginMockstar) {
    this.pluginMockstar = pluginMockstar;
  }

  public async handleDependencies() {
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


    const whistleRuleFromApp = this.pluginApp?.getWhistleRule();
    const whistleRuleFromMockstar = this.pluginMockstar?.getWhistleRule();


    if (whistleRuleFromApp || whistleRuleFromMockstar) {
      this.pluginWhistle?.setRules({
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

    //
  }

  // 执行
  public async run(pageDriverOpts: any) {
    // 创建 PageDriver


    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launch(
      new BrowserRunner(),
      _.merge({
        show: true,
        doNotCloseBrowser: true,
        useRecorder: true,
      }, pageDriverOpts, { caseModuleFilePath: this.filename }),
    );

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    // await pageDriver.useProxyServer(await getLocalWhistleServer(this.pluginWhistle?.cacheData.getCacheItem('port') as number));
    await pageDriver.useProxyServer('127.0.0.1:9430');

    // 使用 mockstar 来做 mock server 用于构造假数据
    // if (queryDataMap || pageDriverOpts.queryDataMap) {
    //   await pageDriver.useMockstar(_.merge({}, queryDataMap, pageDriverOpts.queryDataMap));
    // }

    // 设置浏览器设备型号
    // await pageDriver.setDeviceConfig(DEVICE.IOS_IPHONE_6);

    // 设置截屏
    await pageDriver.setScreenshotConfig(true);

    // 操作
    await this.handler(pageDriver);

    // 获取结果
    return pageDriver.evaluate(path.join(path.dirname(__filename), './crawlers/get-page-info.js'));
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
