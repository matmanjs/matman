import fs from 'fs';
import PageDriver from './model/PageDriver';
import { findMatmanConfig } from './util';
import { MATMAN_CONFIG_FILE } from './config';

/**
 * 创建 pageDriver
 *
 * @param {String} caseFilePath 当前 case 的文件名
 * @param {Object} [opts] 额外参数，传递给 MatmanConfig 和 PageDriver 使用
 * @return {PageDriver}
 * @author helinjiang
 */
export function createPageDriver(caseFilePath, opts) {
    // 自动计算是哪个文件在调用 case 脚本，然后以调用者的文件名来做标记
    // 由于调用者脚本本身已经按目录存储，且同一个目录中不同调用者脚本文件名肯定不一样
    // 这样就能够区分标记了
    if (!opts.tag) {
        const caseCallerPath = getCaseCallerPath(caseFilePath);

        // 注意如果找到的调用文件就是 caseFilePath 本身，则无需设置 tag ，否则就会造成生成的文件名重叠
        if (caseCallerPath && (caseCallerPath !== caseFilePath)) {
            opts.tag = caseCallerPath;
        }
        // console.log('==caseFilePath==', caseFilePath);
        // console.log('==caseCallerPath==', caseCallerPath);
        // console.log('==opts.tag==', opts.tag);
    }

    const matmanConfig = findMatmanConfig(caseFilePath, opts);

    if (!matmanConfig) {
        throw new Error(`Could not find ${MATMAN_CONFIG_FILE}!`);
    }

    return new PageDriver(matmanConfig, caseFilePath, opts);
}

/**
 * 获得调用 case 的文件路径
 *
 * @param {String} caseFilePath 当前 case 的文件名
 * @return {String}
 * @author helinjiang
 */
function getCaseCallerPath(caseFilePath) {
    let err = new Error();

    try {
        // 在ios7上没有stack
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
    const stackStr = err && err.stack && err.stack.toString() || '';
    // console.log(stackStr);

    /**
     * [ '(/Users/helinjiang/gitproject/matman/tmp/t1.js:17:15)',
     '(/Users/helinjiang/gitproject/matman/tmp/t1.js:12:17)',
     '(/Users/helinjiang/gitproject/matman/tmp/test1.js:11:1)' ]
     * @type {RegExpMatchArray}
     */
    const stackFileArr = stackStr.match(/\(\/(.*)\)/gi);
    // console.log(stackFileArr);

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

    const index = callStackFileArr.indexOf(caseFilePath);

    if (index < 0 || (index >= callStackFileArr.length - 1)) {
        return caseFilePath;
    } else {
        return callStackFileArr[index + 1];
    }
}