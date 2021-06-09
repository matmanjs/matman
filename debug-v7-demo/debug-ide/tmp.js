const str1 = '/Users/helinjiang/gitprojects/matman/packages/matman-core/lib/CaseModule.js'
const str2 = '/Users/helinjiang/gitprojects/matman/packages/matman/lib/CaseModule.js'
const str3 = '/Users/helinjiang/gitprojects/matman/packages/matman-core/src/CaseModule.js'
const str4 = '/Users/helinjiang/gitprojects/matman/packages/matman/src/CaseModule.js'
const str42 = '/Users/helinjiang/gitprojects/matman/dddd/matman/src/CaseModule.js'
const str43 =  '/Users/helinjiang/gitprojects/matman/packages/matman-plugin-mockstar/lib/PluginMockstarMaterial.js'

const str11 = '/Users/helinjiang/gitprojects/node_modules/matman-core/lib/CaseModule.js'

const str5 = '/Users/helinjiang/gitprojects/matman/packages/matman/test/CaseModule.js'

const reg = /(packages|node_modules)\/(matman.*)\/(lib|src)/i

console.log(str1.match(reg))
console.log(str2.match(reg))
console.log(str3.match(reg))
console.log(str4.match(reg))
console.log(str42.match(reg))
console.log(str43.match(reg))

console.log(str11.match(reg))
console.log(str5.match(reg))
console.log(reg.test(str5))
