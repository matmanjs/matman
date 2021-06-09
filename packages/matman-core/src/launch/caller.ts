import fse from 'fs-extra';

/**
 * 获取哪个文件在调用本方法
 *
 * @param {String} [referFile] 从调用栈中找到该文件的调用者，而不再是本方法的调用者
 * @return {String}
 */
export function getCallerPath(referFile?: string): string {
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
  const stackStr = (err?.stack?.toString()) || '';

  /**
   * [ '(/Users/helinjiang/gitproject/matman/tmp/t1.js:17:15)',
   '(/Users/helinjiang/gitproject/matman/tmp/t1.js:12:17)',
   '(/Users/helinjiang/gitproject/matman/tmp/test1.js:11:1)' ]
   * @type {RegExpMatchArray}
   */
  let stackFileArr = stackStr.match(/\((.*)\)/gi) || [];

  let isFoundUserModule = false;

  // 过滤一些不符合要求的模块
  stackFileArr = stackFileArr.filter((item) => {
    // 是否为内部 js 模块的调用，例如：
    // (internal/modules/cjs/loader.js:598:3)
    const isInternalModules = item.indexOf('(internal') === 0;
    if (isInternalModules) {
      return false;
    }

    // 是否为 matman 组件内部自己模块间调用
    const isMatmanSelf = checkIfMatmanSelf(item);
    if (isMatmanSelf) {
      return false;
    }

    // 是否为 /node_modules/ 模块的调用，例如：
    // (/Users/helinjiang/gitprojects/matman/packages/matman/node_modules/mocha/lib/runner.js:448:14)
    const isNodeModules = item.indexOf('/node_modules/') > -1;
    if (!isNodeModules) {
      isFoundUserModule = true;
      return true;
    }
    return !isFoundUserModule;
  });

  /**
   * 文件调用栈列表
   * [ '/Users/helinjiang/gitproject/matman/tmp/t1.js',
   '/Users/helinjiang/gitproject/matman/tmp/test1.js' ]
   * @type {String[]}
   */
  const callStackFileArr = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < stackFileArr.length; i++) {
    const item = stackFileArr[i];
    const matmanResult = item.match(/\((.*\.[j|t]s):.*\)/);

    // 如果没有匹配结果，则放弃
    if (!matmanResult || !matmanResult[1]) {
      continue;
    }

    const filePath = matmanResult[1];

    // 如果该文件路径不存在，则放弃
    if (!fse.existsSync(filePath)) {
      continue;
    }

    // 注意不重复添加
    if (callStackFileArr.indexOf(filePath) < 0) {
      callStackFileArr.push(filePath);
    }
  }

  if (referFile && fse.existsSync(referFile)) {
    const index = callStackFileArr.indexOf(referFile);
    const callerFullPath = callStackFileArr[index + 1];

    // 只有该调用模块路径存在时，才返回
    if (callerFullPath && fse.existsSync(callerFullPath)) {
      return callerFullPath;
    }
  }

  return callStackFileArr[0];
}

export function checkIfMatmanSelf(fullPath: string): boolean {
  if (!fullPath) {
    return false;
  }

  // 校验的正则表达式，例如下面这些，都是算 matman 内部库
  // /root/path/matman/packages/matman-core/lib/CaseModule.js
  // /root/path/matman/packages/matman-core/src/CaseModule.js
  // /root/path/node_modules/matman-core/lib/CaseModule.js
  const reg = /(packages|node_modules)\/(matman.*)\/(lib|src)/i;

  return reg.test(fullPath);
}
