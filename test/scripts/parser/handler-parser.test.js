import path from 'path';
import { expect } from 'chai';
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
    fse.removeSync(BASE_PATH_TMP);

    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_TMP);

    handlerParser.parseAndSave();

    data = fse.readJsonSync(path.join(BASE_PATH_TMP, 'db.json'));
  });

  after(() => {
    // fse.removeSync(BASE_PATH_TMP);
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

    it('should return an array and length is 6', () => {
      expect(cacheAllHandlerList).to.be.an('array')
        .and.have.lengthOf(6);
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
        "plugin": "mocker",
        "route": "/cgi-bin/a/b/demo_simple",
        "activeModule": "error"
      });
    });
  });

  describe('check cache: getHandler("demo_no_modules")', () => {
    let cacheHandlerInfo;

    before(() => {
      cacheHandlerInfo = handlerParser.getHandler('demo_no_modules');
    });

    it('should return an object and correct', () => {
      expect(cacheHandlerInfo).to.include({
        "name": "demo_no_modules",
        "description": "demo_no_modules",
        "disable": false,
        "method": "get",
        "priority": 0,
        "plugin": "mocker",
        "route": "/cgi-bin/a/b/demo_no_modules",
        "activeModule": "index_module",
      });
    });

    it('modules should only exist one', () => {
      expect(cacheHandlerInfo.modules).to.have.lengthOf(1);
    });

    it('the only module should be correct', () => {
      expect(cacheHandlerInfo.modules[0]).to.include({
        "name": "index_module",
        "description": "default module",
        "priority": 0
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
        "plugin": "mocker",
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
        "plugin": "mocker",
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
      "plugin": "mocker",
      "route": "/cgi-bin/a/b/demo_simple",
      "activeModule": "error"
    });
  });

});

describe('parser-util.js getHandlerByRoute()', () => {
  let handlerParser;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);
  });

  it('demo_simple >> null should return [demo_simple]', () => {
    let handlerInfo = handlerParser.getHandlerByRoute('/cgi-bin/a/b/demo_simple');
    expect(handlerInfo.name).to.equal("demo_simple");
  });

  it('demo_handle_modules >> null should return [demo_handle_modules]', () => {
    let handlerInfo = handlerParser.getHandlerByRoute('/cgi-bin/a/b/demo_handle_modules');
    expect(handlerInfo.name).to.equal("demo_handle_modules");
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

describe('handler-parser.js getReqInfoByRoute()', () => {
  let handlerParser;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);
  });

  describe('demo_handle_modules >> null', () => {
    let result;

    before(() => {
      result = handlerParser.getReqInfoByRoute('/cgi-bin/a/b/demo_handle_modules');
    });

    it('should return object', () => {
      expect(result).to.be.an('object')
        .that.include.all.keys('handlerInfo', 'handleModuleInfo', 'fullPath', 'params');
    });

    it('result.params should return object', () => {
      expect(result.params).to.include({
        _m_target: 'success_1'
      });
    });
  });

  describe('demo_handle_modules >> a=1&_m_target=success_4', () => {
    let result;

    before(() => {
      result = handlerParser.getReqInfoByRoute('/cgi-bin/a/b/demo_handle_modules', {
        a: 1,
        _m_target: 'success_4'
      });
    });

    it('should return object', () => {
      expect(result).to.be.an('object')
        .that.include.all.keys('handlerInfo', 'handleModuleInfo', 'fullPath', 'params');
    });

    it('result.params should return object and got type=1', () => {
      expect(result.params).to.include({
        _m_target: 'success_4',
        type: 1,
        a: 1
      });
    });
  });
});

describe('handler-parser.js getHandleModuleResult()', () => {
  let handlerParser;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);
  });

  describe('demo_handle_modules >> null', () => {
    let result;

    before(() => {
      return handlerParser.getHandleModuleResult('/cgi-bin/a/b/demo_handle_modules')
        .then((data) => {
          result = data;
        });
    });

    it('should return object', () => {
      expect(result).to.be.an('object')
        .that.include.all.keys('data', 'extra');
    });

    it('module result is 1', () => {
      expect(result.data.result).is.equal(1);
    });
  });

  describe('demo_handle_modules >> null', () => {
    let result;

    before(() => {
      return handlerParser.getHandleModuleResult('/cgi-bin/a/b/demo_handle_modules', {
        a: 1,
        _m_target: 'success_4'
      })
        .then((data) => {
          result = data;
        });
    });

    it('should return object', () => {
      expect(result).to.be.an('object')
        .that.include.all.keys('data', 'extra');
    });

    it('module result is from_param_1', () => {
      expect(result.data).is.equal('from_param_1');
    });
  });

  describe('demo_no_modules >> null', () => {
    let result;

    before(() => {
      return handlerParser.getHandleModuleResult('/cgi-bin/a/b/demo_no_modules')
        .then((data) => {
          result = data;
        });
    });

    it('should return object', () => {
      expect(result).to.be.an('object')
        .that.include.all.keys('data', 'extra');
    });

    it('module result is 1', () => {
      expect(result.data.result).is.equal(1);
    });
  });
});

describe('handler-parser.js updateHandler()', () => {
  let handlerParser;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);
  });

  it('demo_simple change disable and priority should success', () => {
    let data = handlerParser.updateHandler('demo_simple', { disable: true, priority: 66 });
    expect(data).to.include({
      disable: true,
      priority: 66
    });
  });

  it('demo_simple reset should success', () => {
    let data = handlerParser.updateHandler('demo_simple', { disable: false, priority: 0 });
    expect(data).to.include({
      disable: false,
      priority: 0
    });
  });
});

describe('handler-parser.js getReadMeContent()', () => {
  let handlerParser;

  before(() => {
    handlerParser = new HandlerParser(BASE_PATH_FIXTURES, BASE_PATH_EXPECTED);
  });

  it('demo_readme should exist readme.md', () => {
    let data = handlerParser.getReadMeContent('demo_readme');
    expect(data).to.equal('<p>你好！ <code>MatMan</code> 是个很好用的工具！</p>\n');
  });
});