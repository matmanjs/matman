import path from 'path';
import _ from 'lodash';

import { launch, PageDriverAsync, IPageDriverOpts } from 'matman';

import { PluginWhistle } from 'matman-plugin-whistle';
import { PluginApp, PluginAppInstance } from 'matman-plugin-app';
import {
  PluginMockstar,
  PluginMockstarInstance,
  getPluginMockstarInstance,
} from 'matman-plugin-mockstar';
import { BrowserRunner } from 'matman-runner-puppeteer';
import DeviceInstance, { getDeviceInstance } from './DeviceInstance';
import { E2ERunner } from 'matman-core';

const globalAny: any = global;

interface ICaseModuleOpts {
  filename: string;
  handler: (pageDriver: PageDriverAsync) => PageDriverAsync;
  crawler: string;
  dependencies?: {
    pluginAppInstance?: boolean;
    pluginMockstarInstance?: PluginMockstarInstance;
    deviceInstance?: DeviceInstance;
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
  private pluginAppInstance: PluginAppInstance | null;
  private pluginMockstarInstance: PluginMockstarInstance | null;

  public constructor(opts: ICaseModuleOpts) {
    this.filename = opts.filename;
    this.handler = opts.handler;
    this.crawler = opts.crawler;

    this.deviceInstance = getDeviceInstance(opts.dependencies?.deviceInstance);

    this.pluginMockstarInstance = getPluginMockstarInstance(opts.dependencies?.pluginMockstarInstance);
    this.pluginAppInstance = null;
  }

  public setPluginWhistle(pluginWhistle: PluginWhistle) {
    this.pluginWhistle = pluginWhistle;
  }

  public setPluginApp(pluginApp: PluginApp) {
    this.pluginApp = pluginApp;

    this.pluginAppInstance = this.pluginApp.getActiveInstance();
  }

  public setPluginMockstar(pluginMockstar: PluginMockstar) {
    this.pluginMockstar = pluginMockstar;
  }

  // 执行
  public async run(pageDriverOpts?: IPageDriverOpts) {
    this.setRequiredPlugins() ;

    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launch(
      new BrowserRunner(),
      _.merge({}, pageDriverOpts, { caseModuleFilePath: this.filename }) as IPageDriverOpts,
    );

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    if (this.pluginWhistle) {
      // 设置走 whistle 代理
      await pageDriver.useProxyServer(this.pluginWhistle.getLocalWhistleServer());

      // 设置代理规则
      await this.setWhistleRuleBeforeRun();
    }

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


  private setRequiredPlugins() {
    // 该参数为全局参数
    if (!globalAny.matmanE2ERunner) {
      return;
    }

    const e2eRunner = globalAny.matmanE2ERunner as E2ERunner;

    const pluginApp = e2eRunner.matmanConfig.getPlugin('app') as PluginApp;
    if (pluginApp) {
      this.setPluginApp(pluginApp);
    }

    const pluginWhistle = e2eRunner.matmanConfig.getPlugin('whistle') as PluginWhistle;
    if (pluginWhistle) {
      this.setPluginWhistle(pluginWhistle);
    }

    const pluginMockstar = e2eRunner.matmanConfig.getPlugin('mockstar') as PluginMockstar;
    if (pluginMockstar) {
      this.setPluginMockstar(pluginMockstar);
    }
  }


  private async setWhistleRuleBeforeRun(): Promise<void> {
    if (!this.pluginWhistle) {
      return;
    }

    const whistleRuleFromApp = this.pluginAppInstance?.getWhistleRule(this.pluginApp?.cacheData);
    const whistleRuleFromMockstar = this.pluginMockstarInstance?.getWhistleRule(
      this.pluginMockstar?.cacheData,
    );

    if (whistleRuleFromApp || whistleRuleFromMockstar) {
      await this.pluginWhistle?.setRules({
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
