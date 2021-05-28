import { IMaterialBase } from 'matman-core';


export default class MaterialBase implements IMaterialBase {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }
}
