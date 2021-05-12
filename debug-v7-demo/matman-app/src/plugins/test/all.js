const path = require('path');
const { PluginTestMochaInstance } = require('../../../../../packages/matman-plugin-test');

// module.exports = new MochaInstance('npm run test:e2e:direct', {
//   // cwd: e2eRunner.workspacePath,
//   // whistlePort,
//   // matmanAppPath,
//   // mochawesomeJsonFilePath: path.join(e2eRunner.outputPath, './mochawesome/mochawesome.json'),
// });

module.exports = new PluginTestMochaInstance('测试所有用例', 'npx mocha', {
  cwd: path.join(__dirname, '../../../../'),
});
