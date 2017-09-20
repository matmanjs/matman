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
        name: 'special_value_name',
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
        name: 'special_value_name',
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
