'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取查询参数
 * @param {String} name 查询参数
 * @param {String} [url] 链接地址
 * @return {String}
 */
function query(name, url) {
  if (!url) {
    if (typeof location === 'undefined' || !location.search) {
      return '';
    }

    url = location.search;
  }

  var value = url.match(new RegExp('(\\??|&)' + name + '=([^&]*)(&|$)')) ? decodeURIComponent(RegExp.$2) : '';

  if (value.match(/<\/?script>/i)) {
    // 自动去除特殊标签，避免 xss 共计
    value = value.replace(/<\/?script>/ig, '');
  }

  return value;
}

/**
 * 按照key/value对序列化普通对象。注意此处只支持浅层序列化，
 * 即 obj 字段的值不能够为对象，例如 {a:1,b:{c:1}} 就不行，但 {a:1,c:1} 就可以
 * @param {Object} obj
 * @return {String}
 */
function param() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var str = [];

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var v = typeof obj[k] !== 'undefined' ? obj[k] : '';
      str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }

  return str.join('&');
}

function param2() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var str = [];

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var v = typeof obj[k] !== 'undefined' ? obj[k] : '';
      str.push(encodeURIComponent(k) + '=' + encodeURIComponent((0, _stringify2.default)(v)));
    }
  }

  return str.join('&');
}

module.exports = {
  query: query,
  param: param
};

var p = param2({
  _matman: [{
    _m_name: 'demo_simple',
    _m_target: 'success',
    _m_disable: 0
  }, {
    _m_name: 'demo_simple2',
    _m_target: 'fail',
    _m_disable: 1
  }]
});

console.log(p);

console.log(1, query('_matman', p));
console.log(2, query('_m_target', '_m_target=success'));
console.log(3, query('_m_target', 'http://localhost:3000/cgi-bin/a/b/demo_simple?_m_target=success'));

console.log(decodeURIComponent(p));
//# sourceMappingURL=url.js.map