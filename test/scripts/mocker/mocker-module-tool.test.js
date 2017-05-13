import path from 'path';
import { expect } from 'chai';

import fse from '../../../src/util/fse';

import mockerModuleTool from '../../../src/mocker/mocker-module-tool';

// 测试目标
const TEST_TARGET = 'mocker/mocker-module-tool.js';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const TEST_SUB_PATH = path.dirname(TEST_TARGET);
const BASE_PATH_SRC = path.join(ROOT_TEST, './data/fixtures', TEST_SUB_PATH);
const BASE_PATH_EXPECTED = path.join(ROOT_TEST, './data/expected', TEST_SUB_PATH);
const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', TEST_SUB_PATH);

// 以测试文件名为目录，将测试用的素材存储其中
const FOLDER_NAME = path.basename(TEST_TARGET, '.js');

// 保存的文件名后缀
const SAVE_FILE_SUFFIX = '.json';

describe(TEST_TARGET, () => {
    const TMP_SAVE_FOLDER = path.join(BASE_PATH_TMP, FOLDER_NAME);

    before(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    after(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    describe('getResult()', () => {

        it('return plain object', () => {
            const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'return-plain-object.js');
            const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
            const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

            return mockerModuleTool.getResult(SRC_FILE)
                .then((data) => {
                    const expectedData = fse.readJsonSync(EXPECTED_SAVE_FILE);

                    expect(data).to.deep.equal(expectedData);
                });
        });

        it('return function-pure', () => {
            const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'return-function-pure.js');
            const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
            const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

            return mockerModuleTool.getResult(SRC_FILE)
                .then((data) => {
                    const expectedData = fse.readJsonSync(EXPECTED_SAVE_FILE);

                    expect(data).to.deep.equal(expectedData);
                });
        });

        it('return function-promise', () => {
            const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'return-function-promise.js');
            const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
            const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

            return mockerModuleTool.getResult(SRC_FILE)
                .then((data) => {
                    const expectedData = fse.readJsonSync(EXPECTED_SAVE_FILE);

                    expect(data).to.deep.equal(expectedData);
                });
        });

        it('return promise', () => {
            const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'return-promise.js');
            const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
            const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

            return mockerModuleTool.getResult(SRC_FILE)
                .then((data) => {
                    const expectedData = fse.readJsonSync(EXPECTED_SAVE_FILE);

                    expect(data).to.deep.equal(expectedData);
                });
        });
    });

    describe('save()', () => {

        it('save plain object as .json file', () => {
            const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'return-plain-object.js');
            const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
            const TMP_SAVE_FILE = path.join(TMP_SAVE_FOLDER, OUTPUT_FILE_NAME);
            const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, FOLDER_NAME, OUTPUT_FILE_NAME);

            return mockerModuleTool.save(SRC_FILE, TMP_SAVE_FILE)
                .then(() => {
                    const newSavedFile = fse.readFileSync(TMP_SAVE_FILE, 'utf8');
                    const expectedFile = fse.readFileSync(EXPECTED_SAVE_FILE, 'utf8');

                    expect(newSavedFile).to.equal(expectedFile);
                });
        });

    });
});
