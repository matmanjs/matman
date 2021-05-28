const path = require('path');
const fsHandler = require('fs-handler');
const _ = require('lodash');

// fsHandler.search
//   .getAll(path.join(__dirname, '../matman-app'), { globs: ['src/case_modules/*/materials/**'] })
//   .forEach(item => {
//     console.log(item);
//
//     if (item.isDirectory()) {
//       console.log('目录\n');
//     }
//   });

const matmanAppPath = path.join(__dirname, '../matman-app');
const materialDir = path.join(matmanAppPath, './src/case_modules/*/materials/mock-services');

const pureRelativePath = path.relative(matmanAppPath, materialDir);
console.log(pureRelativePath);

fsHandler.search
  .getAll(matmanAppPath, {
    globs: [`${pureRelativePath}/**`],
  })
  .forEach(item => {
    if (item.isDirectory()) {
      console.log('目录\n');
      return;
    }

    console.log(item, path.join(item.basePath, item.relativePath));
    const a1 = item.relativePath.split('/');
    const a2 = pureRelativePath.split('/');
    console.log(a1);
    console.log(a2);
    console.log(_.indexOf(a1, '*'));
    const pageName = a1[_.indexOf(a2, '*')];
    console.log('pageName', pageName);
  });

// const a = 'src/case_modules/page-withdraw/materials/mock-services/basic.js';
// // const reg = new RegExp('src/case_modules/*', 'i');
// const reg = /src\/case_modules\/+/;
// console.log(a.match(reg));
