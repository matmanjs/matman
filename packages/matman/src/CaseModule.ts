import path from 'path';
import _ from 'lodash';

import { CacheData, IPageDriverOpts, PageDriver, getCallerPath, requireModule } from 'matman-core';

import { PluginAppMaterial } from 'matman-plugin-app';
import { getPluginMockstarMaterial, PluginMockstarMaterial } from 'matman-plugin-mockstar';
import { getLocalWhistleServer, PluginWhistle } from 'matman-plugin-whistle';
import { getPipelineJsonDataFromEnv, IPipelineJsonData } from 'matman-plugin-mocha';
import { DeviceMaterial, getDeviceMaterial } from 'matman-plugin-puppeteer';

import launchPuppeteer from './launch';

// interface ICaseModuleOpts {
//   filename: string;
//   userAction: (pageDriver: PageDriver) => PageDriver;
//   webCrawler: string;
//   materials?: {
//     pluginAppMaterial?: boolean;
//     pluginMockstarMaterial?: PluginMockstarMaterial;
//     deviceInstance?: DeviceMaterial;
//   };
//   pageDriverOpts?: IPageDriverOpts;
// }

interface ICaseModuleMaterials {
  userAction: (pageDriver: PageDriver) => PageDriver;
  webCrawler: string;

  mockstar: PluginMockstarMaterial | null;
  device: DeviceMaterial | null;
  app: PluginAppMaterial | null;
}
interface IMaterialOpts {
  userAction: (pageDriver: PageDriver) => PageDriver;
  webCrawler: string;

  mockstar?: PluginMockstarMaterial ;
  device?: DeviceMaterial ;
  app?: PluginAppMaterial ;
}

export default class CaseModule {
  public name: string;
  public filename: string;

  public pageDriverOpts: IPageDriverOpts;

  public pageDriver: PageDriver | null;

  public materials: ICaseModuleMaterials;

  public constructor(name: string, materialOpts: IMaterialOpts, pageDriverOpts?: IPageDriverOpts) {
    this.name = name;
    this.filename = getCallerPath();

    this.materials = {
      userAction: materialOpts.userAction,
      webCrawler: materialOpts.webCrawler,
      device: getDeviceMaterial(materialOpts.device),
      mockstar: getPluginMockstarMaterial(materialOpts.mockstar),
      app: null,
    };


    this.pageDriverOpts = this.getPageDriverOpts(pageDriverOpts);


    // 注意它比较特殊，配置项在 matman.config.js 中，所以需要在 run 方法执行时才设置
    // this.pluginAppMaterial = null;

    // 初始的时候 pageDriver 为 null，执行时再设置，避免浪费性能
    this.pageDriver = null;
  }

  // 执行
  public async run(pageDriverOpts?: IPageDriverOpts) {
    const pipelineJsonData = getPipelineJsonDataFromEnv();

    // 设置 appMaterial
    this.setPluginAppMaterial(pipelineJsonData);

    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launchPuppeteer(this.getPageDriverOpts(pageDriverOpts));
    this.pageDriver = pageDriver;

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    if (pipelineJsonData?.pluginWhistle) {
      // 获得 whistle 服务地址，例如 127.0.0.1:8899
      const localWhistleServer = await getLocalWhistleServer(pipelineJsonData.pluginWhistle.cacheData?.data?.port, true);

      // 设置走 whistle 代理
      await pageDriver.useProxyServer(localWhistleServer);

      // 设置代理规则
      await this.setWhistleRuleBeforeRun(pipelineJsonData);
    }

    // 设置浏览器设备型号
    if (this.materials.device) {
      await pageDriver.setDeviceConfig(this.materials.device);
    }

    // 设置截屏
    await pageDriver.setScreenshotConfig(true);

    // 操作
    await this.materials.userAction(pageDriver);

    // 获取结果
    return pageDriver.evaluate(path.join(path.dirname(this.filename), this.materials.webCrawler));
  }

  private getPageDriverOpts(pageDriverOpts?: IPageDriverOpts): IPageDriverOpts {
    return _.merge({}, this.pageDriverOpts, pageDriverOpts, {
      caseModuleFilePath: this.filename,
    }) as IPageDriverOpts;
  }

  private setPluginAppMaterial(pipelineJsonData: IPipelineJsonData | null) {
    if (!pipelineJsonData) {
      return;
    }

    this.materials.app = requireModule(pipelineJsonData.extraInfo.pipelineMaterialFullPath).pluginApp.activatedMaterial;
  }

  private async setWhistleRuleBeforeRun(pipelineJsonData: IPipelineJsonData | null): Promise<void> {
    if (!pipelineJsonData || !pipelineJsonData.pluginWhistle) {
      return;
    }

    // Plugin App 中的代理配置
    const whistleRuleFromApp = this.materials.app?.getWhistleRule(
      new CacheData(pipelineJsonData.pluginApp?.cacheData?.data),
    );

    // Plugin Mockstar 中的代理配置
    const whistleRuleFromMockstar = this.materials.mockstar?.getWhistleRule(
      new CacheData(pipelineJsonData.pluginMockstar?.cacheData?.data),
    );

    // 设置代理
    if (whistleRuleFromApp || whistleRuleFromMockstar) {
      // 这里是近似处理
      const pluginWhistle = new PluginWhistle(pipelineJsonData.pluginWhistle);

      const cachePort = pipelineJsonData.pluginWhistle.cacheData?.port;
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
