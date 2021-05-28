import path from 'path';
import _ from 'lodash';

import { launch, PageDriverAsync, IPageDriverOpts } from 'matman';
import { CacheData } from 'matman-core';

import { PluginAppMaterial, getPluginAppMaterial } from 'matman-plugin-app';
import { PluginMockstarMaterial, getPluginMockstarMaterial } from 'matman-plugin-mockstar';
import { PluginWhistle, getLocalWhistleServer } from 'matman-plugin-whistle';
import { getE2ERunnerJsonDataFromEnv, IE2ERunnerJsonData } from 'matman-plugin-test';

import { BrowserRunner } from 'matman-runner-puppeteer';
import DeviceMaterial, { getDeviceMaterial } from './DeviceMaterial';

interface ICaseModuleOpts {
  filename: string;
  userAction: (pageDriver: PageDriverAsync) => PageDriverAsync;
  webCrawler: string;
  materials?: {
    pluginAppMaterial?: boolean;
    pluginMockstarMaterial?: PluginMockstarMaterial;
    deviceInstance?: DeviceMaterial;
  };
  pageDriverOpts?: IPageDriverOpts;
}

export default class CaseModule {
  public name: string;
  public filename: string;
  public userAction: (pageDriver: PageDriverAsync) => PageDriverAsync;
  public webCrawler: string;
  public pageDriverOpts: IPageDriverOpts;

  public pageDriver: PageDriverAsync | null;

  private readonly deviceInstance: DeviceMaterial | null;
  private pluginAppMaterial: PluginAppMaterial | null;
  private pluginMockstarMaterial: PluginMockstarMaterial | null;

  private readonly pluginAppMaterialFromOpts?: boolean;

  public constructor(name: string, opts: ICaseModuleOpts) {
    this.name = name;
    this.filename = opts.filename;
    this.userAction = opts.userAction;
    this.webCrawler = opts.webCrawler;
    this.pageDriverOpts = this.getPageDriverOpts(opts.pageDriverOpts);
    this.pluginAppMaterialFromOpts = opts.materials?.pluginAppMaterial;

    this.deviceInstance = getDeviceMaterial(opts.materials?.deviceInstance);

    this.pluginMockstarMaterial = getPluginMockstarMaterial(opts.materials?.pluginMockstarMaterial);

    // 注意它比较特殊，配置项在 matman.config.js 中，所以需要在 run 方法执行时才设置
    this.pluginAppMaterial = null;

    // 初始的时候 pageDriver 为 null，执行时再设置，避免浪费性能
    this.pageDriver = null;
  }

  // 执行
  public async run(pageDriverOpts?: IPageDriverOpts) {
    const e2eRunnerJsonData = getE2ERunnerJsonDataFromEnv();

    // 设置 appMaterial
    this.setPluginAppMaterial(e2eRunnerJsonData);

    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launch(new BrowserRunner(), this.getPageDriverOpts(pageDriverOpts));

    this.pageDriver = pageDriver;

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    if (e2eRunnerJsonData?.pluginWhistle) {
      // 设置走 whistle 代理
      await pageDriver.useProxyServer(getLocalWhistleServer(e2eRunnerJsonData.pluginWhistle.cacheData?.data?.port));

      // 设置代理规则
      await this.setWhistleRuleBeforeRun(e2eRunnerJsonData);
    }

    // 设置浏览器设备型号
    if (this.deviceInstance) {
      await pageDriver.setDeviceConfig(this.deviceInstance);
    }

    // 设置截屏
    await pageDriver.setScreenshotConfig(true);

    // 操作
    await this.userAction(pageDriver);

    // 获取结果
    return pageDriver.evaluate(path.join(path.dirname(this.filename), this.webCrawler));
  }

  private getPageDriverOpts(pageDriverOpts?: IPageDriverOpts): IPageDriverOpts {
    return _.merge({}, this.pageDriverOpts, pageDriverOpts, {
      caseModuleFilePath: this.filename,
    }) as IPageDriverOpts;
  }

  private setPluginAppMaterial(e2eRunnerJsonData: IE2ERunnerJsonData | null) {
    if (!this.pluginAppMaterialFromOpts || !e2eRunnerJsonData) {
      return;
    }

    this.pluginAppMaterial = getPluginAppMaterial(path.join(
      e2eRunnerJsonData.pluginApp?.materialDir,
      e2eRunnerJsonData.pluginApp?.activated,
    ));
  }

  private async setWhistleRuleBeforeRun(e2eRunnerJsonData: IE2ERunnerJsonData | null): Promise<void> {
    if (!e2eRunnerJsonData || !e2eRunnerJsonData.pluginWhistle) {
      return;
    }

    // Plugin App 中的代理配置
    const whistleRuleFromApp = this.pluginAppMaterial?.getWhistleRule(
      new CacheData(e2eRunnerJsonData.pluginApp?.cacheData?.data),
    );

    // Plugin Mockstar 中的代理配置
    const whistleRuleFromMockstar = this.pluginMockstarMaterial?.getWhistleRule(
      new CacheData(e2eRunnerJsonData.pluginMockstar?.cacheData?.data),
    );

    // 设置代理
    if (whistleRuleFromApp || whistleRuleFromMockstar) {
      // 这里是近似处理
      const pluginWhistle = new PluginWhistle(e2eRunnerJsonData.pluginWhistle);

      const cachePort = e2eRunnerJsonData.pluginWhistle.cacheData?.port;
      if (cachePort) {
        pluginWhistle.cacheData.setCacheItem('port', cachePort);
      }

      // 为 Plugin Whistle 设置代理规则
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
