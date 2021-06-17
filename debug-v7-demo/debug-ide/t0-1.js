const path = require('path');

const { findAllMaterialFileItems } = require('../../packages/matman-plugin-core');

const matmanAppPath = path.join(__dirname, '../matman-app');
const materialDir1 = path.join(matmanAppPath, './src/case_modules/*/materials/mock-services');
const materialDir2 = path.join(matmanAppPath, './src/materials/app');
const materialDir3 = path.join(matmanAppPath, './src/materials/puppeteer/device');

console.log(findAllMaterialFileItems(matmanAppPath, materialDir1));
console.log(findAllMaterialFileItems(matmanAppPath, materialDir2));
console.log(findAllMaterialFileItems(matmanAppPath, materialDir3));
