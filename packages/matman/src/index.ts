import PageDriver from './model/PageDriver';
import NightmareMaster from './model/NightmareMaster';
import MatmanResult from './model/MatmanResult';
import {isURLMatch} from './util/url';

import {createPageDriver} from './business';
import Browser from './model/Browser';

/**
 * 为做兼容，参考 https://github.com/puppeteer/puppeteer/blob/v3.1.0/docs/api.md#puppeteerlaunchoptions
 */
function launch(browserOptions: any): Browser {
  return new Browser(browserOptions);
}

export {PageDriver, MatmanResult, isURLMatch, createPageDriver, launch, NightmareMaster};
