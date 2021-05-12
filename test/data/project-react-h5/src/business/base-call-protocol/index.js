function getUrl(url, param) {
  if (param) {
    url = url + (url.match(/\?/) ? '&' : '?') + getParam(param);
  }
  return url;
}

function getParam(obj) {
  var str = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var v = typeof obj[k] !== 'undefined' ? obj[k] : '';
      str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
}

export function callByLocaiton(url, param) {
  url = getUrl(url, param);
  window.location = url;
  return url;
}

export function callByIframe(url, param) {
  url = getUrl(url, param);
  const iframe = document.createElement('iframe'),
    body = document.getElementsByTagName('body')[0];

  body.appendChild(iframe);

  const style = {
    position: 'fixed',
    zIndex: -1,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    border: 'none',
    opacity: 0,
    visibility: 'hidden'
  };
  for (let k in style) {
    iframe.style[k] = style[k];
  }
  iframe.src = url;

  setTimeout(function () {
    try {
      // 有可能某些情况下执行 jsbridge，但是在 2s 内用户可能跳走，
      // 如果 webview 本身未做释放，则可能会继续执行该逻辑，从而导致出错
      if (body && body.removeChild) {
        body.removeChild(iframe);
      }
    } catch (e) {

    }
  }, 2000);

  return url;
}
