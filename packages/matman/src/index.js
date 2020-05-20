import MatmanConfig from './model/MatmanConfig';
import PageDriver from './model/PageDriver';
import MatmanResult from './model/MatmanResult';
import { isURLMatch } from './util/url';
import istanbulUtil from './util/istanbul';
import { MATMAN_CONFIG_FILE } from './config';
import { findMatmanConfig } from './util';

import { createPageDriver } from './business';
import Browser from './model/Browser';

/**
 * 为做兼容，参考 https://github.com/puppeteer/puppeteer/blob/v3.1.0/docs/api.md#puppeteerlaunchoptions
 */
function launch(browserOptions) {
    return new Browser(browserOptions);
}

module.exports = {
    MatmanConfig,
    PageDriver,
    MatmanResult,
    isURLMatch,
    istanbulUtil,
    createPageDriver,
    findMatmanConfig,
    MATMAN_CONFIG_FILE,
    launch
};