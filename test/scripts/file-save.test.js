import path from 'path';
import fse from 'fs-extra';
import { expect } from 'chai';
import { saveJson } from '../../mat/util/file-save';

const BASE_PATH_TMP = './test/tmp';
const BASE_PATH_EXPECTED = './test/data/expected';
const BASE_PATH_SRC = '../data/fixtures';
const FOLDER_NAME = 'util-file-save';
const FILE_SUFFIX = '.json';

describe('util/file-save.js saveJson()', () => {
    const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'file.js');
    const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + FILE_SUFFIX;

    const TMP_SAVE_FOLDER = path.join(BASE_PATH_TMP, FOLDER_NAME);
    const TMP_SAVE_FILE = path.join(TMP_SAVE_FOLDER, OUTPUT_FILE_NAME);
    const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

    before((done) => {
        // 删除临时文件目录
        fse.removeSync(TMP_SAVE_FOLDER);

        saveJson(require(SRC_FILE), TMP_SAVE_FILE)
            .then(() => {
                done();
            })
            .catch((err) => {
                // console.error('err', err);
                done();
            });
    });

    after(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    it('Save json object to .json file success!', (done) => {
        // 保存的文件内容
        const newSavedFile = fse.readFileSync(TMP_SAVE_FILE, 'utf8');

        // 预期的文件内容
        const expectedFile = fse.readFileSync(EXPECTED_SAVE_FILE, 'utf8');

        expect(newSavedFile).to.equal(expectedFile);

        done();
    });
});
