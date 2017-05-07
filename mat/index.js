var exportData = require('./util/export-data');

function test() {
    var testOutput = require('./test/purejson');

    exportData.saveAsJson(testOutput, './test/output/purejson.json')
        .then(function (result) {
            console.log('success', result);
        })
        .catch(function (err) {
            console.error('err', err);
        });
}

test();