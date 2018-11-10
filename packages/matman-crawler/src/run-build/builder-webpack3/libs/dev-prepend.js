function loadScript(url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');

  script.type = 'text/javascript';
  script.onreadystatechange = function () {
    if (script.readyState == 'complete') {
      callback();
    }
  };
  script.onload = function () {
    callback();
  };

  script.src = url;
  head.appendChild(script);
}

console.log('[matman] jQuery loading...');

loadScript('//cdn.bootcss.com/jquery/3.3.1/jquery.min.js', function () {
  console.log('[matman] jQuery is loaded!');
  console.log('[matman] 脚本加载完成，您可手动运行 window.getPageInfo() 方法获得结果！');

  console.log(window.getPageInfo());
});