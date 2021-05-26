const path = require('path');

const { E2ERunner } = require('../../packages/matman-core');
const e2eRunner = new E2ERunner(path.join(__dirname, '../matman-app/matman.config.js'));

console.log(e2eRunner);

for (let index = 0; index < e2eRunner.matmanConfig.plugins.length; index++) {
  const plugin = e2eRunner.matmanConfig.plugins[index];

  if (typeof plugin.getAllDefinedInstances === 'function') {
    console.log('\n', plugin.name);
    console.log(plugin.getAllDefinedInstances());
  }
}

// const pluginApp = e2eRunner.matmanConfig.plugins[0];
// console.log(pluginApp);
