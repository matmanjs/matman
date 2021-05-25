const path = require('path');

const { PluginApp } = require('../../packages/matman-plugin-app');


const pluginApp = new PluginApp({
  definedInstanceDir: path.join(__dirname, '../matman-app/src/materials/app'),
  activeInstance: 'prod.js',
});

console.log(pluginApp.getActiveInstance());
console.log(pluginApp.getAllInstance());

