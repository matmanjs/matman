import Nightmare from 'nightmare';
import puppeteer from 'puppeteer';
import {BrowserSync, BrowserAsync} from './model/Browser';

/**
 * 创建异步 driver
 * @param master
 * @param opts
 */
function launch(
  master: any,
  opts: puppeteer.LaunchOptions | Nightmare.IConstructorOptions = {},
): BrowserAsync {
  return new BrowserAsync(new master(opts));
}

/**
 * 创建异步 driver
 * @param master
 * @param opts
 */
function launchSync(
  master: any,
  opts: puppeteer.LaunchOptions | Nightmare.IConstructorOptions = {},
): BrowserSync {
  return new BrowserSync(new master(opts));
}

export {launch, launchSync};
