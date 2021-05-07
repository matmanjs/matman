class MatmanPluginPuppeteer {
  constructor(opts) {
    this.opts = opts;
    this.proxyConfigList = [];
  }

  collect() {
    // 从 this.opts.source 路径下自动识别出配置了多少个代理
    // this.addProxyConfig('filename', 'require-file');
    // this.addProxyConfig('filename', 'require-file');
    // this.addProxyConfig('filename', 'require-file');
  }
}

class CaseModule {
  constructor(opts) {
    this.filename = opts.filename;

    this.device = opts.device;
    this.networkCondition = opts.networkCondition;

    // TODO 需要支持 process.env.xxx 的方式来强制覆盖，便于临时调试 dev 和 prod 这不同类型的构建场景
    this.appRunner = opts.appRunner;
    this.mockRunner = opts.mockRunner;

    this.handler = opts.handler;
    this.crawler = opts.crawler;
  }

  async run(pageDriverOpts) {
    // 创建 PageDriver
    const pageDriver = await createPageDriver(pageDriverOpts);

    // 获取结果
    return pageDriver.evaluate(path.join(__dirname, './crawlers/get-page-info.js'));
  }
}

function createPageDriver() {
  // TODO 每一个用例启动之时，代理规则可能是不一样的，这个时候要求每次启动自动化测试之时，自动更新，可以考虑用多个 rule 来进行切换
  // matman 使用 whistle 做内置代理
}

// 通用参数怎么搞？例如是设置 cookie，设置 device 等

module.exports = {
  MatmanPluginPuppeteer,
  createPageDriver,
  CaseModule,
};
