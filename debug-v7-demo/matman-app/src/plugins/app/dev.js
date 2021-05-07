const path = require('path');
const { DefinedInstance, buildApp } = require('../../../npm/matman-plugin-app');
const { WhistleRule } = require('matman');

module.exports = async (opts) => {
  // app 项目根目录
  const rootPath = path.join(__dirname, '../../../../../');

  return new DefinedInstance({
    rootPath,
    setup: async (pluginApp) => {
      const projectPort = await buildApp(
        port => `npx cross-env ENABLE_E2E_TEST=1 PORT=${port} npm start`,
        {
          cwd: rootPath,
          port: process.env.PROJECT_PORT,
          usePort: true,
          checkIfBuildCompleted: stdoutData => stdoutData && stdoutData.indexOf('Compiled successfully') > -1,
        },
      );

      this.cacheData.setCacheItem('projectPort', projectPort);
    },
    getWhistleRule: async (port) => {
      // 代理规则
      const name = opts.name || 'dev';
      const ruleList = [
        'a.com 1.2.3.4',
        `b.com 5.6.7.8:${port}`,
        `c.com/index.html ${rootPath}/build/index.html`,
      ];

      return new WhistleRule(name, ruleList);
    },
  });
};

// install
// build
// set proxy
