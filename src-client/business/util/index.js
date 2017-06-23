function getUrl(url, query) {
  let queryStr = param(query);

  if (!queryStr) {
    return url
  }

  return url + (url.indexOf('?') > -1 ? '&' : '?') + queryStr;
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