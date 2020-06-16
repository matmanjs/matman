import {SyncBrowser, AsyncBrowser} from './model/Browser';

/**
 * 为做兼容，参考 https://github.com/puppeteer/puppeteer/blob/v3.1.0/docs/api.md#puppeteerlaunchoptions
 */
function launch(): SyncBrowser {
  return new SyncBrowser();
}

export {AsyncBrowser, launch};
