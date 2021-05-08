const { MochaInstance } = require('../../../../../packages/matman-plugin-test');

// module.exports = new MochaInstance('npm run test:e2e:direct', {
//   // cwd: e2eRunner.workspacePath,
//   // whistlePort,
//   // matmanAppPath,
//   // mochawesomeJsonFilePath: path.join(e2eRunner.outputPath, './mochawesome/mochawesome.json'),
// });

module.exports = new MochaInstance('npm --version', {
  cwd: '/Users/helinjiang/gitprojects/matman-v7-demo',
});
