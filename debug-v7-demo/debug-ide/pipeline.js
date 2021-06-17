const pipeline = require('../matman-app/src/pipelines/d');


console.log(pipeline)

for (let index = 0; index < pipeline.matmanConfig.plugins.length; index++) {
  const plugin = pipeline.matmanConfig.plugins[index];
  console.log('\n', plugin.name);

  if (typeof plugin.getAllMaterial === 'function') {
    console.log(plugin.getAllMaterial(pipeline.matmanConfig.matmanRootPath));
  }
  if (typeof plugin.getCurMaterial === 'function') {
    console.log(plugin.getCurMaterial());
  }
}
