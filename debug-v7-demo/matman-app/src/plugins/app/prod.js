const path = require('path');
const { DefinedInstance } = require('../../../../../packages/matman-plugin-app');

module.exports = opts => {
  // app 项目根目录
  const rootPath = path.resolve(__dirname, '/Users/helinjiang/gitprojects/matman-v7-demo');

  return new DefinedInstance('构建生产环境版本', {
    rootPath,
    setup: async pluginApp => {
      await pluginApp.build('npx cross-env ENABLE_E2E_TEST=1 npm run build', {
        cwd: rootPath,
      });
    },
    getWhistleRules: () => {
      return [
        'now.qq.com/maybe/report statusCode://200',
        `now.qq.com/manifest.json ${rootPath}/build/manifest.json`,
        `/^https?://now\\.qq\\.com/static/(.*)$/ ${rootPath}/build/static/$1`,
        `/^https?://now\\.qq\\.com/([\\w\\-]*)(.*)$/ ${rootPath}/build/index.html`,
      ];
    },
  });
};

// install
// build
// set proxy
