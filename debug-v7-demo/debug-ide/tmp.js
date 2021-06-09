// const str1 = '/Users/helinjiang/gitprojects/matman/packages/matman-core/lib/CaseModule.js'
// const str2 = '/Users/helinjiang/gitprojects/matman/packages/matman/lib/CaseModule.js'
// const str3 = '/Users/helinjiang/gitprojects/matman/packages/matman-core/src/CaseModule.js'
// const str4 = '/Users/helinjiang/gitprojects/matman/packages/matman/src/CaseModule.js'
// const str42 = '/Users/helinjiang/gitprojects/matman/dddd/matman/src/CaseModule.js'
// const str43 =  '/Users/helinjiang/gitprojects/matman/packages/matman-plugin-mockstar/lib/PluginMockstarMaterial.js'
//
// const str11 = '/Users/helinjiang/gitprojects/node_modules/matman-core/lib/CaseModule.js'
//
// const str5 = '/Users/helinjiang/gitprojects/matman/packages/matman/test/CaseModule.js'
//
// const reg = /(packages|node_modules)\/(matman.*)\/(lib|src)/i
//
// console.log(str1.match(reg))
// console.log(str2.match(reg))
// console.log(str3.match(reg))
// console.log(str4.match(reg))
// console.log(str42.match(reg))
// console.log(str43.match(reg))
//
// console.log(str11.match(reg))
// console.log(str5.match(reg))
// console.log(reg.test(str5))

const stackStr = 'Error\n' +
  '    at Object.getCallerPath (/Users/helinjiang/gitprojects/matman/packages/matman-core/lib/launch/caller.js:16:15)\n' +
  '    at new Pipeline (/Users/helinjiang/gitprojects/matman/packages/matman-core/lib/model/Pipeline.js:14:34)\n' +
  '    at /Users/helinjiang/gitprojects/matman/debug-v7-demo/matman-app/src/pipelines/d.js:25:16';

const stackStr2 = 'Error\n' +
  '     at getCallStackInfo (/Users/helinjiang/gitproject/matman/tmp/t1.js:17:15)\n' +
  '     at exports.sayHello (/Users/helinjiang/gitproject/matman/tmp/t1.js:12:17)\n' +
  '     at Object.<anonymous> (/Users/helinjiang/gitproject/matman/tmp/test1.js:11:1)\n' +
  '     at Module._compile (internal/modules/cjs/loader.js:799:30)\n' +
  '     at Object.Module._extensions..js (internal/modules/cjs/loader.js:810:10)\n' +
  '     at Module.load (internal/modules/cjs/loader.js:666:32)\n' +
  '     at tryModuleLoad (internal/modules/cjs/loader.js:606:12)\n' +
  '     at Function.Module._load (internal/modules/cjs/loader.js:598:3)\n' +
  '     at Function.Module.runMain (internal/modules/cjs/loader.js:862:12)\n' +
  '     at internal/main/run_main_module.js:21:11';

// let stackFileArr = stackStr.match(/at.*(\()?\/(.*)\)/gi) || [];
// let stackFileArr = stackStr.match(/(\()?\/(.*)(\))?/gi).map((item) => item.replace(/\(/gi, '').replace(/\)/gi, '')) || [];
//
// console.log(stackFileArr);
//
// let stackFileArr2 = stackStr2.match(/(\()?\/(.*)(\))?/gi).map((item) => item.replace(/\(/gi, '').replace(/\)/gi, '')) || [];
//
// console.log(stackFileArr2);

function test(str) {
  return str.match(/((\(\/)|\s\/)(.*)(\))?/gi)
    // .map((item) => item.replace(/\(/gi, '').replace(/\)/gi, '').trim());
    .map((item) => {
      const pure = item.replace(/\(/gi, '').replace(/\)/gi, '').trim();

    });
}

console.log(test(stackStr))
console.log(test(stackStr2))
