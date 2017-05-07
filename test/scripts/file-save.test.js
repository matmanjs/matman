var fse = require('fs-extra');
var Promise = require('bluebird');
var fileSave = require('../../mat/util/file-save');

var expect = require('chai').expect;

describe('util/file-save.js saveJson()', function () {
    before(function (done) {
        // 删除临时文件目录
        fse.removeSync('./test/tmp/util-file-save');

        fileSave.saveJson(require('../data/fixtures/util-file-save/file.js'), './test/tmp/util-file-save/file.json')
            .then(function () {
                done();
            })
            .catch(function (err) {
                console.error('err', err);
                done();
            });
    });

    after(function () {
        fse.removeSync('./test/tmp/util-file-save');
    });

    it('Save json object to .json file success!', function (done) {
        // 保存的文件内容
        var newSavedFile = fse.readFileSync('./test/tmp/util-file-save/file.json', 'utf8');

        // 预期的文件内容
        var expectedFile = fse.readFileSync('./test/data/expected/util-file-save/file.json', 'utf8');

        expect(newSavedFile).to.equal(expectedFile);

        done();
    });

});
