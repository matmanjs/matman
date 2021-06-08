import { IMaterialBase, getCallerPath } from 'matman-core';


export default class MaterialBase implements IMaterialBase {
  public name: string;
  public filename: string;

  public constructor(name: string, implModuleFileFullPath: string) {
    this.name = name;
    this.filename = getCallerPath(implModuleFileFullPath);
  }
}
