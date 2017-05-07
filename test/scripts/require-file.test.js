import path from 'path';
import fse from 'fs-extra';
import { expect } from 'chai';

import requireFile from '../../mat/util/require-file';

const BASE_PATH_SRC = path.join(__dirname, '../data/fixtures');
const BASE_PATH_TMP = path.join(__dirname, '../tmp');
const FOLDER_NAME = 'require-file';

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

