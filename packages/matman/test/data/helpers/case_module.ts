import {getCallerPath} from '../../../src/util/caller';

export default function sayHello(referFile?: string): string {
  // 假设这个是 case_module 文件
  return getCallerPath(referFile);
}
