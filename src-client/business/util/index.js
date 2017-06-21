function getUrl(url, query) {
  return url + (url.indexOf('?') > -1 ? '&' : '?') + param(query);
}

function param(obj) {
  let str = [];
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      let v = typeof obj[k] !== 'undefined' ? obj[k] : '';
      str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
}

module.exports = {
  getUrl: getUrl,
  param: param,
};