import path from 'path';
import _ from 'lodash';

import { launch, PageDriverAsync, IPageDriverOpts } from 'matman';
import { CacheData } from 'matman-core';

import { PluginAppInstance, getPluginAppInstance } from 'matman-plugin-app';
import { PluginMockstarInstance, getPluginMockstarInstance } from 'matman-plugin-mockstar';
import { PluginWhistle, getLocalWhistleServer } from 'matman-plugin-whistle';
import { BrowserRunner } from 'matman-runner-puppeteer';
import DeviceInstance, { getDeviceInstance } from './DeviceInstance';

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


  private readonly deviceInstance: DeviceInstance | null;
  private pluginAppInstance: PluginAppInstance | null;
  private pluginMockstarInstance: PluginMockstarInstance | null;

  private readonly pluginAppInstanceFromOpts?: boolean;

  public constructor(opts: ICaseModuleOpts) {
    this.filename = opts.filename;
    this.handler = opts.handler;
    this.crawler = opts.crawler;
    this.pluginAppInstanceFromOpts = opts.dependencies?.pluginAppInstance;

    this.deviceInstance = getDeviceInstance(opts.dependencies?.deviceInstance);

    this.pluginMockstarInstance = getPluginMockstarInstance(opts.dependencies?.pluginMockstarInstance);
    this.pluginAppInstance = null;
  }

  // public setPluginWhistle(pluginWhistle: PluginWhistle) {
  //   this.pluginWhistle = pluginWhistle;
  // }

  // public setPluginApp(pluginApp: PluginApp) {
  //   this.pluginApp = pluginApp;

  //   this.pluginAppInstance = this.pluginApp.getActiveInstance();
  // }

  // 执行
  public async run(pageDriverOpts?: IPageDriverOpts) {
    console.log('==============run=============', process.env.MATMAN_TMP_PLUGIN_JSON_DATA);
    const pluginJsonData = JSON.parse(process.env.MATMAN_TMP_PLUGIN_JSON_DATA || '{}');
    if (this.pluginAppInstanceFromOpts) {
      this.pluginAppInstance = getPluginAppInstance(
        pluginJsonData.pluginApp?.definedInstanceDir,
        pluginJsonData.pluginApp?.activeInstance,
      );
    }

    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launch(
      new BrowserRunner(),
      _.merge({}, pageDriverOpts, { caseModuleFilePath: this.filename }) as IPageDriverOpts,
    );

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    if (pluginJsonData.pluginWhistle) {
      // 设置走 whistle 代理
      await pageDriver.useProxyServer(getLocalWhistleServer(pluginJsonData.pluginWhistle.cacheData?.data?.port));

      // 设置代理规则
      await this.setWhistleRuleBeforeRun(pluginJsonData);
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


  private async setWhistleRuleBeforeRun(pluginJsonData: any): Promise<void> {
    if (!pluginJsonData || !pluginJsonData.pluginWhistle) {
      return;
    }

    const whistleRuleFromApp = this.pluginAppInstance?.getWhistleRule(
      new CacheData(pluginJsonData.pluginApp?.cacheData)
    );

    const whistleRuleFromMockstar = this.pluginMockstarInstance?.getWhistleRule(
      new CacheData(pluginJsonData.pluginMockstar?.cacheData)
    );

    if (whistleRuleFromApp || whistleRuleFromMockstar) {
      const pluginWhistle = new PluginWhistle(pluginJsonData.pluginWhistle);

      const cachePort = pluginJsonData.pluginWhistle.cacheData?.port;
      if (cachePort) {
        pluginWhistle.cacheData.setCacheItem('port', cachePort);
      }

      // 设置规则
      await pluginWhistle?.setRules({
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
