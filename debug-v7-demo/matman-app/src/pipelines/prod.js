const path = require('path');
const { Pipeline } = require('../../../../packages/matman-core');
const { setPipelineJsonDataToEnv } = require('../../../../packages/matman-plugin-test');

// TODO 增加 matman-plugin-test matman-plugin-command
// TODO 应该有不同的全局执行脚本，就像本文件一样，它是不同命令的有序组合，用于初始化、销毁、调试、dev场景，
//  此时就不需要在 matman.config.js 中设置 app activated 和 test activated
//  mocha 和 jest 分别一个插件吧
// pipeline start/bootstrap/clean

module.exports = async () => {
  const pipeline = new Pipeline(path.join(__dirname, './matman-app/matman.config.js'));

  await pipeline.setup();

  // 一定要设置变量
  setPipelineJsonDataToEnv(pipeline);


  await pipeline.runTest();

  // await pipeline.teardown();
};
