const chai = require('chai');
const expect = chai.expect;

const parserUtil = require('../../../src/parser/parser-util');

describe('parser-util.js getMixinHandlerData()', () => {

  describe('not define property of route', () => {
    let handlerInfo;

    before(() => {
      handlerInfo = parserUtil.getMixinHandlerData('not_define_route', {}, null);
    });

    it('should return null', () => {
      expect(handlerInfo).to.be.null;
    });
  });

  describe('default value', () => {
    let handlerInfo;

    before(() => {
      handlerInfo = parserUtil.getMixinHandlerData('default_value', {
        route: '/cgi-bin/a/b/default_value'
      }, null);
    });

    it('should return object', () => {
      expect(handlerInfo).to.be.an('object');
    });

    it('should contain default values', () => {
      expect(handlerInfo).to.include({
        route: '/cgi-bin/a/b/default_value',
        name: 'default_value',
        description: 'default_value',
        disable: false,
        method: 'get',
        priority: 0,
      });
    });

    it('should contain property of tags', () => {
      expect(handlerInfo.tags).to.include('全部');
    });
  });

  describe('special value', () => {
    let handlerInfo;

    before(() => {
      handlerInfo = parserUtil.getMixinHandlerData('special_value', {
        route: '/cgi-bin/a/b/special_value',
        name: 'special_value_name',
        description: 'special_value description',
        disable: true,
        method: 'post',
        priority: 99,
        defaultModule: 'default_module',
        tags: ['tag1', 'tag2'],
      }, null);
    });

    it('should return object', () => {
      expect(handlerInfo).to.be.an('object');
    });

    it('should contain special values', () => {
      expect(handlerInfo).to.include({
        route: '/cgi-bin/a/b/special_value',
        name: 'special_value',
        description: 'special_value description',
        disable: true,
        method: 'post',
        priority: 99,
        activeModule: 'default_module',
      });
    });

    it('should contain property of tags', () => {
      expect(handlerInfo.tags).to.include.members(['全部', 'tag1', 'tag2']);
    });
  });

  describe('have cache data', () => {
    let handlerInfo;

    before(() => {
      handlerInfo = parserUtil.getMixinHandlerData('special_value', {
        route: '/cgi-bin/a/b/special_value',
        priority: 1,
        defaultModule: 'new_active_module',
        tags: ['tag3'],
      }, {
        route: '/cgi-bin/a/b/special_value',
        name: 'special_value_name',
        description: 'special_value description',
        disable: true,
        method: 'post',
        priority: 99,
        activeModule: 'default_module',
        tags: ['全部', 'tag1', 'tag2'],
      });
    });

    it('should return object', () => {
      expect(handlerInfo).to.be.an('object');
    });

    it('should contain special values', () => {
      expect(handlerInfo).to.include({
        route: '/cgi-bin/a/b/special_value',
        name: 'special_value',
        description: 'special_value description',
        disable: true,
        method: 'post',
        priority: 1,
        activeModule: 'default_module',
      });
    });

    it('should contain property of tags', () => {
      expect(handlerInfo.tags).to.include.members(['全部', 'tag1', 'tag2', 'tag3']);
    });
  });

});

describe('parser-util.js getMixinHandleModuleData()', () => {
  describe('default value', () => {
    let handleModuleInfo;

    before(() => {
      handleModuleInfo = parserUtil.getMixinHandleModuleData('default_value', {});
    });

    it('should return object', () => {
      expect(handleModuleInfo).to.be.an('object');
    });

    it('should contain default values', () => {
      expect(handleModuleInfo).to.include({
        name: 'default_value',
        description: 'default_value',
        priority: 0,
      });
    });

    it('should contain property of query', () => {
      expect(handleModuleInfo.query).to.include({
        _m_target: 'default_value'
      });
    });
  });

  describe('special value', () => {
    let handleModuleInfo;

    before(() => {
      handleModuleInfo = parserUtil.getMixinHandleModuleData('special_value', {
        name: 'special_value',
        description: 'special_value description',
        priority: 99
      });
    });

    it('should return object', () => {
      expect(handleModuleInfo).to.be.an('object');
    });

    it('should contain special values', () => {
      expect(handleModuleInfo).to.include({
        name: 'special_value',
        description: 'special_value description',
        priority: 99
      });
    });

    it('should contain property of query', () => {
      expect(handleModuleInfo.query).to.include({
        _m_target: 'special_value'
      });
    });
  });

});

describe('parser-util.js getMatchedHandler()', () => {
  const ALL_HANDLER_LIST = [{
    "name": "name",
    "route": "/cgi-bin/a/route1"
  }, {
    "name": "name1",
    "route": "/cgi-bin/a/route2"
  }, {
    "name": "name2",
    "route": "/cgi-bin/a/route2",
    "routeExtra": {
      "a": 1
    }
  }, {
    "name": "name3",
    "route": "/cgi-bin/a/route2",
    "routeExtra": {
      "a": 2
    }
  }, {
    "name": "name4",
    "route": "/cgi-bin/a/route2",
    "routeExtra": {
      "a": 1,
      "b": 1
    }
  }];

  it('route1 >> null should return [name]', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route1');
    expect(handlerInfo.name).to.equal("name");
  });

  it('route1 >> a=1 should return [name]', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route1', {
      "a": 1
    });
    expect(handlerInfo.name).to.equal("name");
  });

  it('null >> null should return [name1]', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2');
    expect(handlerInfo.name).to.equal("name1");
  });

  it('a=1 >> a=1 should return [name2]', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "a": 1
    });
    expect(handlerInfo.name).to.equal("name2");
  });

  it('a=1 >> b=1 should return null', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "b": 1
    });
    expect(handlerInfo).to.be.null;
  });

  it('a=1 >> c=1 should return null', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "c": 1
    });
    expect(handlerInfo).to.be.null;
  });

  it('a=2 >> a=2 should return [name3]', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "a": 2
    });
    expect(handlerInfo.name).to.equal("name3");
  });

  it('a=2 >> a=2 return null', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "a": 3
    });
    expect(handlerInfo).to.be.null;
  });

  it('should return [name4]', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "a": 1,
      "b": 1
    });
    expect(handlerInfo.name).to.equal("name4");
  });

  it('should return null', () => {
    let handlerInfo = parserUtil.getMatchedHandler(ALL_HANDLER_LIST, '/cgi-bin/a/route2', {
      "a": 1,
      "b": 2
    });
    expect(handlerInfo).to.be.null;
  });

});
