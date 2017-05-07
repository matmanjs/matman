import path from 'path';
import fse from 'fs-extra';
import { expect } from 'chai';

import requireFile from '../../../mat/util/require-file';
import { saveJson } from '../../../mat/util/file-save';

// 测试目标
const TEST_TARGET = 'mocker-src';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_SRC = path.join(ROOT_TEST, './data/fixtures', path.dirname(TEST_TARGET));
const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', path.dirname(TEST_TARGET));

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

    // 测试 using-faker.js
    describe('mocker by using fake.js', () => {
        const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'using-faker.js');
        const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
        const TMP_SAVE_FILE = path.join(TMP_SAVE_FOLDER, OUTPUT_FILE_NAME);

        let jsonObj;

        before((done) => {
            saveJson(requireFile(SRC_FILE), TMP_SAVE_FILE)
                .then(() => {
                    jsonObj = fse.readJsonSync(TMP_SAVE_FILE);
                    done();
                })
                .catch((err) => {
                    // console.error('err', err);
                    done();
                });
        });

        it('Is object!', () => {
            expect(jsonObj).to.be.an('object');
        });

        it('Have keys: name/email/uid', () => {
            // 注意这里的比较是属性必须一一对应，不能少一个也不能一个
            expect(jsonObj).to.have.all.keys(['name', 'email', 'uid']);
        });
    });

    // 测试 using-superagent.js
    describe('mocker from ajax by using superagent', () => {
        const SRC_FILE = path.join(BASE_PATH_SRC, FOLDER_NAME, 'using-superagent.js');
        const OUTPUT_FILE_NAME = path.basename(SRC_FILE, '.js') + SAVE_FILE_SUFFIX;
        const TMP_SAVE_FILE = path.join(TMP_SAVE_FOLDER, OUTPUT_FILE_NAME);

        let jsonObj;

        before((done) => {
            saveJson(requireFile(SRC_FILE), TMP_SAVE_FILE)
                .then(() => {
                    jsonObj = fse.readJsonSync(TMP_SAVE_FILE);
                    done();
                })
                .catch((err) => {
                    // console.error('err', err);
                    done();
                });
        });

        it('Is object!', () => {
            expect(jsonObj).to.be.an('object');
        });

        // it('Have keys: name/email/uid', () => {
        //     // 注意这里的比较是属性必须一一对应，不能少一个也不能一个
        //     expect(jsonObj).to.have.all.keys(['name', 'email', 'uid']);
        // });
    });

})
;

