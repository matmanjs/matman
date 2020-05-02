# matman-crawler

[matman](https://github.com/matmanjs/matman) 端对端测试方案中使用到的前端爬虫处理工具，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

## 1. 安装

```
$ npm install matman-crawler --save
```

## 2. 功能介绍

### 2.1 将多个文件打包成一个单文件

nightmare 提供了 [custom preload script](https://github.com/segmentio/nightmare#custom-preload-script) 的能力，支持注入一个单文件脚本（我们称之为**前端爬虫脚本**）。

但我们开发时，大多时候是基于 CommonJS 规范来组织项目，存在多个组件和多个文件。因此，基于 webpack3， 我们开发了这个工具来将源代码打包成一个文件。

### 2.2 可配置注入 jQuery

为了更好的爬取 DOM 上的信息，我们构建前端爬虫脚本时，如果传递 `crawlerInjectJQuery` 值为 `true` ，则将注入 [jQuery 3.3.1 slim 版本](https://github.com/matmanjs/matman/blob/master/packages/matman-crawler/asserts/jquery.slim.min.js)。这样在写前端爬虫脚本时，可以直接用 jQuery 了。

### 2.3 已自动注入了 nightmare 需要的前置脚本

按照 [custom preload script](https://github.com/segmentio/nightmare#custom-preload-script) 的要求，注入脚本中必须加上一段特殊的代码，以便于与 electron 通信。我们已经在打包时进行了自动处理，已注入了 [nightmare-preload.js](https://github.com/matmanjs/matman/blob/master/packages/matman-crawler/asserts/nightmare-preload.js) 。

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

