import path from 'path';
import {expect} from 'chai';
import fse from 'fs-extra';

import handleUtil from '../../../src/util/handle';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_FIXTURES = path.join(ROOT_TEST, './data/fixtures/util/handle');
const BASE_PATH_EXPECTED = path.join(ROOT_TEST, './data/expected/util/handle');
const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp/util-handle');

// 保存的文件名后缀，这里全部使用 json 后缀名
const SAVE_FILE_SUFFIX = '.json';

describe('util/handle.js getResult()', () => {

  it('support json file', () => {
    return handleUtil.getResult(path.join(BASE_PATH_FIXTURES, 'json-file.json'))
      .then((data) => {
        expect(data).to.deep.equal({name: 'json-file.json', age: 16});
      });
  });

  it('return plain object', () => {
    return handleUtil.getResult(path.join(BASE_PATH_FIXTURES, 'return-plain-object.js'))
      .then((data) => {
        expect(data).to.deep.equal({name: 'return-plain-object', age: 16});
      });
  });

  it('return function of object', () => {
    return handleUtil.getResult(path.join(BASE_PATH_FIXTURES, 'return-function-pure.js'))
      .then((data) => {
        expect(data).to.deep.equal({name: 'return-function-pure', age: 16});
      });
  });

  it('return promise', () => {
    return handleUtil.getResult(path.join(BASE_PATH_FIXTURES, 'return-promise.js'))
      .then((data) => {
        expect(data).to.deep.equal({name: 'return-promise', age: 16});
      });
  });

  it('return function of promise', () => {
    return handleUtil.getResult(path.join(BASE_PATH_FIXTURES, 'return-function-promise.js'))
      .then((data) => {
        expect(data).to.deep.equal({name: 'return-function-promise', age: 16});
      });
  });

});

describe('util/handle.js save() and saveJSON()', () => {

  after(() => {
    fse.removeSync(BASE_PATH_TMP);
  });

  describe('save()', () => {
    it('save plain object as .json file', () => {
      const SRC_FILE = path.join(BASE_PATH_FIXTURES, 'return-plain-object.js');
      const TMP_SAVE_FILE = path.join(BASE_PATH_TMP, 'return-plain-object.json');
      const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, 'return-plain-object.json');

      return handleUtil.save(SRC_FILE, TMP_SAVE_FILE)
        .then(() => {
          const newSavedFile = fse.readFileSync(TMP_SAVE_FILE, 'utf8');
          const expectedFile = fse.readFileSync(EXPECTED_SAVE_FILE, 'utf8');

          expect(newSavedFile).to.equal(expectedFile);
        });
    });

    it('save promise object as .json file', () => {
      const SRC_FILE = path.join(BASE_PATH_FIXTURES, 'return-promise.js');
      const TMP_SAVE_FILE = path.join(BASE_PATH_TMP, 'return-promise.json');
      const EXPECTED_SAVE_FILE = path.join(BASE_PATH_EXPECTED, 'return-promise.json');

      return handleUtil.save(SRC_FILE, TMP_SAVE_FILE)
        .then(() => {
          const newSavedFile = fse.readFileSync(TMP_SAVE_FILE, 'utf8');
          const expectedFile = fse.readFileSync(EXPECTED_SAVE_FILE, 'utf8');

          expect(newSavedFile).to.equal(expectedFile);
        });
    });
  });
});