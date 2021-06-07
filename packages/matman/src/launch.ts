import { IMatmanConfigOpts, IPageDriverOpts, launch, PageDriver } from 'matman-core';
import { BrowserRunner } from 'matman-runner-puppeteer';

/**
 * 获得基于 Puppeteer 的 PageDriver
 *
 * @param {IPageDriverOpts} pageDriverOpts
 * @param {IMatmanConfigOpts} matmanConfigOpts
 * @return {IPageDriver}
 */
export default async function launchPuppeteer(
  pageDriverOpts?: IPageDriverOpts,
  matmanConfigOpts?: IMatmanConfigOpts,
): Promise<PageDriver> {
  return launch(new BrowserRunner(), pageDriverOpts, matmanConfigOpts);
}
