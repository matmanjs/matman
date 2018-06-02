const path = require('path');

const MockerParser = require('../../src/mocker/MockerParser');

const mockerParser = new MockerParser({
    basePath: path.join(__dirname, './mock_service/mockers')
});

let mockerList = mockerParser.getAllMocker();

console.log(mockerList);
console.log(mockerParser.getMockerByName('demo_simple'));
console.log(mockerParser.getMockModuleByName('demo_simple', 'error'));
console.log(mockerParser.getMockModuleByName('demo_simple', 'success'));

console.log('\n');

mockerParser.getMockModuleByName('demo_simple', 'success').getResult().then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
});