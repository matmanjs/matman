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

// src/materials/app/prod.js => {'src/materials': { app: [ prod.js ] }}
// src/case_modules/page-index/materials/mock-services/basic.js => {'src/case_modules/page-index/materials': { mock-services: [ basic.js ] }}
function getMaterialMap(matmanAppPath, materialDir) {
  // 相对于 matmanAppPath 的目录，例如  src/materials/app
  const pureRelativePath = path.relative(matmanAppPath, materialDir);
  console.log('\npureRelativePath', pureRelativePath);

  const result = [];

  fsHandler.search
    .getAll(matmanAppPath, {
      globs: [`${pureRelativePath}/**`],
    })
    .forEach(item => {
      // 目录无需处理
      if (item.isDirectory()) {
        // console.log(item.relativePath, '目录无需处理\n');
        return;
      }

      const relativePathSplitArr = item.relativePath.split('/');

      // 需要以 materials 来分组，数组分隔序号
      const splitIndex = _.indexOf(relativePathSplitArr, 'materials') + 1;

      // 获取：分组名称
      const groupName = relativePathSplitArr.slice(0, splitIndex).join('/');

      // 获取：物料名字和物料
      const materialInfoArr = relativePathSplitArr.slice(splitIndex);
      const element = materialInfoArr.pop();
      const name = materialInfoArr.join('/');

      result.push({
        fullPath: path.join(item.basePath, item.relativePath),
        groupName,
        name,
        element,
      });
    });

  console.log(result, '\n');
}

const matmanAppPath = path.join(__dirname, '../matman-app');
const materialDir1 = path.join(matmanAppPath, './src/case_modules/*/materials/mock-services');
const materialDir2 = path.join(matmanAppPath, './src/materials/app');
const materialDir3 = path.join(matmanAppPath, './src/materials/puppeteer/device');

getMaterialMap(matmanAppPath, materialDir1);
getMaterialMap(matmanAppPath, materialDir2);
getMaterialMap(matmanAppPath, materialDir3);
