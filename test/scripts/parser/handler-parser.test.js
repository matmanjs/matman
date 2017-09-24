import path from 'path';
import {expect} from 'chai';
import fse from 'fs-extra';
import HandlerParser from '../../../src/parser/handler-parser';

const ROOT_PROJECT = path.join(__dirname, '../../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');

const BASE_PATH_FIXTURES = path.join(ROOT_TEST, './data/fixtures/parser');
const BASE_PATH_EXPECTED = path.join(ROOT_TEST, './data/expected/parser');
const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp/parser');

describe('handler-parser.js parseAndSave() and get data from cache', () => {
  let handlerParser, data;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_TMP);

    handlerParser.parseAndSave();

    data = fse.readJsonSync(path.join(BASE_PATH_TMP, 'db.json'));
  });

  after(() => {
    fse.removeSync(BASE_PATH_TMP);
  });

  describe('check exist and correct', () => {
    it('should return an object', () => {
      expect(data).to.be.an('object');
    });

    it('should eql data/expected/parser/db.json', () => {
      let expectedData = fse.readJsonSync(path.join(BASE_PATH_EXPECTED, 'db.json'));

      expect(data.data).to.eql(expectedData.data);
    });
  });

  describe('check cache: getAllHandler()', () => {
    let cacheAllHandlerList;

    before(() => {
      cacheAllHandlerList = handlerParser.getAllHandler();
    });

    it('should return an array and length is 3', () => {
      expect(cacheAllHandlerList).to.be.an('array')
        .and.have.lengthOf(3);
    });
  });

  describe('check cache: getHandler("demo_simple")', () => {
    let cacheHandlerInfo;

    before(() => {
      cacheHandlerInfo = handlerParser.getHandler('demo_simple');
    });

    it('should return an object and correct', () => {
      expect(cacheHandlerInfo).to.include({
        "name": "demo_simple",
        "description": "demo_simple",
        "disable": false,
        "method": "get",
        "priority": 0,
        "route": "/cgi-bin/a/b/demo_simple",
        "activeModule": "error"
      });
    });
  });

});

describe('handler-parser.js getAllHandler(true)', () => {
  let allHandlerInfo;

  before(() => {
    let handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);

    allHandlerInfo = handlerParser.getAllHandler(true);
  });

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
        if (!data && (item.name === 'demo_handle_modules')) {
          data = item;
        }
      })
    });

    it('should return an object', () => {
      expect(data).to.be.an('object');
    });

    it('should have some properties', () => {
      expect(data).to.include({
        "name": "demo_handle_modules",
        "description": "description_demo_handle_modules",
        "disable": false,
        "method": "get",
        "priority": 0,
        "route": "/cgi-bin/a/b/demo_handle_modules",
        "activeModule": "success_1",
        "defaultModule": "success_1",
      });
    });

    it('data.modules length is 5', () => {
      expect(data.modules).have.lengthOf(5);
    });

    it('data.modules is correct', () => {
      expect(data.modules.map(item => item.name)).to.include.members([
        'error',
        'success_1',
        'success_2',
        'success_3',
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
        "name": "success_3",
        "description": "description_success_3",
        "priority": 100,
        "query": {
          "_m_target": "success_3"
        }
      });
    });

  });

});

describe('handler-parser.js getHandler("demo_simple", true)', () => {
  let handlerInfo;

  before(() => {
    let handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);

    handlerInfo = handlerParser.getHandler('demo_simple', true);
  });

  it('should return an object and correct', () => {
    expect(handlerInfo).to.include({
      "name": "demo_simple",
      "description": "demo_simple",
      "disable": false,
      "method": "get",
      "priority": 0,
      "route": "/cgi-bin/a/b/demo_simple",
      "activeModule": "error"
    });
  });

});

describe('handler-parser.js getHandleModule()', () => {
  let handlerParser;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);
  });

  it('getHandleModule("demo_simple","success") should return [success]', () => {
    let data = handlerParser.getHandleModule('demo_simple', 'success');

    expect(data).to.include({
      "description": "success",
      "priority": 0,
      "name": "success",
    });
  });

  it('getHandleModule("demo_simple","success", true) should return [success]', () => {
    let data = handlerParser.getHandleModule('demo_simple', 'success', true);

    expect(data).to.include({
      "description": "success",
      "priority": 0,
      "name": "success",
    });
  });

  it('getHandleModule("demo_simple","other") should return null', () => {
    let data = handlerParser.getHandleModule('demo_handle_modules', 'other');

    expect(data).to.be.null;
  });

  it('getHandleModule("demo_handle_modules","success_3") should return [success_3]', () => {
    let data = handlerParser.getHandleModule('demo_handle_modules', 'success_3');

    expect(data).to.include({
      "description": "description_success_3",
      "priority": 100,
      "name": "success_3"
    });
  });

});
