import path from 'path';
import { expect } from 'chai';
import fse from 'fs-extra';
import HandlerParser from '../../../src/parser/handler-parser';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_FIXTURES = path.join(ROOT_TEST, './data/fixtures/parser');
const BASE_PATH_EXPECTED = path.join(ROOT_TEST, './data/expected/parser');
// const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', TEST_SUB_PATH);

describe('handler-parser.js getAllHandler(true)', () => {
  let allHandlerInfo;

  before(() => {
    fse.removeSync(path.join(BASE_PATH_EXPECTED, 'db.json'));

    let handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);

    allHandlerInfo = handlerParser.getAllHandler(true);

    console.log(allHandlerInfo)

  });

  // after(() => {
  //     fse.removeSync(TMP_SAVE_FOLDER);
  // });

  describe('check demo_simple', () => {
    let data;

    before(() => {
      allHandlerInfo.forEach((item) => {
        if (!data && (item.name === 'demo_simple')) {
          data = item;
        }
      })
    });

    it('should return an object', () => {
      expect(data).to.be.an('object');
    });

    it('should have some properties', () => {
      expect(data).to.include({
        "name": "demo_simple",
        "description": "demo_simple",
        "disable": false,
        "method": "get",
        "priority": 0,
        "route": "/cgi-bin/a/b/demo_simple",
        "activeModule": "error"
      });
    });

    it('data._fullPath include words of "demo_simple"', () => {
      // D:\\gitprojects\\matman\\test\\data\\fixtures\\parser\\demo_simple
      expect(data._fullPath).to.include('demo_simple');
    });

    it('data.modules length is 2', () => {
      expect(data.modules).have.lengthOf(2);
    });

    it('data.modules is correct', () => {
      expect(data.modules.map(item => item.name)).to.include.members(['error', 'success']);
    });

  });

  describe('check demo_handle_modules', () => {
    let data;

    before(() => {
      allHandlerInfo.forEach((item) => {
        if (!data && (item.name === 'name_demo_handle_modules')) {
          data = item;
        }
      })
    });

    it('should return an object', () => {
      expect(data).to.be.an('object');
    });

    it('should have some properties', () => {
      expect(data).to.include({
        "name": "name_demo_handle_modules",
        "description": "description_demo_handle_modules",
        "disable": false,
        "method": "get",
        "priority": 0,
        "route": "/cgi-bin/a/b/demo_handle_modules",
        "activeModule": "success_1",
        "defaultModule": "success_1",
      });
    });

    it('data._fullPath include words of "demo_handle_modules"', () => {
      // D:\\gitprojects\\matman\\test\\data\\fixtures\\parser\\demo_simple
      expect(data._fullPath).to.include('demo_handle_modules');
    });

    it('data.modules length is 5', () => {
      expect(data.modules).have.lengthOf(5);
    });

    it('data.modules is correct', () => {
      expect(data.modules.map(item => item.name)).to.include.members([
        'error',
        'success_1',
        'success_2',
        'name_success_3',
        'success_4'
      ]);
    });

    it('data.modules has success_1', () => {
      expect(data.modules).to.include({
        "name": "success_1",
        "description": "success_1",
        "priority": 0,
        "query": {
          "_m_target": "success_1"
        }
      });
    });

    it('data.modules has name_success_3', () => {
      expect(data.modules).to.include({
        "name": "name_success_3",
        "description": "description_success_3",
        "priority": 100,
        "query": {
          "_m_target": "success_3"
        }
      });
    });

  });

  // describe('check simple_cgi', () => {
  //   let data;
  //
  //   before(() => {
  //     allHandlerInfo.forEach((item) => {
  //       if (!data && (item.name === 'simple_cgi')) {
  //         data = item;
  //       }
  //     })
  //   });
  //
  //   it('should return db object', () => {
  //     expect(data).to.be.an('object');
  //   });
  //
  //   it('should have some properties', () => {
  //     expect(data).to.include({
  //       name: 'simple_cgi',
  //       description: 'simple_cgi',
  //       disable: false,
  //       method: 'get',
  //       priority: 0,
  //       route: '/cgi-bin/a/b/simple_cgi',
  //       activeModule: 'error_not_login'
  //     });
  //   });
  //
  //   it('data._fullPath include words of "simple_cgi"', () => {
  //     // D:\\gitprojects\\matman\\test\\data\\fixtures\\parser\\simple_cgi
  //     expect(data._fullPath).to.include('simple_cgi');
  //   });
  //
  //   it('data.modules length is 3', () => {
  //     expect(data.modules).have.lengthOf(3);
  //   });
  //
  //   it('data.modules is correct', () => {
  //     expect(data.modules.map(item => item.name)).to.include.members(['error_not_login', 'success_exist_matman', 'success_not_exist']);
  //   });
  //
  // });

});
