import path from 'path';
import { expect } from 'chai';
import fse from 'fs-extra';
import HandlerParser from '../../../src/parser/handler-parser';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_FIXTURES = path.join(ROOT_TEST, './data/fixtures/parser');
const BASE_PATH_EXPECTED = path.join(ROOT_TEST, './data/expected/parser');
// const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', TEST_SUB_PATH);

describe('handler-parser.js getAllHandler()', () => {
  let allHandlerInfo;

  before(() => {
    let handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);

    allHandlerInfo = handlerParser.getAllHandler();
    console.log(allHandlerInfo)
  });

  // after(() => {
  //     fse.removeSync(TMP_SAVE_FOLDER);
  // });

  describe('check simple_cgi', () => {
    let data;

    before(() => {
      allHandlerInfo.forEach((item) => {
        if (!data && (item.name === 'simple_cgi')) {
          data = item;
        }
      })
    });

    it('should return db object', () => {
      expect(data).to.be.an('object');
    });

    // let a = {
    //   name: 'simple_cgi',
    //   description: 'simple_cgi',
    //   disable: false,
    //   method: 'get',
    //   priority: 0,
    //   route: '/cgi-bin/a/b/simple_cgi',
    //   activeModule: 'error_not_login',
    //   tags: ['全部'],
    //   modules: [[Object], [Object], [Object]],
    //   _fullPath: 'D:\\gitprojects\\matman\\test\\data\\fixtures\\parser\\simple_cgi'
    // }

    it('should have some properties', () => {
      expect(data).to.include({
        name: 'simple_cgi',
        description: 'simple_cgi',
        disable: false,
        method: 'get',
        priority: 0,
        route: '/cgi-bin/a/b/simple_cgi',
        activeModule: 'error_not_login'
      });
    });

    it('data._fullPath include words of "simple_cgi"', () => {
      // D:\\gitprojects\\matman\\test\\data\\fixtures\\parser\\simple_cgi
      expect(data._fullPath).to.include('simple_cgi');
    });

    it('data.modules length is 3', () => {
      expect(data.modules).have.lengthOf(3);
    });
  });

});
