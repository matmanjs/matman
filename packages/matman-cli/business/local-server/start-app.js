const run = require('./run');
const runConfig = require('./config');

const configAbsolutePath = process.argv[2];
const cwd = process.argv[3];

console.log('configAbsolutePath:', configAbsolutePath);
console.log('cwd:', cwd);

// 获取配置文件内容
let matmanConfig = require(configAbsolutePath);

// 如果不定义 rootPath，则默认取 process.cwd()
if (!matmanConfig.rootPath) {
  matmanConfig.rootPath = cwd || process.cwd();
}

// 获取一些默认值
let configOpts = runConfig.getConfigOpts(matmanConfig);

// 如果没法获取配置项，则将无法启动成功
if (!configOpts) {
  throw new Error('Invalid param!');
}

run(configOpts);