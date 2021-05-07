const path = require('path');
const { DefinedInstance } = require('../../../../../packages/matman-plugin-app');
// const { WhistleRule } = require('../../../../../packages/matman');

module.exports = opts => {
  // app 项目根目录
  const rootPath = path.resolve(__dirname, '/Users/helinjiang/gitprojects/matman-v7-demo');

  return new DefinedInstance({
    rootPath,
    setup: async pluginApp => {
      await pluginApp.build('npx cross-env ENABLE_E2E_TEST=1 npm run build', {
        cwd: rootPath,
      });
    },
    // getWhistleRule: () => {
    //   // 代理规则
    //   const name = opts.name || 'prod';
    //   const ruleList = [
    //     'a.com 1.2.3.4',
    //     `b.com 5.6.7.8`,
    //     `c.com/index.html ${rootPath}/build/index.html`,
    //   ];

    //   return new WhistleRule(name, ruleList);
    // },
  });
};

// install
// build
// set proxy
