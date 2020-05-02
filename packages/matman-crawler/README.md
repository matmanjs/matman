# matman-crawler

[matman](https://github.com/matmanjs/matman) 端对端测试方案中使用到的前端爬虫处理工具，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

## 1. 安装

```
$ npm install matman-crawler --save
```

## 2. 功能介绍

### 2.1 将多个文件打包成一个单文件

nightmare 提供了 [custom preload script](https://github.com/segmentio/nightmare#custom-preload-script) 的能力，支持注入一个单文件脚本（我们称之为**前端爬虫脚本**）。

但是它有两个限制：

- 只支持加载**一个文件**
- 只支持加载**本地文件**，不能加载网络请求回来的文件

而实际情况时，我们更倾向于使用 CommonJS 规范来组织项目，自然会存在多个组件和多个文件的情况。因此，基于 webpack3，我们开发了这个工具来将源代码打包成一个独立的文件。

### 2.2 可配置注入 jQuery

为了更好地爬取 DOM 上的信息，我们构建前端爬虫脚本时，如果传递 `crawlerInjectJQuery` 值为 `true` ，则将注入 [jQuery 3.3.1 slim 版本](https://github.com/matmanjs/matman/blob/master/packages/matman-crawler/asserts/jquery.slim.min.js)。这样在写前端爬虫脚本时，可以直接用 jQuery 了。

### 2.3 已自动注入了 nightmare 需要的前置脚本

按照 [custom preload script](https://github.com/segmentio/nightmare#custom-preload-script) 的要求，注入脚本中必须加上一段特殊的代码，以便于与 electron 通信。我们已经在打包时进行了自动处理，已注入了 [nightmare-preload.js](https://github.com/matmanjs/matman/blob/master/packages/matman-crawler/asserts/nightmare-preload.js) 。

## 3. API 说明

### 3.1 CrawlerParser 类

前端爬虫脚本处理类。

#### 3.1.1 constructor(matmanConfig)

- `matmanConfig`: `MatmanConfig`， 参考 [matman 组件](https://www.npmjs.com/package/matman)

#### 3.1.2 getEntry()

获得传递给 webpack 的 `entry` 配置，用于构建之用。返回一个对象。

根据配置的 `matmanConfig.crawlerMatch` 进行正在匹配，自动获取前端爬虫脚本的构建配置，其结果类似：

```
{
    'crawlers/c1': path.join(matmanConfig.testerPath, 'crawlers/c1.js'),
    'crawlers/c2': path.join(matmanConfig.testerPath, 'crawlers/c2.js'),
    'p1/crawlers/c1': path.join(matmanConfig.testerPath, 'p1/crawlers/c1.js'),
    'p1/crawlers/p11': path.join(matmanConfig.testerPath, 'p1/crawlers/p11.js'),
    'p1/crawlers/p12': path.join(matmanConfig.testerPath, 'p1/crawlers/p12.js')
}
```

#### 3.1.2  getEntryName(fullPath)

根据完整的源文件绝对路径 `fullPath``，反查其在 `entry` 中 key 值。

例如根据上面的 `entry` 结果，则调用 `getEntryName(path.join(matmanConfig.testerPath, 'crawlers/c1.js'))` 会返回 `crawlers/c1` 的结果。


#### 3.1.3 getCrawlerScriptPath(srcPath)

通过 crawler script 的源文件路径 `srcPath` ，获得其构建之后的文件路径。

例如根据上面的 `entry` 结果，则调用 `getCrawlerScriptPath(path.join(matmanConfig.testerPath, 'crawlers/c1.js'))` 会返回 `path.join(matmanConfig.crawlerBuildPath, 'crawlers/c1.js')` 的结果。


### 3.2 build(matmanConfig)

利用 webpack 按照规则进行构建。构建完成之后会生成构建文件。

- `matmanConfig`: `MatmanConfig`， 参考 [matman 组件](https://www.npmjs.com/package/matman)

