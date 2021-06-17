const path = require('path');

const { PluginMockstar } = require('../../packages/matman-plugin-mockstar');

const pluginMockstar = new PluginMockstar({
  mockerDir: path.join(__dirname, '../matman-app/src/dependencies/mockstar/mockers'),
  materialDir: path.join(__dirname, '../matman-app/src/case_modules/*/materials/mock-services'),
  port: 9440,
});

// console.log(pluginMockstar.getActivatedMaterial());
console.log(pluginMockstar.getAllMaterial(path.join(__dirname,'../matman-app')));
