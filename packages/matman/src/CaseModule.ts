import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { WhistleRule } from 'whistle-sdk';

import { IPageDriverOpts, PageDriver, Pipeline, setPipelineJsonDataToEnv, getPipelineFromEnv } from 'matman-core';

import { PluginApp, PluginAppMaterial } from 'matman-plugin-app';
import { PluginMockstar, getPluginMockstarMaterial, PluginMockstarMaterial } from 'matman-plugin-mockstar';
import { getLocalWhistleServer, PluginWhistle } from 'matman-plugin-whistle';
import { DeviceMaterial, getDeviceMaterial } from 'matman-plugin-puppeteer';

import launchPuppeteer from './launch';

interface ICaseModuleOpts {
  materials: ICaseModuleMaterialsOpts;
  pageDriverOpts?: IPageDriverOpts;
}

interface ICaseModuleMaterialsOpts {
  userAction: (pageDriver: PageDriver) => PageDriver;
  webCrawler: string;

  mockstar?: PluginMockstarMaterial;
  device?: DeviceMaterial;
  app?: PluginAppMaterial;
}


interface ICaseModuleMaterials {
  userAction: (pageDriver: PageDriver) => PageDriver;
  webCrawler: string;

  mockstar: PluginMockstarMaterial | null;
  device: DeviceMaterial | null;
  app: PluginAppMaterial | null;
}
interface IDebugCaseModuleOpts {
  doNotSetup?: boolean;
  showResultInConsole?: boolean;
}

export default class CaseModule {
  public name: string;
  public filename: string;

  public materials: ICaseModuleMaterials;
  public pageDriverOpts: IPageDriverOpts;

  public pageDriver: PageDriver | null;

  public constructor(filename: string, opts: ICaseModuleOpts, name?: string) {
    this.filename = filename;

    // 必须保证 this.filename 为文件，否则后续逻辑可能会出错
    if (!fs.statSync(this.filename).isFile()) {
      throw new Error(`${this.filename} is not file!`);
    }

    this.name = name || path.basename(this.filename);

    this.materials = {
      userAction: opts.materials.userAction,
      webCrawler: opts.materials.webCrawler,
      device: getDeviceMaterial(opts.materials.device),
      mockstar: getPluginMockstarMaterial(opts.materials.mockstar),
      app: null,
    };


    this.pageDriverOpts = this.getPageDriverOpts(opts.pageDriverOpts);


    // 注意它比较特殊，配置项在 matman.config.js 中，所以需要在 run 方法执行时才设置
    // this.pluginAppMaterial = null;

    // 初始的时候 pageDriver 为 null，执行时再设置，避免浪费性能
    this.pageDriver = null;
  }

  // 执行
  public async run(pageDriverOpts?: IPageDriverOpts) {
    // 获取 pipeline，
    const pipeline = getPipelineFromEnv() as Pipeline;

    if (!pipeline) {
      return;
    }

    // 设置 appMaterial
    if (pipeline.opts?.pluginAppCurMaterial) {
      this.materials.app = pipeline.opts?.pluginAppCurMaterial as PluginAppMaterial;
    }


    // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
    const pageDriver = await launchPuppeteer(this.getPageDriverOpts(pageDriverOpts));
    this.pageDriver = pageDriver;

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    const pluginWhistleInConfig = pipeline.matmanConfig.getPlugin('PluginWhistle');
    if (pluginWhistleInConfig) {
      const pluginWhistle = pluginWhistleInConfig as PluginWhistle;

      let whistlePort;
      const portInCache = pluginWhistle.cacheData.getCacheItem('port');
      if (portInCache) {
        whistlePort = parseInt(`${portInCache}`, 10);
      }

      // 获得 whistle 服务地址，例如 127.0.0.1:8899
      const proxyServer = await getLocalWhistleServer(whistlePort, true);

      // 设置走 whistle 代理
      await pageDriver.useProxyServer(proxyServer);

      // 设置代理规则
      await this.setWhistleRuleBeforeRun(pipeline, pluginWhistle);
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

  // 执行
  public async debug(pipeline: Pipeline, pageDriverOpts?: IPageDriverOpts, debugOpts?: IDebugCaseModuleOpts) {
    if (!debugOpts?.doNotSetup) {
      await pipeline.setup();
    }

    // 一定要设置变量
    setPipelineJsonDataToEnv(pipeline);

    // 执行
    const result = await this.run(_.merge({
      show: true,
      doNotCloseBrowser: false,
    }, pageDriverOpts));

    console.log('\n===========================');
    console.log('');
    console.log('The run result is in the follow file: ');
    console.log('');
    console.log(this.pageDriver?.matmanResultConfig?.path);
    console.log('');
    console.log('===========================\n');

    if (debugOpts?.showResultInConsole) {
      console.log(JSON.stringify(result, null, 2));
    }

    // TODO 关闭和清理

    return result;
  }

  private getPageDriverOpts(pageDriverOpts?: IPageDriverOpts): IPageDriverOpts {
    return _.merge({}, this.pageDriverOpts, pageDriverOpts, {
      caseModuleFilePath: this.filename,
    }) as IPageDriverOpts;
  }

  private async setWhistleRuleBeforeRun(pipeline: Pipeline, pluginWhistle: PluginWhistle): Promise<void> {
    // Plugin App 中的代理配置
    const pluginApp = pipeline.matmanConfig.getPlugin('PluginApp');
    let whistleRuleFromApp: (WhistleRule | null) = null;
    if (pluginApp && this.materials.app) {
      whistleRuleFromApp = this.materials.app.getWhistleRule((pluginApp as PluginApp).cacheData);
    }

    // Plugin Mockstar 中的代理配置
    const pluginMockstar = pipeline.matmanConfig.getPlugin('PluginMockstar');
    let whistleRuleFromMockstar: (WhistleRule | null) = null;
    if (pluginMockstar && this.materials.mockstar) {
      whistleRuleFromMockstar = this.materials.mockstar.getWhistleRule((pluginMockstar as PluginMockstar).cacheData);
    }

    // 设置代理
    if (whistleRuleFromApp || whistleRuleFromMockstar) {
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
