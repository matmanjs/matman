# matman

[matman](https://github.com/matmanjs/matman) 端对端测试方案中的核心操作库，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

## 1. 安装

```
$ npm install matman --save
```

## 2. API

### 2.1 createPageDriver(caseModuleFilePath, opts)

创建 `PageDriver` 对象。

- `caseModuleFilePath`: `String`， 测试案例文件的绝对路径
- `opts`: 额外参数，传递给 `MatmanConfig` 和 `PageDriver` 使用


### 2.2 PageDriver 类

页面控制器。

#### 2.2.1 constructor(matmanConfig, caseModuleFilePath, opts)

- `matmanConfig`: `MatmanConfig`， 必填项
- `caseModuleFilePath`: `String`， 测试案例文件的绝对路径，必填项
- `opts`: 额外参数
  - `opts.doNotCloseBrowser`: `Boolean`， 是否在执行完成之后不要关闭浏览器，默认为 `false`
  - `opts.useRecorder`: `Boolean`， 是否使用记录器，若为 `true`，则在结果中会返回网络请求和浏览器事件等额外信息，默认为 `false`
  - `opts.tag`: `String`， 标记，在某些场景下使用，例如截图保存文件中追加该标记，用于做区分


#### 2.2.2 useNightmare(nightmareConfig)

> 支持链式调用。

使用 nightmare.js 框架来做端对端测试。

- `nightmareConfig`: `Object`， 可选项，传递给原生的 [Nightmare constructor](https://www.npmjs.com/package/nightmare#nightmareoptions) 的参数

#### 2.2.3 useProxyServer(proxyServer)

> 支持链式调用。

走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的；若不配置，则之前请求现网，亦可直接测试现网的服务。

- `proxyServer`: `String`， 代理服务器，格式为 `my_proxy_server.example.com:8080`，例如 `127.0.0.1:8899`


#### 2.2.3 useMockstar(mockstarQuery)

> 支持链式调用。

使用 [mockstar](https://github.com/mockstarjs/mockstar) 来做桩数据(假数据，mock 数据)。

- `mockstarQuery`: `MockStarQuery`，mockstar 方案中用于指定桩数据的请求对象


#### 2.2.4 changeMockstar(mockstarQuery)

> 支持链式调用。

切换 [mockstar](https://github.com/mockstarjs/mockstar) 的桩数据(假数据，mock 数据)。

- `mockstarQuery`: `MockStarQuery`，mockstar 方案中用于指定桩数据的请求对象


#### 2.2.5 setCookies(cookies)

> 支持链式调用。

注入 cookie。相关内容可以阅读 [nightmare-handler exCookies](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md)  。

当 `cookies` 为 `String` ，即格式与 `document.cookie` 输出形式一直，例如 `mykey1=myvalue1; mykey2=myvalue2` 。

当 `cookies` 为 `Object` 时，可以支持多个 cookie 键值对，例如 `{mykey1:'myvalue1', mykey2:'myvalue'}` 。


#### 2.2.6 setDeviceConfig(deviceConfig)

> 支持链式调用。

设置无头浏览器设备参数。相关内容可以阅读 [nightmare-handler exDevice](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md)  。

当 `deviceConfig` 为 `String` ，即为指定用哪种预定义的设备名字，默认值为 `mobile`

当 `deviceConfig` 为 `Object` 时：
- `deviceConfig.name`: `String`， 设备名字
- `deviceConfig.UA`: `String`， 是userAgent
- `deviceConfig.width`: `Number`， 视窗宽度
- `deviceConfig.height`: `Number`， 视窗高度，注意这里不是指页面的高度，页面高度要小于这个值


#### 2.2.7 setScreenshotConfig(screenshotConfig)

> 支持链式调用。

设置截屏参数。相关内容可以阅读 [nightmare#screenshotpath-clip](https://github.com/segmentio/nightmare#screenshotpath-clip) 。


当 `screenshotConfig` 为 `Boolean` ，且为 `true` 时，则将根据当前路径自动生成截图文件路径，推荐用该方式。

当 `screenshotConfig` 为 `String` ，即为截图保存的文件路径，绝对路径，例如 `/root/xyz.png`。

当 `screenshotConfig` 为 `Object` 时：
- `screenshotConfig.path`: `String`， 截图保存的文件路径，绝对路径，例如 `/root/xyz.png`，如果不填写，则将根据当前路径自动生成截图文件路径
- `screenshotConfig.clip`: `String`， 截图的区域，例如 `{ x: 0, y: 0, width: 0, height: 0 }`
- `screenshotConfig.tag`: `String`， 标记，会追加到 `screenshotConfig.path` 中，用作自定义的区分


#### 2.2.8 setCoverageConfig(coverageConfig)

> 支持链式调用。

设置覆盖率参数。

当 `coverageConfig` 为 `Boolean` ，且为 `true` 时，则将根据当前路径自动生成覆盖率文件路径，推荐用该方式。

当 `coverageConfig` 为 `String` ，即为覆盖率文件路径，绝对路径，例如 `/root/xyz.json`。

当 `coverageConfig` 为 `Object` 时：
- `coverageConfig.path`: `String`， 覆盖率文件路径，绝对路径，例如 `/root/xyz.json`，如果不填写，则将根据当前路径自动生成覆盖率文件路径
- `coverageConfig.tag`: `String`， 标记，会追加到 `coverageConfig.path` 中，用作自定义的区分


#### 2.2.9 setMatmanResultConfig(matmanResultConfig)

> 支持链式调用。

设置 `MatmanResult` 执行结果参数。

当 `matmanResultConfig` 为 `Boolean` ，且为 `true` 时，则将根据当前路径自动生成 `MatmanResult` 执行结果文件路径，推荐用该方式。

当 `matmanResultConfig` 为 `String` ，即为 `MatmanResult` 执行结果路径，绝对路径，例如 `/root/xyz.json`。

当 `matmanResultConfig` 为 `Object` 时：
- `matmanResultConfig.path`: `String`，  `MatmanResult` 执行结果文件路径，绝对路径，例如 `/root/xyz.json`，如果不填写，则将根据当前路径自动生成 `MatmanResult` 执行结果
- `matmanResultConfig.tag`: `String`， 标记，会追加到 `matmanResultConfig.path` 中，用作自定义的区分

#### 2.2.10 goto(pageUrl)

> 支持链式调用。

加载指定的页面地址。

- `pageUrl`: `String`，页面的 url 地址


#### 2.2.11 addAction(actionName, actionCall)

> 支持链式调用。

增加测试动作集。

- `actionName`: `String`，动作名称，后续可通过它来获得最后的数据
- `actionCall`: `Function`，执行函数，入参中接受一个 `nightmare` 对象，可以直接操作使用 [nightmare Interact with the Page](https://www.npmjs.com/package/nightmare#interact-with-the-page) 的方法

以下代码来自： [demo_02](https://github.com/matmanjs/matman/blob/refactor_4.1.0/packages/matman/test/data/hi-demo/demo_02/src/page_baidu_index/cases/search-check.js) :

```js
const matman = require('matman');

matman
    // 创建 PageDriver，页面驱动控制器
    .createPageDriver(__filename, opts)

    // 无头浏览器使用 nightmare.js 框架提供，其底层用的是 Google 的 electron，基于 chromium 内核
    .useNightmare({ show: opts.show })

    // 其他操作，省略
    // ....

    // 加载页面地址
    .goto('https://www.baidu.com')

    // 第一步：开始操作之前
    .addAction('init', function (nightmareRun) {
        // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
        return nightmareRun.wait(500);
    })

    // 第二步：搜索输入框输入: matman
    .addAction('input_key_word', function (nightmareRun) {
        // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
        return nightmareRun.type('#kw', 'matman').wait(500);
    })

    // 第三步：点击搜索按钮，获得搜索结果
    .addAction('click_to_search', function (nightmareRun) {
        return nightmareRun.click('#su').wait('#content_left');
    })

    //  其他操作，省略
    // ....

    // 结束，获取结果
    .end();
```

#### 2.2.12 wait(fn, ...args)

> 支持链式调用。

需要等待某些条件达成，才开始运行爬虫脚本，与 nightmare 的 wait 含义和用法一致。

- [.wait(selector)](https://www.npmjs.com/package/nightmare#waitselector) : 等待某个元素出现，最常用 ，例如 `.wait('#pay-button')` 
- [.wait(ms)](https://www.npmjs.com/package/nightmare#waitms) : 等待多少 `ms` ，例如 `.wait(5000)` 
- [.wait(fn[, arg1, arg2,...])](https://www.npmjs.com/package/nightmare#waitfn-arg1-arg2) : 使用函数来判断条件 


#### 2.2.13 evaluate(fn, ...args)

> 支持链式调用。

执行爬虫脚本或者方法。

当 `fn` 为 `String` 时，即代表的是加载本地的爬虫脚本文件，支持绝对路径和相对路径，如果是相对路径，则其相对于当前文件而言，可以等效于 `require` 的语法。 **特别注意的是，本地的爬虫脚本文件，是通过 `matman build` 命令构建产生的，因此该场景下一定要先提前构建出本地的爬虫脚本文件，否则会出错** 。

当 `fn` 为 `Function` 时，则与 nightmare 的 evaluate 含义和用法一致，详见 [nightmare .evaluate(fn[, arg1, arg2,...])](https://www.npmjs.com/package/nightmare#evaluatefn-arg1-arg2) 。


#### 2.2.14 executeCustomFn(customFn)

> 支持链式调用。

执行自定义的方法，适用于 debug 和自定义扩展等场景。

- `customFn`: `Function`，入参中接受一个 `PageDriver` 对象

```js
const matman = require('matman');

matman 
    //  其他操作，省略
    // ....

    // 执行自定义的方法
    .executeCustomFn((pageDriver) => {
        // 没有其他的意义，只是为了 debug
        if (opts.show) {
            console.log(pageDriver);
        }
    })

    //  其他操作，省略
    // ....
```

#### 2.2.15 end()

启动 PageDriver ，返回一个 `Promise` ，结果值为 `MatmanResult` 对象。


### 2.3 MatmanResult 类

#### 2.3.1 constructor(result)

- `data`: `Array | Object`，数据快照，如果使用 `addAction(actionName, actionCall)` 追加的测试动作，则该值为数组，可以通过 `get(actionName)` 获得指定动作的数据
- `globalInfo`: `Object`，网络请求和浏览器事件等全局信息


#### 2.3.2 get(actionName)

通过测试动作名字获得数据。

当 `actionName` 为 `String` 时，则该名字来自 `addAction(actionName, actionCall)` 定义的名字。

当 `actionName` 为 `Number` 时，则其相对于数组索引，会从 `matmanResult.data` 这个数组中获取。


#### 2.3.3 getQueue()

获得捕获到的请求队列。返回一个数组，数组元素为网络请求和浏览器事件等信息。


#### 2.3.4 getNetwork(resourceType)

从结果队列中过滤出网络请求。


`resourceType` 详见 [nightmare-handler RESOURCE_TYPE](https://github.com/helinjiang/nightmare-handler/blob/master/src/models/response-detail.js) ，即：

```js
const RESOURCE_TYPE = {
    MAIN_FRAME: 'mainFrame',
    SUB_FRAME: 'subFrame',
    STYLESHEET: 'stylesheet',
    SCRIPT: 'script',
    IMAGE: 'image',
    OBJECT: 'object',
    XHR: 'xhr',
    OTHER: 'other'
};
```

#### 2.3.5 isExistInNetwork(partialURL, query = {}, resourceType, status)

根据条件，从网络请求中匹配指定的请求。

- `partialURL`: `String`，用于匹配的部分url
- `query`: `Object`，请求携带的 query 参数
- `resourceType`: `String`，资源类型
- `status`: `Number`，http 状态码

#### 2.3.6 isExistPage(partialURL, query = {}, status)

根据条件，从网络请求中匹配指定的请求，等效于 `isExistInNetwork(partialURL, query, 'mainFrame', status)`。

使用场景：
- 测试跳转页面的场景，通过它可以判断是否加载了目标的页面

#### 2.3.7 isExistXHR(partialURL, query = {}, status)

根据条件，从网络请求中匹配指定的请求，等效于 `isExistInNetwork(partialURL, query, 'xhr', status)`。

使用场景：
- 测试接口请求是否正确，可以利用 `query` 来指定请求参数，确保不会发送一个错误的请求
- 利用 `status` 可以验证接口是否可能 `500` 等
- 有些数据上报也是用 `xhr` 的，可以测试数据上报的字段是否正确

#### 2.3.8 isExistImage(partialURL, query = {}, status)

根据条件，从网络请求中匹配指定的请求，等效于 `isExistInNetwork(partialURL, query, 'image', status)`。

使用场景：
- 测试是否加载了某张图片
- 利用 `status` 可以验证图片请求是否有可能 `404` 等

#### 2.3.9 isExistStylesheet(partialURL, query = {}, status)

根据条件，从网络请求中匹配指定的请求，等效于 `isExistInNetwork(partialURL, query, 'stylesheet', status)`。

使用场景：
- 测试是否加载了 `css` 文件
- 利用 `status` 可以验证 `css` 文件是否有可能 `404` 等

#### 2.3.10 isExistScript(partialURL, query = {}, status)

根据条件，从网络请求中匹配指定的请求，等效于 `isExistInNetwork(partialURL, query, 'script', status)`。

使用场景：
- 测试是否加载了 `js` 文件
- 利用 `status` 可以验证 `js` 文件是否有可能 `404` 等

#### 2.3.11 isExistJSBridge(partialURL, query = {})

是否存在某个 jsbridge 的调用，支持使用 iframe 和 location.href 两种形式，具体可以查看 https://github.com/matmanjs/matman-demo/tree/master/DevOps/matman-app/case_modules/page-hybrid-app。


#### 2.3.12 isExistConsole(partialURL, type, isFullMatch)

是否存在某一条 console 记录

- `partialText`: `String`，待匹配的字符串
- `type`: `String`，类型，例如 `console.log`，则 `type=log`
- `isFullMatch`: `Boolean`，是否将 `partialText` 作为全匹配，默认值为 `false`
