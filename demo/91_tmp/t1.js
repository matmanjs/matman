const path = require('path');

const MockerParser = require('../../src/mocker/MockerParser');

const mockerParser = new MockerParser({
    basePath: path.join(__dirname, './mock_service/mockers')
});

// let mockerList = mockerParser.getAllMocker();

// console.log(mockerList);
console.log(mockerParser.getMockerByName('demo_simple'));
// console.log(mockerParser.getMockModuleByName('demo_simple', 'error'));

// console.log(mockerParser.getMockerByName('name_demo_basic'));
//
console.log('\n');

mockerParser.getMockModuleByName('name_demo_basic', 'success_4').getResult().then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
});