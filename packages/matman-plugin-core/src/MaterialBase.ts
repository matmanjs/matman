import fs from 'fs';
import path from 'path';
import { IMaterialBase } from 'matman-core';

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
