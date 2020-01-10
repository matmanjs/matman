# matman

[matman](https://github.com/matmanjs/matman) 端对端测试方案中的核心操作库。

## 1. 安装

```
$ npm install matman --save
```

## 2. API

### 2.1 CaseParser 类

测试用例处理类。每一个测试用例都是一个 CaseParser 对象。

#### 2.1.1 constructor(rootPath, opts)

- `rootPath`: `String`， 测试用例的脚本目录，必填项
- `opts`: 额外参数

#### 2.1.2 getCrawlerScriptPath(relativePath)

获得构建之后的爬虫脚本文件的绝对路径路径。

`relativePath` 是一个相对路径，而返回的是该文件的绝对路径。在确定 `relativePath` 值时，可以参考 CommonJS 规范中的 `require` 方法。

```javascript

const { CaseParser } = require('matman');
const caseParser =  new CaseParser(__dirname);

// 获取 crawlerScript 爬虫脚本路径，返回构建之后文件的绝对路径，例如： /user/xxx/yyy/crawlers/get-page-info
const crawlerScriptPath = caseParser.getCrawlerScriptPath('../../crawlers/get-page-info');

```

#### 2.1.3 handleOperate(pageUrl, crawlerScriptPath, opts = {}, callAction)

模拟用户进行交互操作。

请求参数：

- `pageUrl`：`String`，必填，页面的 URL 地址
- `crawlerScriptPath`：`String`，必填，运行在浏览器中的前端爬虫脚本的绝对路径，建议使用 `getCrawlerScriptPath(relativePath)` 方法来动态获取
- `opts`：`Object`，额外参数
  - `opts.show`：`Boolean`，运行时的无头浏览器是否需要可见，默认为 `false`，即隐藏在后台运行
  - `opts.proxyServer`：`String`，代理服务器，例如 `127.0.0.1:8899`，或者 `my_proxy_server.example.com:8080` ，会直接透传给 [nightmare 的 switches 配置项](https://github.com/segmentio/nightmare#switches) 中的 `proxy-server` 字段
  - `opts.wait`：`String | Number`，wait 配置，会直接透传给 [nightmare 的 wait 配置项](https://github.com/segmentio/nightmare#waitms)
  - `opts.doNotEnd`：`Boolean`，是否在执行完成之后不要关闭浏览器，默认为 `false`
  - `opts.cookie`：`String`，为浏览器注入cookie，格式与 `document.cookie` 一致
  - `opts.mockstarQuery`：`Object`，指定 mockstar 的query参数，用于数据打桩，为 [mockstar](https://www.npmjs.com/package/mockstar) 中的 `MockStarQuery` 对象
  - `opts.screenshot`：`String | Boolean | Object`，截图设置，如果是 `Object` 值，则需要包含 `path` 和 `clip` 两个属性，处理之后会直接透传给 [nightmare 的 screenshot 配置项](https://github.com/segmentio/nightmare#screenshotpath-clip)
  - `opts.device`：`String | Object`，设备设置，如果是 `Object` 值，则需要包含 `name`、 `UA`、 `width` 和 `height` 两个属性，处理之后会直接透传给 [nightmare-handler 的 exDevice 配置项](https://github.com/helinjiang/nightmare-handler/blob/HEAD/docs/exDevice.md)
- `callAction`：`Function`，定义用户交互行为的函数，接受一个 `BaseHandle` 对象参数

返回一个 `Promise`， `resolve` 返回的值为 `CaseParserOperateResult` 对象，除了包含了 `{data: Array, _dataIndexMap:Object, globalInfo: Object}` ，同时提供了以下方法：

- `get(key)` ，获得指定自定义行为名字的数据结果
- `getQueue()`，获得所有的事件结果
- `getNetwork(resourceType)`，获得指定 `resourceType` 的网络请求列表，若 `resourceType` 为空，则返回所有。`resourceType` 目前支持八种：`mainFrame`、`subFrame`、`stylesheet`、`script`、`image`、`object`、`xhr`、`other`
- `isExistInNetwork(partialURL, query, resourceType)`，从网络请求列表过滤出匹配的结果
- `isExistPage(partialURL, query)`，从网络请求列表过滤出匹配的结果，且指定 `resourceType` 为 `mainFrame`
- `isExistXHR(partialURL, query)`，从网络请求列表过滤出匹配的结果，且指定 `resourceType` 为 `xhr`
- `isExistLogInPage(key)`，从页面log日志中滤出匹配结果


#### 3.1.4 handleScan(pageUrl, crawlerScriptPath, opts, delayBeforeClose)

获取页面信息，适合无交互行为的场景。

请求参数和返回请参考 `handleOperate` 方法，也是返回一个 `Promise`， 但 `resolve` 返回的值结构为 `{data: Object, globalInfo: Object}` 。

另外定义了一个 `delayBeforeClose` 参数，该值会在 `opts.useRecorder` 为 `true` 时启用，用于延迟关闭窗口，以便能够完整收集一些异步请求信息。

它本质上是 `handleOperate` 的一个特殊场景，近似等效于：

```
return this.handleOperate(pageUrl, crawlerScriptPath, opts, (testAction) => {
    // scan 行为是一种特殊的操作，因为它只有一个行为，且结果也不再是数组
    testAction.addAction(function (nightmareRun) {
        return nightmareRun.wait(opts.wait || 500);
    });
})
```
