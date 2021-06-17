const pipeline = require('../matman-app/src/pipelines/d');

console.log(pipeline);

const list = pipeline.getViewMaterials();
console.log(JSON.stringify(list,null,2))

