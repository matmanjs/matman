import {BrowserMasterSync, BrowserMasterAsync} from './model/BrowserMaster';

/**
 * 初始化异步的 BrowserMaster 对象
 *
 * @param {Object} runner 运行器，目前支持 puppeteer 和 nightmare 两种
 */
function launch(runner: any): BrowserMasterAsync {
  return new BrowserMasterAsync(runner);
}

/**
 * 初始化同步的 BrowserMaster 对象
 *
 * @param {Object} runner 运行器，目前支持 puppeteer 和 nightmare 两种
 */
function launchSync(runner: any): BrowserMasterSync {
  return new BrowserMasterSync(runner);
}

export {launch, launchSync};
