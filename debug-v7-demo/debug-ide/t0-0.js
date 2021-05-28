const path = require('path');
const fsHandler = require('fs-handler');

// fsHandler.search
//   .getAll(path.join(__dirname, '../matman-app'), { globs: ['src/case_modules/*/materials/**'] })
//   .forEach(item => {
//     console.log(item);
//
//     if (item.isDirectory()) {
//       console.log('目录\n');
//     }
//   });

fsHandler.search
  .getAll(path.join(__dirname, '../matman-app'), { globs: ['src/materials/**'] })
  .forEach(item => {
    console.log(item);

    if (item.isDirectory()) {
      console.log('目录\n');
    }
  });
