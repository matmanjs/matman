const path = require('path');

console.log(__dirname)
console.log(__filename)
console.log(path.basename(__dirname))
console.log(path.basename('a/b/c.json'))
console.log(path.basename('a/vc/a.js','.json'))