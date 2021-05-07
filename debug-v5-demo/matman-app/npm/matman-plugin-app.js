class MatmanPluginApp {
  constructor(opts) {
    this.opts = opts;
    this.proxyConfigList = [];
  }

  addProxyConfig(name, getWhistleRuleCall) {
    this.proxyConfigList.push(new AppRunner(name, getWhistleRuleCall));
  }

  collect() {
    // 从 this.opts.source 路径下自动识别出配置了多少个代理
    // this.addProxyConfig('filename', 'require-file');
    // this.addProxyConfig('filename', 'require-file');
    // this.addProxyConfig('filename', 'require-file');
  }
}

class DefinedInstance {
  constructor(opts = {}) {
    this.rootPath = opts.rootPath;
    this.whistleRule = opts.whistleRule;
  }
}

module.exports = {
  MatmanPluginApp,
  DefinedInstance,
};
