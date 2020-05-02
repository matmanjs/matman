# matman

[matman](https://github.com/matmanjs/matman) 端对端测试方案中的核心操作库，更多资料请参考： https://matmanjs.github.io/matman/ 。

## 1. 安装

```
$ npm install matman --save
```

## 2. API

### 2.1 MatmanConfig 类

matman 方案中的配置文件，默认由项目中的 `matman.config.js` 提供。

#### 2.1.1 constructor(rootPath, opts)

- `rootPath`: `String`， 项目的根目录，必填项
- `opts`: 额外参数，一般情况下是由项目中的 `matman.config.js` 来定义，详见 `MatmanConfig` 类的字段说明

`MatmanConfig` 类的字段如下：

| 字段名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `rootPath` | `String` | 无 | 端对端项目的根目录，一般情况是 `matman.config.js` 的目录 |
| `testerPath` | `String` | `path.resolve(rootPath, './build/crawler-script')` | 测试目标的根目录 |
| `crawlerBuildPath` | `String` | `path.resolve(rootPath, './build/crawler-script')` | 前端爬虫脚本构建之后的目录 |
| `crawlerMatch` | `RegExp` | <code>/[\\/&#124;\\\\]crawlers[\\/&#124;\\\\].*\\.js$/</code> | 用于匹配是否为前端爬虫脚本的正则表达式，默认识别 `crawlers` 文件夹下的js |
| `crawlerInjectJQuery` | `Boolean` | `true` | 前端爬虫脚本中是否注入jQuery |
| `screenshotPath` | `String` | `path.resolve(rootPath, './build/screenshot_output')` | 屏幕截图保存的路径 |
| `coveragePath` | `String` | `path.resolve(rootPath, './build/coverage_output')` | 测试覆盖率文件保存的路径 |
| `matmanResultPath` | `String` | `path.resolve(rootPath, './build/matman_result_output')` | `MatmanResult` 执行结果数据保存的路径 |
| `isDevBuild` | `Boolean` | `false` | 是否为开发模式，若值为 `true`，则构建之后的前端爬虫脚本可用于代码调试 |

注意，必须要满足以下条件，否则会直接报错：

- `rootPath` 必须真实存在
- `testerPath` 必须真实存在


### 2.2 createPageDriver(caseModuleFilePath, opts)

创建 `PageDriver` 对象。

- `caseModuleFilePath`: `String`， 测试案例文件的绝对路径
- `opts`: 额外参数，传递给 `MatmanConfig` 和 `PageDriver` 使用


### 2.3 PageDriver 类

页面控制器。

#### 2.3.1 constructor(matmanConfig, caseModuleFilePath, opts)

- `matmanConfig`: `MatmanConfig`， 必填项
- `caseModuleFilePath`: `String`， 测试案例文件的绝对路径，必填项
- `opts`: 额外参数
  - `opts.doNotCloseBrowser`: `Boolean`， 是否在执行完成之后不要关闭浏览器，默认为 `false`
  - `opts.useRecorder`: `Boolean`， 是否使用记录器，若为 `true`，则在结果中会返回网络请求和浏览器事件等额外信息，默认为 `false`
  - `opts.tag`: `String`， 标记，在某些场景下使用，例如截图保存文件中追加该标记，用于做区分


#### 2.3.2 useNightmare(nightmareConfig)

> 支持链式调用。

使用 nightmare.js 框架来做端对端测试。

- `nightmareConfig`: `Object`， 可选项，传递给原生的 [Nightmare constructor](https://www.npmjs.com/package/nightmare#nightmareoptions) 的参数

#### 2.3.3 useProxyServer(proxyServer)

> 支持链式调用。

走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的；若不配置，则之前请求现网，亦可直接测试现网的服务。

- `proxyServer`: `String`， 代理服务器，格式为 `my_proxy_server.example.com:8080`，例如 `127.0.0.1:8899`


#### 2.3.4 useMockstar(mockstarQuery)

> 支持链式调用。

使用 [mockstar](https://github.com/mockstarjs/mockstar) 来做桩数据(假数据，mock 数据)。

- `mockstarQuery`: `MockStarQuery`，mockstar 方案中用于指定桩数据的请求对象


#### 2.3.5 setCookies(cookies)

> 支持链式调用。

注入 cookie。相关内容可以阅读 [nightmare-handler exCookies](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md)  。

当 `cookies` 为 `String` ，即格式与 `document.cookie` 输出形式一直，例如 `mykey1=myvalue1; mykey2=myvalue2` 。

当 `cookies` 为 `Object` 时，可以支持多个 cookie 键值对，例如 `{mykey1:'myvalue1', mykey2:'myvalue'}` 。


#### 2.3.6 setDeviceConfig(deviceConfig)

> 支持链式调用。

设置无头浏览器设备参数。相关内容可以阅读 [nightmare-handler exDevice](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md)  。

当 `deviceConfig` 为 `String` ，即为指定用哪种预定义的设备名字，默认值为 `mobile`

当 `deviceConfig` 为 `Object` 时：
- `deviceConfig.name`: `String`， 设备名字
- `deviceConfig.UA`: `String`， 是userAgent
- `deviceConfig.width`: `Number`， 视窗宽度
- `deviceConfig.height`: `Number`， 视窗高度，注意这里不是指页面的高度，页面高度要小于这个值


#### 2.3.7 setScreenshotConfig(screenshotConfig)

> 支持链式调用。

设置截屏参数。相关内容可以阅读 [nightmare#screenshotpath-clip](https://github.com/segmentio/nightmare#screenshotpath-clip) 。


当 `screenshotConfig` 为 `Boolean` ，且为 `true` 时，则将根据当前路径自动生成截图文件名字 ，推荐用该方式。

当 `screenshotConfig` 为 `String` ，即为截图保存的完成文件名，绝对路径，例如 `/root/xyz.png`。

当 `screenshotConfig` 为 `Object` 时：
- `screenshotConfig.path`: `String`， 截图保存的完成文件名，绝对路径，例如 `/root/xyz.png`，如果不填写，则将根据当前路径自动生成截图文件名字
- `screenshotConfig.clip`: `String`， 截图的区域，例如 `{ x: 0, y: 0, width: 0, height: 0 }`
- `screenshotConfig.tag`: `String`， 标记，会追加到 `screenshotConfig.path` 中，用作自定义的区分

