const path = require('path');
const { PluginAppMaterial } = require('../../../../../packages/matman');

// app 项目根目录
const rootPath = path.resolve(__dirname, '../../../../../test/data/project-react-h5');

module.exports = new PluginAppMaterial(__filename, {
  rootPath,
  setup: async pluginApp => {
    await pluginApp.build(port => `npx cross-env ENABLE_E2E_TEST=1 PORT=${port} npm start`, {
      cwd: rootPath,
      port: process.env.PROJECT_PORT,
      usePort: true,
      checkIfBuildCompleted: stdoutData =>
        stdoutData && stdoutData.indexOf('Compiled successfully') > -1,
    });
  },
  getWhistleRules: port => {
    return [
      'now.qq.com/maybe/report statusCode://200',
      `now.qq.com 127.0.0.1:${port}`,
      `now.qq.com/manifest.json ${rootPath}/public/manifest.json`,
    ];
  },
});

