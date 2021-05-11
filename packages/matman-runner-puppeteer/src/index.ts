import puppeteer from 'puppeteer';
import { PuppeteerRunner } from './PuppeteerRunner';
import { getPuppeteerDefinedDevice } from './tools';

export const BrowserRunner = PuppeteerRunner;

export {
  puppeteer,
  getPuppeteerDefinedDevice,
};
