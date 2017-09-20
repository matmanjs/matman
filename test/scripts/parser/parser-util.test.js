const chai = require('chai');
const expect = chai.expect;

const parserUtil = require('../../../src/parser/parser-util');

describe('parser-util.js', () => {

  describe('getMixinHandlerData() default value', () => {
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

  describe('getMixinHandlerData() special value', () => {
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

  describe('getMixinHandlerData() have cache data', () => {
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
