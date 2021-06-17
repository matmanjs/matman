export interface IMaterialBase {
  name: string;
  filename: string;
  materialFileItem?: IMaterialFileItem;
}


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
