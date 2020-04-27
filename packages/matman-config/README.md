# matman-config

[matman](https://github.com/matmanjs/matman) 端对端测试方案中配置文件。

## 1. 安装

```
$ npm install matman-config --save
```

## 3. API 说明

### 3.1 CrawlerParser 类

前端爬虫脚本处理类。

#### 3.1.1 constructor(rootPath, opts)

- `rootPath`: `String`， 项目的根目录，必填项
- `opts`: 额外参数
  - `opts.testerPath`: `String`， 测试对象的根目录，默认值为 `path.resolve(rootPath, './src/testers')`
  - `opts.crawlerBuildPath`: `String`， 前端爬虫脚本构建之后的目录，默认值为 `path.resolve(rootPath, './build/crawler-script')`
  - `opts.crawlerMatch`: `RegExp`， 用于匹配是否为前端爬虫脚本的正则表达式，默认值为 `/[\/|\\]crawlers[\/|\\].*\.js$/`
  - `opts.crawlerInjectJQuery`: `Boolean`， 前端爬虫脚本中是否注入jQuery，默认值为 `true`
  - `opts.screenshotPath`: `String`， 屏幕截图保存的路径，默认值为 `path.resolve(rootPath, './build/screenshot')`
  - `opts.isDevBuild`: `Boolean`， 是否为开发模式，默认值为 `false`

#### 3.1.2 check()

检验参数是否合理，返回一个对象：

- `result`: `Boolean`， 校验结果，`true` 为通过校验
- `msg`: `String`， 当 `result` 为 `false` 时，该值提供了具体的错误信息


注意，在调用其他函数之前，必须先调用该方法校验。因为该方法会校验：

- `rootPath` 必须真实存在
- `testerPath` 必须真实存在

```javascript
const crawlerParser = new CrawlerParser(rootPath, config);

// 校验 crawlerParser 参数合法性
let checkResult = crawlerParser.check();
if (!checkResult.result) {
    throw new Error(checkResult.msg);
}

// do something else
```

#### 3.1.3 getEntry()

获得传递给 webpack 的 `entry` 配置。返回一个对象。


根据配置的 `crawlerMatch` 进行正在匹配，自动获取前端爬虫脚本的构建配置，其结果类似：

```
{
    'crawlers/c1': path.join(testerPath, 'crawlers/c1.js'),
    'crawlers/c2': path.join(testerPath, 'crawlers/c2.js'),
    'p1/crawlers/c1': path.join(testerPath, 'p1/crawlers/c1.js'),
    'p1/crawlers/p11': path.join(testerPath, 'p1/crawlers/p11.js'),
    'p1/crawlers/p12': path.join(testerPath, 'p1/crawlers/p12.js')
}
```

### 3.2 build(rootPath, config)

执行构建。参数说明请参考 CrawlerParser 类的 `constructor(rootPath, opts)`。

