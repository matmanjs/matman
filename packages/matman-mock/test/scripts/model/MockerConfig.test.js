const chai = require('chai');
const expect = chai.expect;

const { MockModule, MockerConfig } = require('../../../lib');

const mockModuleList = [];

mockModuleList.push(new MockModule('return-plain-object', require('../../data/fixtures/mock_modules/return-plain-object')));
mockModuleList.push(new MockModule('exist-config', require('../../data/fixtures/mock_modules/exist-config')));

describe('./mocker/MockerConfig.js', () => {
  describe('check empty.json', () => {
    let mockerConfig;

    before(() => {
      mockerConfig = new MockerConfig('empty', require('../../data/fixtures/mocker-config/empty'), mockModuleList);
      // console.log(mockerConfig);
    });

    it('should be instanceof MockerConfig ', () => {
      expect(mockerConfig).to.be.an.instanceof(MockerConfig);
    });

    it('should contain some fields', () => {
      expect(mockerConfig).to.have.all.keys('name', 'description', 'route', 'routeExtra', 'plugin', 'disable', 'defaultModule', 'activeModule', 'method', 'priority', 'tags');
    });

    it('should equal correct value', () => {
      expect(mockerConfig).to.eql({
        name: 'empty',
        route: '',
        routeExtra: {},
        plugin: 'xhr',
        description: 'empty',
        disable: false,
        defaultModule: '',
        activeModule: 'return-plain-object',
        method: 'get',
        priority: 0,
        tags: ['全部']
      });
    });
  });

  describe('check simple.json', () => {
    it('should equal correct value', () => {
      let mockerConfig = new MockerConfig('simple', require('../../data/fixtures/mocker-config/simple'), mockModuleList);

      expect(mockerConfig).to.eql({
        name: 'simple',
        route: '/cgi-bin/a/b/simple',
        routeExtra: {},
        plugin: 'xhr',
        description: 'simple',
        disable: false,
        defaultModule: '',
        activeModule: 'return-plain-object',
        method: 'get',
        priority: 0,
        tags: ['全部']
      });
    });
  });

  describe('check basic.json', () => {
    it('should equal correct value', () => {
      let mockerConfig = new MockerConfig('basic', require('../../data/fixtures/mocker-config/basic'), mockModuleList);

      expect(mockerConfig).to.eql({
        name: 'basic',
        route: '/cgi-bin/a/b/basic',
        routeExtra: {
          'desc': 'I am from routeExtra'
        },
        plugin: 'xhr',
        description: 'basic example description',
        disable: true,
        defaultModule: 'exist-config',
        activeModule: 'exist-config',
        method: 'post',
        priority: 88,
        tags: [
          '全部',
          '标签1',
          '标签2'
        ]
      });
    });
  });

  describe('check basic_02.json', () => {
    it('should equal correct value', () => {
      let mockerConfig = new MockerConfig('basic_02', require('../../data/fixtures/mocker-config/basic_02'), mockModuleList);

      expect(mockerConfig).to.eql({
        name: 'basic_02',
        route: '',
        routeExtra: {},
        plugin: 'xhr',
        description: 'basic_02',
        disable: false,
        defaultModule: 'exist-config',
        activeModule: 'return-plain-object',
        method: 'get',
        priority: 0,
        tags: [
          '全部',
          '标签1',
          '标签2'
        ]
      });
    });
  });

  describe('check basic_async.json', () => {
    it('should equal correct value', () => {
      let mockerConfig = new MockerConfig('basic_async', require('../../data/fixtures/mocker-config/basic_async'), mockModuleList);

      expect(mockerConfig).to.eql({
        name: 'basic_async',
        route: '/cgi-bin/a/b/basic_async',
        routeExtra: {},
        plugin: 'async',
        description: 'basic_async',
        disable: false,
        defaultModule: '',
        activeModule: 'return-plain-object',
        method: 'get',
        priority: 0,
        tags: ['全部']
      });
    });
  });
});

