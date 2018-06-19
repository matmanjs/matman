const path = require('path');

const MockerParser = require('../../src/mocker/MockerParser');

const mockerParser = new MockerParser({
  basePath: path.resolve(__dirname, '../../test/data/fixtures/mock_server/mockers'),
  dataPath: path.join(__dirname, './app-test')
});

// let mockerList = mockerParser.getAllMocker();
//
// console.log(mockerList);
console.log(mockerParser.getMockerByName('demo_03'));

console.log('\n');


console.log(mockerParser.getReadMeContent('demo_03'));

console.log('\n');

// mockerParser.updateMocker('demo_simple', {
//   config: {
//     disable: true
//   }
// });
// console.log('\n');
//
// console.log(mockerParser.getMockerByName('demo_simple'));