const { getCallerPath } = require('../../packages/matman-core/lib/launch/caller');

const c = getCallerPath();

console.log(c);
