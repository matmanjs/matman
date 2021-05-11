import path from 'path';
import _ from 'lodash';

import { launch, PageDriverAsync } from 'matman';

import { PluginWhistle } from 'matman-plugin-whistle';
import { PluginApp, DefinedInstance as AppDefinedInstance } from 'matman-plugin-app';
import { PluginMockstar, DefinedInstance as MockstarDefinedInstance, getDefinedInstance as getMockstarDefinedInstance } from 'matman-plugin-mockstar';
import { BrowserRunner } from 'matman-runner-puppeteer';
import DeviceInstance, { getDeviceInstance } from './DeviceInstance';

interface ICaseModuleOpts {
  filename: string;
  handler: (pageDriver: PageDriverAsync) => PageDriverAsync;
  crawler: string;
  extends?: {
    device?: DeviceInstance;
  };
  dependencies?: {
    buildApp?: boolean;
    useMockServer?: MockstarDefinedInstance;
  };
}

export default class CaseModule {
  public filename: string;
  public handler: (pageDriver: PageDriverAsync) => PageDriverAsync;
  public crawler: string;

  public pluginWhistle?: PluginWhistle;
  public pluginApp?: PluginApp;
  public pluginMockstar?: PluginMockstar;

  private readonly deviceInstance: DeviceInstance | null;
  private appDefinedInstance: AppDefinedInstance | null;
  private mockstarDefinedInstance: MockstarDefinedInstance | null;

  public constructor(opts: ICaseModuleOpts) {
    this.filename = opts.filename;
    this.handler = opts.handler;
    this.crawler = opts.crawler;

    this.appDefinedInstance = null;

    this.deviceInstance = getDeviceInstance(opts.extends?.device);
    this.mockstarDefinedInstance = getMockstarDefinedInstance(opts.dependencies?.useMockServer);
  }

  public setPluginWhistle(pluginWhistle: PluginWhistle) {
    this.pluginWhistle = pluginWhistle;
  }

  public setPluginApp(pluginApp: PluginApp) {
    this.pluginApp = pluginApp;

    this.appDefinedInstance = this.pluginApp.getActiveInstance();
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

    const whistleRuleFromApp = this.appDefinedInstance?.getWhistleRule(this.pluginApp?.cacheData);
    const whistleRuleFromMockstar = this.mockstarDefinedInstance?.getWhistleRule(this.pluginMockstar?.cacheData);

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

  // 执行
  public async run(pageDriverOpts: any) {
    // 创建 PageDriver

    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launch(
      new BrowserRunner(),
      _.merge(
        {
          show: true,
          doNotCloseBrowser: true,
          useRecorder: true,
        },
        pageDriverOpts,
        { caseModuleFilePath: this.filename },
      ),
    );

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    if (this.pluginWhistle) {
      await pageDriver.useProxyServer(this.pluginWhistle.getLocalWhistleServer());
    }

    // 使用 mockstar 来做 mock server 用于构造假数据
    // if (queryDataMap || pageDriverOpts.queryDataMap) {
    //   await pageDriver.useMockstar(_.merge({}, queryDataMap, pageDriverOpts.queryDataMap));
    // }

    // 设置浏览器设备型号
    if (this.deviceInstance) {
      await pageDriver.setDeviceConfig(this.deviceInstance);
    }

    // 设置截屏
    await pageDriver.setScreenshotConfig(true);

    // 操作
    await this.handler(pageDriver);

    // 获取结果
    return pageDriver.evaluate(path.join(path.dirname(this.filename), './crawlers/get-page-info.js'));
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
