const { PluginTestMochaInstance } = require('../../../../../packages/matman-plugin-test');

// module.exports = new MochaInstance('npm run test:e2e:direct', {
//   // cwd: e2eRunner.workspacePath,
//   // whistlePort,
//   // matmanAppPath,
//   // mochawesomeJsonFilePath: path.join(e2eRunner.outputPath, './mochawesome/mochawesome.json'),
// });

module.exports = new PluginTestMochaInstance('npm run test:e2e:direct', {
  cwd: '/Users/helinjiang/gitprojects/matman/debug-v7-demo',
});
