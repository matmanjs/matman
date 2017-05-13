var version = require('./MatmanVersion');
var mockerModuleTool = require('./mocker/mocker-module-tool');

module.exports = {
    mocker: {
        tool: mockerModuleTool
    },
    version: version
};