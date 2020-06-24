import fs from 'fs-extra';

export function getCallerPath(caseModuleFilePath: string): string {
  let err = new Error();

  try {
    // 在ios7上没有stack
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    err.stack.toString();
  } catch (ex) {
    err = ex;
  }

  /**
   * Error
   at getCallStackInfo (/Users/helinjiang/gitproject/matman/tmp/t1.js:17:15)
   at exports.sayHello (/Users/helinjiang/gitproject/matman/tmp/t1.js:12:17)
   at Object.<anonymous> (/Users/helinjiang/gitproject/matman/tmp/test1.js:11:1)
   at Module._compile (internal/modules/cjs/loader.js:799:30)
   at Object.Module._extensions..js (internal/modules/cjs/loader.js:810:10)
   at Module.load (internal/modules/cjs/loader.js:666:32)
   at tryModuleLoad (internal/modules/cjs/loader.js:606:12)
   at Function.Module._load (internal/modules/cjs/loader.js:598:3)
   at Function.Module.runMain (internal/modules/cjs/loader.js:862:12)
   at internal/main/run_main_module.js:21:11
   * @type {string | string}
   */
  const stackStr = (err && err.stack && err.stack.toString()) || '';
  // console.log(stackStr);

  /**
   * [ '(/Users/helinjiang/gitproject/matman/tmp/t1.js:17:15)',
   '(/Users/helinjiang/gitproject/matman/tmp/t1.js:12:17)',
   '(/Users/helinjiang/gitproject/matman/tmp/test1.js:11:1)' ]
   * @type {RegExpMatchArray}
   */
  let stackFileArr = stackStr.match(/\((.*)\)/gi) || [];
  // console.log(stackFileArr);

  // 过滤掉内部js模块的调用，因为没有意义
  stackFileArr = stackFileArr.filter(item => {
    return item.indexOf('(internal') !== 0;
  });

  /**
   * 文件调用栈列表
   * [ '/Users/helinjiang/gitproject/matman/tmp/t1.js',
   '/Users/helinjiang/gitproject/matman/tmp/test1.js' ]
   * @type {String[]}
   */
  const callStackFileArr = [];
  for (let i = 0; i < stackFileArr.length; i++) {
    const item = stackFileArr[i];
    const matmanResult = item.match(/\((.*\.js):.*\)/);

    // 如果没有匹配结果，则放弃
    if (!matmanResult || !matmanResult[1]) {
      continue;
    }

    const filePath = matmanResult[1];

    // 如果该文件路径不存在，则放弃
    if (!fs.existsSync(filePath)) {
      continue;
    }

    // 注意不重复添加
    if (callStackFileArr.indexOf(filePath) < 0) {
      callStackFileArr.push(filePath);
    }
  }
  // console.log(callStackFileArr);

  const index = callStackFileArr.indexOf(caseModuleFilePath);

  if (index < 0 || index >= callStackFileArr.length - 1) {
    return caseModuleFilePath;
  } else {
    return callStackFileArr[index + 1];
  }
}
