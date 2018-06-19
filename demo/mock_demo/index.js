const path = require('path');
const matman = require('../../lib');

const MockerParser = matman.MockerParser;

const mockerParser = new MockerParser({
  basePath: path.resolve(__dirname, '../../test/data/fixtures/mock_server/mockers'),
  buildPath: path.resolve(__dirname, './build')
});

// 获得所有的 mocker
console.log(mockerParser.getAllMocker());

// 获得名字为 demo_03 的 mocker
console.log(mockerParser.getMockerByName('demo_03'));

// 获得 demo_03 中 success_1 数据模块
let mockModule = mockerParser.getMockModuleByName('demo_03', 'success_1');
console.log(mockModule);

// 获得 demo_03 中 success_1 数据模块的结果值
mockModule.getResult()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });