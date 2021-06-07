const path = require('path');
const { E2ERunner } = require('../../../../packages/matman-core');

// TODO 增加 matman-plugin-test matman-plugin-command
// TODO 应该有不同的全局执行脚本，就像本文件一样，它是不同命令的有序组合，用于初始化、销毁、调试、dev场景，
//  此时就不需要在 matman.config.js 中设置 app activated 和 test activated
//  mocha 和 jest 分别一个插件吧
// pipeline start/bootstrap/clean

module.exports = async () => {
  const e2eRunner = new E2ERunner(path.join(__dirname, './matman-app/matman.config.js'));

  await e2eRunner.setup();

  await e2eRunner.runTest();

  await e2eRunner.teardown();
};
