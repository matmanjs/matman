const path = require('path');

const { PluginApp } = require('../../packages/matman-plugin-app');

const pluginApp = new PluginApp({
  materialDir: path.join(__dirname, '../matman-app/src/materials/app'),
  activated: 'prod.js',
});

console.log(pluginApp.getActivatedMaterial());
console.log(pluginApp.getAllMaterial());
