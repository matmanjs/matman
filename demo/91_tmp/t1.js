const path = require('path');

const MockerParser = require('../../src/mocker/MockerParser');

const mockerParser = new MockerParser({
    basePath: path.join(__dirname, './mock_service/mockers')
});

let mockerList = mockerParser.getAllMocker();

console.log(mockerList)
console.log(mockerParser.getMockerByName('demo_simple'))