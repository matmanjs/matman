const path = require('path');
const { DefinedInstance } = require('../../../../../packages/matman-plugin-app');
// const { WhistleRule } = require('../../../../../packages/matman');

module.exports = opts => {
  // app 项目根目录
  const rootPath = path.resolve(__dirname, '/Users/helinjiang/gitprojects/matman-v7-demo');

  return new DefinedInstance({
    rootPath,
    setup: async pluginApp => {
      const projectPort = await pluginApp.build(
        port => `npx cross-env ENABLE_E2E_TEST=1 PORT=${port} npm start`,
        {
          cwd: rootPath,
          port: process.env.PROJECT_PORT,
          usePort: true,
          checkIfBuildCompleted: stdoutData =>
            stdoutData && stdoutData.indexOf('Compiled successfully') > -1,
        },
      );

      // this.cacheData.setCacheItem('projectPort', projectPort);
    },
    // getWhistleRule: async port => {
    //   // 代理规则
    //   const name = opts.name || 'dev';
    //   const ruleList = [
    //     'a.com 1.2.3.4',
    //     `b.com 5.6.7.8:${port}`,
    //     `c.com/index.html ${rootPath}/build/index.html`,
    //   ];

    //   return new WhistleRule(name, ruleList);
    // },
  });
};
