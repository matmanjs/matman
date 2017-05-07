import path from 'path';
import fse from 'fs-extra';
import { expect } from 'chai';

import requireFile from '../../../mat/util/require-file';

// 测试目标
const TEST_TARGET = 'util/require-file.js';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_SRC = path.join(ROOT_TEST, './data/fixtures', path.dirname(TEST_TARGET));
const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', path.dirname(TEST_TARGET));

// 以测试文件名为目录，将测试用的素材存储其中
const FOLDER_NAME = path.basename(TEST_TARGET, '.js');

describe('require-file.js', () => {
    const TMP_SAVE_FOLDER = path.join(BASE_PATH_TMP, FOLDER_NAME);

    before(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    after(() => {
        fse.removeSync(TMP_SAVE_FOLDER);
    });

    it('require test module.exports', () => {
        const jsonObj = requireFile(path.join(BASE_PATH_SRC, FOLDER_NAME, 'module-exports.js'));

        expect(jsonObj).to.be.an('object')
            .to.have.all.keys(['name', 'age']);
    });

    it('require test export default', () => {
        const jsonObj = requireFile(path.join(BASE_PATH_SRC, FOLDER_NAME, 'export-default.js'));

        expect(jsonObj).to.be.an('object')
            .to.have.all.keys(['name', 'age']);
    });

});

