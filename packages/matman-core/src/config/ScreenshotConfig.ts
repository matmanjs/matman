import path from 'path';

import MatmanConfig from './MatmanConfig';
import { getAbsolutePath } from '../util';
import { getFolderNameFromPath, getNewFilePathWithTag, getSaveDirFromPath } from '../util/path';

/**
 * 截图区域的配置信息
 */
interface IClipOpts {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 是否启用截图, 或者截图保存的文件名路径(如果想对路径, 则相对于basePath 而言), 或者截图配置
 */
export type IScreenOpts =
  | string
  | boolean
  | { tag?: string; path: string; fullPage?: boolean; clip?: IClipOpts };

export default class ScreenshotConfig {
  public tag: string | undefined;
  public path: string;
  public clip: IClipOpts | undefined;
  public fullPage = true;

  public constructor(
    matmanConfig: MatmanConfig,
    opts: IScreenOpts,
    caseModuleFilePath: string,
    tag?: string,
  ) {
    this.tag = tag;

    // https://github.com/segmentio/nightmare#screenshotpath-clip
    if (opts && typeof opts === 'object') {
      // 对象中传递的标记优先
      if (opts.tag) {
        this.tag = opts.tag;
      }

      // 如果传递了对象
      if (opts.path) {
        this.path = this.getScreenshotFullPath(opts.path, matmanConfig.screenshotPath);
      } else {
        // 其他情况自动生成截图保存路径
        const relativeSavePath = getSaveDirFromPath(path.relative(matmanConfig.caseModulesPath, caseModuleFilePath));

        const saveFileName = `${getFolderNameFromPath(path.basename(caseModuleFilePath))}.png`;

        this.path = this.getScreenshotFullPath(
          path.join(relativeSavePath, saveFileName),
          matmanConfig.screenshotPath,
        );
      }

      // 截图的区域，例如 { x: 0, y: 0, width: 0, height: 0 }
      // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#winsetthumbnailclipregion-windows
      this.clip = opts.clip;
      this.fullPage = (opts.fullPage !== false);
    } else if (typeof opts === 'string') {
      // 如果 opts 为字符串，则代表设置的是截图保存路径
      this.path = this.getScreenshotFullPath(opts, matmanConfig.screenshotPath);
    } else {
      // 其他情况自动生成截图保存路径
      const relativeSavePath = getSaveDirFromPath(path.relative(matmanConfig.caseModulesPath, caseModuleFilePath));

      const saveFileName = `${getFolderNameFromPath(path.basename(caseModuleFilePath))}.png`;

      this.path = this.getScreenshotFullPath(
        path.join(relativeSavePath, saveFileName),
        matmanConfig.screenshotPath,
      );
    }
  }

  /**
   * 根据一个标志获得新的路径
   *
   * @param {String | Number} id 标志
   * @return {string} 新的路径
   */
  public getPathWithId(id: string | number): string {
    return this.path.replace(/(.*)\.(.*)/, (match, p1, p2) => [p1, `${id}.${p2}`].join('_'));
  }

  /**
   * 获得完整的截图文件保存路径
   *
   * @param targetPath 原始路径
   * @param basePath 根目录
   * @return {String} 新的路径
   * @private
   */
  private getScreenshotFullPath(targetPath: string, basePath: string): string {
    return getNewFilePathWithTag(getAbsolutePath(targetPath, basePath), this.tag);
  }
}
