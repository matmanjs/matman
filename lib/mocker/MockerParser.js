'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var fsHandler = require('fs-handler');
var _ = require('lodash');
var marked = require('marked');
var store = require('../store');
var TARGET_FIELD = '_m_target';

var MockerParser = function () {
  /**
   * 构造函数
   *
   * @param {Object} opts 参数
   * @param {String} opts.basePath mocker的根目录
   * @param {String} opts.dataPath 数据存储的根目录
   * @param {Array} [opts.matmanMockers] MatmanMocker 列表
   */
  function MockerParser(opts) {
    _classCallCheck(this, MockerParser);

    this.basePath = opts.basePath;
    this.matmanMockers = Array.isArray(opts.matmanMockers) ? [].concat(_toConsumableArray(opts.matmanMockers)) : [];

    if (opts.dataPath) {
      this.dataPath = opts.dataPath;

      // 注意此处一定要保证存储数据的地址是可存在的，否则会保存失败。
      fse.ensureDirSync(this.dataPath);

      this.db = store.getDB(path.join(this.dataPath, 'db.json'));
    }
  }

  /**
   * 获取所有的 mocker 信息
   *
   * @param {Boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
   * @return {Array}
   */


  _createClass(MockerParser, [{
    key: 'getAllMocker',
    value: function getAllMocker(isReset) {
      var _this = this;

      var mockerList = [];

      // 1. 获取所有的 mocker，约定：this.basePath 的每个子目录都是一个独立的 mocker
      fsHandler.search.getAll(this.basePath, { globs: ['*'] }).forEach(function (item) {
        // 限制只处理文件夹类型的，不允许在 basePath 目录下有非文件夹的存在
        if (!item.isDirectory()) {
          console.error(path.join(item.basePath, item.relativePath) + ' SHOULD BE Directory!');
          return;
        }

        // 模块名字，默认取文件名，
        // 在根目录下，每个子文件夹就是一个 mocker 单位，其名字即为文件夹名字
        // let name = path.basename(item.relativePath);
        // console.log('\n找到 mocker ：', name, item);

        // 获得 require 这个模块的相对路径
        var requirePath = getRequirePath(path.join(_this.basePath, item.relativePath));
        // console.log('requirePath ：', requirePath);

        var mockerItem = require(requirePath);

        // 更新用户操作历史记录
        if (_this.db) {
          // 更新数据
          var cacheMockerItem = _this.db.get('data').find({ name: mockerItem.name }).value();

          // 如果存在记录，则更新两个字段即可
          if (cacheMockerItem) {
            mockerItem.updateConfig({
              disable: cacheMockerItem.config.disable,
              activeModule: cacheMockerItem.config.activeModule
            });
          }
        }

        mockerList.push(mockerItem);
      });

      // TODO 2018/6/2 helinjiang: 如果isReset=true，则还需要及时更新到 this.matmanMockers
      // TODO 2018/6/2 helinjiang: 还要返回 this.matmanMockers 中数据

      if (this.db) {
        // 存储到本地缓存数据文件内，以便下次启动时能够记录上一次的操作
        this.db.setState({
          mockServerPath: this.basePath,
          dataPath: this.dataPath,
          data: mockerList
        }).write();
      }

      return mockerList;
    }

    /**
     * 通过名字获取指定的 mocker
     *
     * @param {String} mockerName 名字
     * @param {Boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Object} MatmanMocker 对象
     */

  }, {
    key: 'getMockerByName',
    value: function getMockerByName(mockerName, isReset) {
      var mockerList = this.getAllMocker(isReset);

      return mockerList.filter(function (item) {
        return item.name === mockerName;
      })[0];
    }

    /**
     * 通过路由及请求参数获取 mocker 的信息
     *
     * @param {String} route 路由规则
     * @param {Object} [params] 请求的参数
     * @return {Object}
     */

  }, {
    key: 'getMockerByRoute',
    value: function getMockerByRoute(route) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var allMockerList = this.getAllMocker();
      var paramsKeyLength = Object.keys(params).length;

      var matchedArr = [];

      allMockerList.forEach(function (item) {
        var mockerConfig = item.config || {};

        // 如果连 route 都没匹配，则无需后续处理
        if (route !== mockerConfig.route) {
          return;
        }

        var obj = {
          match: 1,
          data: item
        };

        var routeExtra = mockerConfig.routeExtra || {},
            routeExtraKeys = Object.keys(routeExtra),
            routeExtraKeyLength = routeExtraKeys.length;

        // 如果 routeExtra 为空，则放入数组中之后，无须再后续处理
        if (!routeExtraKeyLength) {
          matchedArr.push(obj);
          return;
        }

        // 如果 routeExtra 不为空，但请求参数为空，则肯定是匹配失败了的，无须放入数组
        if (routeExtraKeyLength && !paramsKeyLength) {
          return;
        }

        var isExistNotMatchedField = false;

        // 如果 routeExtra 不为空，且请求参数也为空，则为其计算匹配度
        routeExtraKeys.forEach(function (routeExtraKey) {
          // 注意，这里都转化为字符串来比较
          if (routeExtra[routeExtraKey] + '' === params[routeExtraKey] + '') {
            obj.match++;
          } else {
            // 如果定义了 routeExtra，就要全匹配，有一个不匹配都不行
            isExistNotMatchedField = true;
          }
        });

        if (!isExistNotMatchedField) {
          matchedArr.push(obj);
        }
      });

      return matchedArr.length ? matchedArr.sort(function (a, b) {
        return b.match - a.match;
      })[0].data : null;
    }

    /**
     * 通过名字获取指定的 mock module
     *
     * @param {String} mockerName mocker 名字
     * @param {String} mockModuleName mock module 名字
     * @param {Boolean} [isReset] 是否为重置，如果为 true，则将忽略缓存数据
     * @return {Object} MatmanMockModule 对象
     */

  }, {
    key: 'getMockModuleByName',
    value: function getMockModuleByName(mockerName, mockModuleName, isReset) {
      var mocker = this.getMockerByName(mockerName, isReset);

      // 有可能找不到 mocker
      if (!mocker) {
        console.error('Can not find mock module!', mockerName, mockModuleName);
        return null;
      }

      return mocker.mockModuleList.filter(function (item) {
        return item.name === mockModuleName;
      })[0];
    }

    /**
     * 通过路由匹配及请求参数获得响应数据
     *
     * @param {String} route 路由规则
     * @param {Object} [params] 请求的参数
     * @return {Object}
     */

  }, {
    key: 'getResInfoByRoute',
    value: function getResInfoByRoute(route) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // 1. 获得当前的 mocker 信息
      var mockerItem = this.getMockerByRoute(route, params);

      if (!mockerItem) {
        return null;
      }

      // 2. 获得当前最适合的 mock module
      // 优先获取 param 中请求的指定 mock_module，其次是 mocker.config.activeModule
      var mockModuleName = params[TARGET_FIELD] || mockerItem.config.activeModule;

      var mockModuleItem = this.getMockModuleByName(mockerItem.name, mockModuleName);

      if (!mockModuleItem) {
        return null;
      }

      // 3. 获得 mock module 的绝对路径
      // 目标模块的路径，需要注意下 no module 的场景
      var moduleRelativePath = mockModuleItem.type && mockModuleItem.type === 'noModule' ? mockModuleItem.fileName : path.join('mock_modules', mockModuleName);

      var moduleFullPath = path.join(this.basePath, mockerItem.name, moduleRelativePath);

      // 4. 获得所有的请求参数
      // 还有部分参数在 mock_module 的 query 字段中，需要合并请求
      var reqParams = _.merge({}, mockModuleItem.query, params);

      return {
        mockerItem: mockerItem,
        mockModuleItem: mockModuleItem,
        moduleFullPath: moduleFullPath,
        params: reqParams
      };
    }

    /**
     * 更新 mocker 的 信息
     *
     * @param {String} mockerName handler 名字
     * @param {Object} [updateData] 要更新的数据
     */

  }, {
    key: 'updateMocker',
    value: function updateMocker(mockerName, updateData) {
      var oldMockerItem = this.getMockerByName(mockerName);

      var newMockerItem = _.merge({}, oldMockerItem, updateData);

      // 更新数据
      this.db.get('data').find({ name: mockerName }).assign(newMockerItem).write();

      // 返回新的结果
      return newMockerItem;
    }

    /**
     * 获取指定 mocker 的 README 信息
     *
     * @param {String} mockerName
     */

  }, {
    key: 'getReadMeContent',
    value: function getReadMeContent(mockerName) {
      var mockerItem = this.getMockerByName(mockerName);
      if (!mockerItem) {
        return '异常错误，找不到对应信息！handlerName=' + mockerName;
      }

      // README.md 的绝对路径
      var mockerReadMeFile = path.join(mockerItem.basePath, 'README.md');
      if (!fs.existsSync(mockerReadMeFile)) {
        return '';
      }

      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
      });

      try {
        var content = fs.readFileSync(mockerReadMeFile, 'utf8');

        content = content.replace(/__STATIC_PATH__/g, mockerName + '/static');

        return marked(content);
      } catch (e) {
        return e.stack;
      }
    }
  }]);

  return MockerParser;
}();

/**
 * 获得传递给 require 的模块路径，相对于当前文件
 *
 * @param {String} absolutePath 绝对路径
 * @returns {String}
 */


function getRequirePath(absolutePath) {
  // 获得 require 这个模块的相对路径
  var relativePath = path.relative(__dirname, absolutePath);

  // 注意，path.relative 方法返回的结果中，如果是相对当前目录的，则其会把 './' 去掉，
  // 例如， './path/a/b' 会被返回 'path/a/b'
  // 此时如果 require('path/a/b') ，node 会先去 node_modules 模块寻找，
  // 而不是当前目录去寻找，修改为 require('./path/a/b') 就不会有这样问题，
  // 因此，这种情况下一定要补上一个 './'，
  if (relativePath.indexOf('..') < 0) {
    relativePath = './' + relativePath;
  }

  // 需要将“\”替换为“/”，因为 require 语法中模块的路径是以 "/" 来分目录层级的
  return relativePath.replace(/\\/gi, '/');
}

module.exports = MockerParser;