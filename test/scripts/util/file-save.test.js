import path from 'path';
import fse from 'fs-extra';
import { expect } from 'chai';

import requireFile from '../../../mat/util/require-file';
import { saveJson } from '../../../mat/util/file-save';

// 测试目标
const TEST_TARGET = 'util/file-save.js';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_SRC = path.join(ROOT_TEST, './data/fixtures', path.dirname(TEST_TARGET));
const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', path.dirname(TEST_TARGET));
const BASE_PATH_EXPECTED = path.join(ROOT_TEST, './data/expected', path.dirname(TEST_TARGET));

// 以测试文件名为目录，将测试用的素材存储其中
const FOLDER_NAME = path.basename(TEST_TARGET, '.js');

// 保存的文件名后缀
const SAVE_FILE_SUFFIX = '.json';

describe('util/file-save.js', () => {
    const TMP_SAVE_FOLDER = path.join(BASE_PATH_TMP, FOLDER_NAME);

    before(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    after(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    describe('saveJson()', () => {
        const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'file.js');
        const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;

        const TMP_SAVE_FILE = path.join(TMP_SAVE_FOLDER, OUTPUT_FILE_NAME);
        const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

        before((done) => {
            saveJson(requireFile(SRC_FILE), TMP_SAVE_FILE)
                .then(() => {
                    done();
                })
                .catch((err) => {
                    // console.error('err', err);
                    done();
                });
        });

        it('Save json object to .json file success!', (done) => {
            const newSavedFile = fse.readFileSync(TMP_SAVE_FILE, 'utf8');
            const expectedFile = fse.readFileSync(EXPECTED_SAVE_FILE, 'utf8');

            expect(newSavedFile).to.equal(expectedFile);

            done();
        });
    });
});
