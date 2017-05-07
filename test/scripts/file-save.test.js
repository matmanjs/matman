import fse from 'fs-extra';
import { expect } from 'chai';

import fileSave from '../../mat/util/file-save';

describe('util/file-save.js saveJson()', () => {
    before((done) => {
        // 删除临时文件目录
        fse.removeSync('./test/tmp/util-file-save');

        fileSave.saveJson(require('../data/fixtures/util-file-save/file.js'), './test/tmp/util-file-save/file.json')
            .then(() => {
                done();
            })
            .catch((err) => {
                // console.error('err', err);
                done();
            });
    });

    after(() => {
        fse.removeSync('./test/tmp/util-file-save');
    });

    it('Save json object to .json file success!', (done) => {
        // 保存的文件内容
        const newSavedFile = fse.readFileSync('./test/tmp/util-file-save/file.json', 'utf8');

        // 预期的文件内容
        const expectedFile = fse.readFileSync('./test/data/expected/util-file-save/file.json', 'utf8');

        expect(newSavedFile).to.equal(expectedFile);

        done();
    });
});
