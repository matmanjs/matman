const path = require('path');

const MockerParser = require('../../src/mocker/MockerParser');

const mockerParser = new MockerParser({
    basePath: path.join(__dirname, './mock_service/mockers')
});

console.log(mockerParser.getAllMocker())