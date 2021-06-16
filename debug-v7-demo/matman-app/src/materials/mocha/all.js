const path = require('path');
const { PluginMochaMaterial } = require('../../../../../packages/matman');

// module.exports = new MochaInstance('npm run test:e2e:direct', {
//   // cwd: e2eRunner.workspacePath,
//   // whistlePort,
//   // matmanAppPath,
//   // mochawesomeJsonFilePath: path.join(e2eRunner.outputPath, './mochawesome/mochawesome.json'),
// });

module.exports = new PluginMochaMaterial(__filename, 'npx mocha', {
  cwd: path.join(__dirname, '../../../../'),
});
