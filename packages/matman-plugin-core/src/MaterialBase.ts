import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import { IMaterialBase } from 'matman-core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fsHandler from 'fs-handler';

import { IFSHandlerItem } from './utils';

export interface IMaterialFileItem {
  /**
   * 完整路径
   */
  fullPath: string;

  /**
   * 所属分组名称，例如 src/materials
   */
  groupName: string;

  /**
   * 物料相对于 groupName 的文件夹名字，例如 puppeteer/device
   */
  folderName: string;

  /**
   * 文件名字，例如 prod.js
   */
  fileName: string;
}

export default class MaterialBase implements IMaterialBase {
  public name: string;
  public filename: string;

  public constructor(filename: string, name?: string) {
    this.filename = filename;

    // 必须保证 this.filename 为文件，否则后续逻辑可能会出错
    if (!fs.statSync(this.filename).isFile()) {
      throw new Error(`${this.filename} is not file!`);
    }

    this.name = name || path.basename(this.filename);
  }
}


export function findAllMaterialFileItems(matmanAppPath: string, materialDir: string): IMaterialFileItem[] {
  // 相对于 matmanAppPath 的目录，例如  src/materials/app
  const pureRelativePath = path.relative(matmanAppPath, materialDir);

  const result: IMaterialFileItem[] = [];

  fsHandler.search.getAll(matmanAppPath, { globs: [`${pureRelativePath}/**`] })
    .forEach((item: IFSHandlerItem) => {
      // 目录无需处理
      if (item.isDirectory()) {
      // console.log(item.relativePath, '目录无需处理\n');
        return;
      }

      const relativePathSplitArr = item.relativePath.split('/');

      // 需要以 materials 来分组，数组分隔序号
      const splitIndex = _.indexOf(relativePathSplitArr, 'materials') + 1;

      // 获取：分组名称
      const groupName = relativePathSplitArr.slice(0, splitIndex).join('/');

      // 获取：物料文件夹名和文件名
      const materialInfoArr = relativePathSplitArr.slice(splitIndex);
      const fileName = materialInfoArr.pop() || '';
      const folderName = materialInfoArr.join('/');

      result.push({
        fullPath: path.join(item.basePath, item.relativePath),
        groupName,
        folderName,
        fileName,
      });
    });

  return result;
}
