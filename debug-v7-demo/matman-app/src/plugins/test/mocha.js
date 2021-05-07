const { TestRunner } = require('../../../npm/matman-plugin-test');

module.exports = new TestRunner('npm run test:e2e:direct', {
  // cwd: e2eRunner.workspacePath,
  // whistlePort,
  // matmanAppPath,
  // mochawesomeJsonFilePath: path.join(e2eRunner.outputPath, './mochawesome/mochawesome.json'),
});

