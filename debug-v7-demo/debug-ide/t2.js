const path = require('path');

const { E2ERunner } = require('../../packages/matman-core');
const e2eRunner = new E2ERunner(path.join(__dirname, '../matman-app/matman.config.js'));

console.log(e2eRunner);

for (let index = 0; index < e2eRunner.matmanConfig.plugins.length; index++) {
  const plugin = e2eRunner.matmanConfig.plugins[index];
  console.log('\n', plugin.name);

  if (typeof plugin.getAllMaterial === 'function') {
    console.log(plugin.getAllMaterial());
  }
  if (typeof plugin.getActivatedMaterial === 'function') {
    console.log(plugin.getActivatedMaterial());
  }
}

// const pluginApp = e2eRunner.matmanConfig.plugins[0];
// console.log(pluginApp);
