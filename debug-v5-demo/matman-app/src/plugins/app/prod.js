const path = require('path');
const { DefinedInstance, buildApp } = require('../../../npm/matman-plugin-app');
const { WhistleRule } = require('matman');

module.exports = async (opts) => {
  // app 项目根目录
  const rootPath = path.join(__dirname, '../../../../../');

  return new DefinedInstance({
    rootPath,
    setup: async () => {
      await buildApp('npx cross-env ENABLE_E2E_TEST=1 npm run build', {
        cwd: rootPath,
      });
    },
    getWhistleRule: () => {
      // 代理规则
      const name = opts.name || 'prod';
      const ruleList = [
        'a.com 1.2.3.4',
        `b.com 5.6.7.8`,
        `c.com/index.html ${rootPath}/build/index.html`,
      ];

      return new WhistleRule(name, ruleList);
    },
  });
};

// install
// build
// set proxy
