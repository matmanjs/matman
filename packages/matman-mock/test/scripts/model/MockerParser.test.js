const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const { MockerParser, Mocker, MockModule } = require('../../../lib');

describe('./mocker/MockerParser.js', () => {
  let mockerParser;

  before(() => {
    mockerParser = new MockerParser({
      basePath: path.resolve(__dirname, '../../data/fixtures/mock_server/mockers')
    });

    // console.log(mockerParser);
  });

  describe('check basic info', () => {
    it('should be instanceof MockerParser ', () => {
      expect(mockerParser).to.be.an.instanceof(MockerParser);
    });

    it('should contain some fields', () => {
      expect(mockerParser).to.have.all.keys('basePath', 'matmanMockers');
    });
  });

  describe('check getAllMocker', () => {
    let allMocker;

    before(() => {
      allMocker = mockerParser.getAllMocker(true);
    });

    it('should exist 4 members', () => {
      expect(allMocker).to.have.lengthOf(4);
    });

    it('should contain correct mocker', () => {
      expect(allMocker.map(item => item.name)).to.have.members(['demo_01', 'demo_02_renamed', 'demo_03', 'stub_01']);
    });
  });

  describe('check demo_01', () => {
    it('mockerParser.getMockerByName(\'demo_01\') should return correct mocker', () => {
      let mocker = mockerParser.getMockerByName('demo_01');

      expect(mocker).to.be.an.instanceof(Mocker);
      expect(mocker.name).to.equal('demo_01');
      expect(mocker.mockModuleList).to.have.lengthOf(2);
    });

    it('mockerParser.getMockModuleByName(\'demo_01\', \'error\') should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_01', 'error');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('error');

      return mockModule.getResult()
        .then((data) => {
          expect(data).to.eql({
            errCode: 100000
          });
        });
    });
  });

  describe('check demo_02', () => {
    it('mockerParser.getMockerByName(\'demo_02\') should return undefined', () => {
      let mocker = mockerParser.getMockerByName('demo_02');

      expect(mocker).to.be.undefined;
    });

    it('mockerParser.getMockerByName(\'demo_02_renamed\') should return correct mocker', () => {
      let mocker = mockerParser.getMockerByName('demo_02_renamed');

      expect(mocker).to.be.an.instanceof(Mocker);
      expect(mocker.name).to.equal('demo_02_renamed');
      expect(mocker.mockModuleList).to.have.lengthOf(5);
    });

    it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'error\') should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'error');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('error');

      return mockModule.getResult()
        .then((data) => {
          expect(data).to.eql({
            errCode: 100000
          });
        });
    });

    it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_1\') should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_1');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('success_1');

      return mockModule.getResult()
        .then((data) => {
          expect(data).to.eql({
            'result': {
              'other': 'other',
              'result': 1
            },
            'retcode': 0
          });
        });
    });

    it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_2\') should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_2');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('success_2');

      return mockModule.getResult()
        .then((data) => {
          expect(data).to.eql({
            'result': 2
          });
        });
    });

    it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_3_renamed\') should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_3_renamed');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('success_3_renamed');

      return mockModule.getResult()
        .then((data) => {
          expect(data).to.eql({
            'result': 3
          });
        });
    });

    it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_4\') should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_4');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('success_4');

      return mockModule.getResult()
        .then((data) => {
          expect(data).to.equal(4);
        });
    });
    it('mockerParser.getMockModuleByName(\'demo_02_renamed\', \'success_4\') with param should return correct mockModule', () => {
      let mockModule = mockerParser.getMockModuleByName('demo_02_renamed', 'success_4');

      expect(mockModule).to.be.an.instanceof(MockModule);
      expect(mockModule.name).to.equal('success_4');

      return mockModule.getResult({ a: 110 })
        .then((data) => {
          expect(data).to.equal('from_param_110');
        });
    });
  });

  describe('check getMockerByRoute', () => {
    it('should return demo_01', () => {
      let mocker = mockerParser.getMockerByRoute('/cgi-bin/a/b/demo_01');

      expect(mocker).to.be.an.instanceof(Mocker);
      expect(mocker.name).to.equal('demo_01');
    });

    it('should return null', () => {
      let mocker = mockerParser.getMockerByRoute('/cgi-bin/a/b/demo_not_exist');

      expect(mocker).to.be.null;
    });

    it('should return demo_02', () => {
      let mocker = mockerParser.getMockerByRoute('/cgi-bin/a/b/demo_02');

      expect(mocker).to.be.an.instanceof(Mocker);
      expect(mocker.name).to.equal('demo_02_renamed');
    });
  });

  describe('check getResInfoByRoute', () => {
    it('demo_01 ok', () => {
      let resInfo = mockerParser.getResInfoByRoute('/cgi-bin/a/b/demo_01');

      expect(resInfo).to.have.all.keys('mockerItem', 'mockModuleItem', 'moduleFullPath', 'params');
      expect(resInfo.mockerItem.name).to.equal('demo_01');
      expect(resInfo.mockModuleItem.name).to.equal('error');
    });

    it('should return null', () => {
      let mocker = mockerParser.getResInfoByRoute('/cgi-bin/a/b/demo_not_exist');

      expect(mocker).to.be.null;
    });

    it('demo_02 ok', () => {
      let resInfo = mockerParser.getResInfoByRoute('/cgi-bin/a/b/demo_02');

      expect(resInfo).to.have.all.keys('mockerItem', 'mockModuleItem', 'moduleFullPath', 'params');
      expect(resInfo.mockerItem.name).to.equal('demo_02_renamed');
      expect(resInfo.mockModuleItem.name).to.equal('success_1');
    });
  });

  describe('check getReadMeContent', () => {
    it('should return correct', () => {
      let content = mockerParser.getReadMeContent('demo_03');

      expect(content).to.equal('<h1 id="demo_03-">demo_03 用户信息查询接口</h1>\n<p>该接口用于查询用户的信息。</p>\n<p><img src="demo_03/static/logo.jpg" alt=""></p>\n<h2 id="-">接口说明</h2>\n<blockquote>\n<p>详见 xxx 地址。目前该接口由 xxx 同学维护。</p>\n</blockquote>\n<h3 id="-">入参格式</h3>\n<table>\n<thead>\n<tr>\n<th>参数名称</th>\n<th>类型</th>\n<th>是否必须</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>uid</td>\n<td>int</td>\n<td>true</td>\n<td>| 用户ID</td>\n<td></td>\n</tr>\n<tr>\n<td>type</td>\n<td>int</td>\n<td>false</td>\n<td>0</td>\n<td>0=简单信息，1=丰富数据</td>\n</tr>\n</tbody></table>\n<h3 id="-">返回格式</h3>\n<p>略</p>\n<h3 id="-">流程图</h3>\n<p><img src="demo_03/static/sub/workflow.png" alt=""></p>\n');
    });
  });
});

