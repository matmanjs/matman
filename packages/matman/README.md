# matman

[matman](https://github.com/matmanjs/matman) 端对端测试方案中的核心操作库。

## 1. 安装

```
$ npm install matman --save
```

## 2. API

### 2.1 CaseParser 类

测试用例处理类。每一个测试用例都是一个 CaseParser 对象。

#### 3.1.1 constructor(rootPath, opts)

- `rootPath`: `String`， 测试用例的脚本目录，必填项
- `opts`: 额外参数

#### 3.1.2 getCrawlerScriptPath(relativePath) 

由于 nightmare 中的 `preload script` 加载单文件时，只支持绝对路径，但我们的源代码中一般是用相对路径的。因此该方法可以支持传入一个相对路径，返回构建之后的单文件绝对路径。

该方法的作用与 CommonJS 规范中的 `require` 是一样的。

```javascript

const { CaseParser } = require('matman');
const caseParser =  new CaseParser(__dirname);

// 获取 crawlerScript 爬虫脚本路径，返回构建之后文件的绝对路径，例如： /user/xxx/yyy/crawlers/get-page-info
const crawlerScriptPath = caseParser.getCrawlerScriptPath('../../crawlers/get-page-info');

```

#### 3.1.3 handleOperate(pageUrl, crawlerScriptPath, opts = {}, callAction)

模拟用户进行交互操作。

请求参数：

- `pageUrl`：`String`，页面的 URL 地址
- `crawlerScriptPath`：`String`，运行在浏览器中的前端爬虫脚本，需要是绝对路径
- `opts`：`Object`，额外参数
  - `opts.show`：`Boolean`，是否需要展示浏览器，默认为 `false`
  - `opts.proxyServer`：`String`，代理服务器，例如 `127.0.0.1:8899`
  - `opts.wait`：`String | Number`，wait 配置，会直接透传给 nightmare 的 `wait` 配置项，详细请查看 https://github.com/segmentio/nightmare#waitms
  - `opts.doNotEnd`：`Boolean`，是否在执行完成之后不要关闭浏览器，默认为 `false`
  - `opts.cookie`：`String`，为浏览器注入cookie，格式与 `document.cookie` 一致
  - `opts.mockstarQuery`：`Object`，指定 mockstar 的query参数，用于数据打桩
  - `opts.screenshot`：`String | Boolean | Object`，截图设置
  - `opts.device`：`String | Object`，设备设置
- `callAction`：`Function`，定义用户交互行为的函数，接受一个 `BaseHandle` 对象参数

返回一个 `Promise`。


#### 3.1.4 handleScan(pageUrl, crawlerScriptPath, opts)

获取页面信息，适合无交互行为的场景。

请求参数和返回请参考 `handleOperate` 方法。它本质上是 `handleOperate` 的一个特殊场景。
