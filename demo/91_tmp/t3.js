const path = require('path');

const MockerParser = require('../../src/mocker/MockerParser');

const mockerParser = new MockerParser({
  basePath: path.join(__dirname, './mock_service/mockers'),
  dbPath: path.join(__dirname, './app')
});

// let mockerList = mockerParser.getAllMocker();

// console.log(mockerList);
console.log(mockerParser.getMockerByName('demo_simple'));

console.log('\n');
//
// mockerParser.updateMocker('demo_simple', {
//   config: {
//     disable: true
//   }
// });
// console.log('\n');
//
// console.log(mockerParser.getMockerByName('demo_simple'));