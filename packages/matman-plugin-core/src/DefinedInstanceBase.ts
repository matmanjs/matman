import { IDefinedInstanceBase } from 'matman-core';


export default class DefinedInstanceBase implements IDefinedInstanceBase {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }
}
