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

  let value = url
    .match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'))
    ? decodeURIComponent(RegExp.$2) : '';

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
function param(obj = {}) {
  var str = [];

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var v = typeof obj[k] !== 'undefined' ? obj[k] : '';
      str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }

  return str.join('&');
}

module.exports = {
  query: query,
  param: param
};

console.log(param({ a: 1, b: { c: 1 } }));