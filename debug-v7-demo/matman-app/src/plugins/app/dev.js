const path = require('path');
const { DefinedInstance } = require('../../../../../packages/matman-plugin-app');

module.exports = opts => {
  // app 项目根目录
  const rootPath = path.resolve(__dirname, '/Users/helinjiang/gitprojects/matman-v7-demo');

  return new DefinedInstance({
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
    getWhistleRule: port => {
      // 代理规则
      const name = 'dev';
      const rules = [
        'a.com 1.2.3.4',
        `b.com 5.6.7.8:${port}`,
        `c.com/index.html ${rootPath}/build/index.html`,
      ];

      return {
        name,
        rules,
      };
    },
  });
};
