import { PageDriver } from 'matman-core';
import { MaterialBase, requireModule } from 'matman-plugin-core';


type IUserActionCall = (pageDriver: PageDriver) => PageDriver;


export default class UserActionMaterial extends MaterialBase {
  public runCall: IUserActionCall;

  public constructor(filename: string, runCall: IUserActionCall, name?: string) {
    super(filename, name);

    this.runCall = runCall;
  }
}

export function getUserActionMaterial(materialFullPath: string): UserActionMaterial | null {
  try {
    const requiredResult = requireModule(materialFullPath);
    const result = (typeof requiredResult === 'function') ? requiredResult() : requiredResult;

    return result as UserActionMaterial;
  } catch (err) {
    console.error('getUserActionMaterial catch err', materialFullPath, err);

    return null;
  }
}

