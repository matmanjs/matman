class MatmanPluginTest {
  constructor(opts) {
    this.opts = opts;
  }

  collect() {
    // 从 this.opts.source 路径下自动识别出配置了多少个代理
    // this.addProxyConfig('filename', 'require-file');
    // this.addProxyConfig('filename', 'require-file');
    // this.addProxyConfig('filename', 'require-file');
  }
}

class TestRunner{
  constructor(queryMap) {

    this.queryMap = queryMap;
  }
}

module.exports = {
  MatmanPluginTest,
  TestRunner
};
