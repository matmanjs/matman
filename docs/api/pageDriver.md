---
sidebarDepth: 2
---

# PageDriver 对象

> - PageDriverAsync 和 PageDriverSync 中的 API 基本保持一致
> - 只是 PageDriverSync 中的成员函数返回的是 PageDriver 本身，PageDriverAsync 中的成员函数一般返回 void
> - 具体的示例可以 [参考](https://github.com/matmanjs/test-automation-training/tree/master/matman)

## 1. PageDriverAsync

### 1.1 useProxyServer

> 设置代理服务

#### 1.1.1 参数

- proxyServer：代理服务地址（String）

#### 1.1.2 返回值

- `void`

### 1.2 useMockstar

> 设置 mock 服务

#### 1.2.1 参数

- queryMap：mockstar 数据映射（MockstarQueryDataMap），类型定义如下：

```typescript
export interface MockstarQueryDataMap {
  [key: string]: string;
}
```

#### 1.2.2 返回值

- `void`

### 1.3 setCookieConfig

> 设置 cookie

#### 1.3.1 参数

- cookieConfig：需要注入的 cookie（CookieConfigOpts，可以传入 `符合格式的 cookie 字符串、键值映射、对象数组`），类型定义如下：

```typescript
export interface CookieMap {
  [key: string]: string | number;
}

// https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#pagesetcookiecookies
export interface CookieObject {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
}

// mykey1=myvalue1; mykey2=myvalue2
type cookieStr = string;

export type CookieConfigOpts = cookieStr | CookieMap | CookieObject[];
```

#### 1.3.2 返回值

- `void`

### 1.4 setDeviceConfig

> 设置设备参数

#### 1.4.1 参数

- deviceConfig：设备参数设置（DeviceConfigOpts，当传入 `string` 时，应为你需要指定的设备，否则传入`object`），类型定义如下：

```typescript
interface Viewport {
  // 页面宽度
  width: number;
  // 页面高度
  height: number;
  // 设备缩放比例，默认为 1
  deviceScaleFactor?: number;
  // 是否是移动设备
  isMobile?: boolean;
  // 是否支持触摸事件
  hasTouch?: boolean;
  // 是否以 landscape 模式运行，默认为 false
  isLandscape?: boolean;
}

// https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
interface Device {
  // 设备名称
  name?: string;
  // UA 设置
  userAgent?: string;
  viewport?: Viewport;
  // 基于哪一个设备扩展
  extend?: string;
}

export type DeviceConfigOpts = string | Device;
```

#### 1.4.2 返回值

- `void`

### 1.5 setScreenshotConfig

> 设置截屏配置

#### 1.5.1 参数

- screenshotConfig：截屏配置（ScreenOpts，传入 `string` 时为文件保存路径，`boolean` 时为是否启动截屏，`object` 时为截屏区域设置等），类型定义如下：

```typescript
/**
 * 截图区域的配置信息
 */
interface ClipOpts {
  // 区域左上角坐标
  x: number;
  y: number;
  // 截图区域宽高
  width: number;
  height: number;
}

/**
 * 是否启用截图, 或者截图保存的文件名路径(如果想对路径, 则相对于basePath 而言), 或者截图配置
 */
export type ScreenOpts = string | boolean | {tag?: string; path: string; clip?: ClipOpts};
```

#### 1.5.2 返回值

- `void`

### 1.6 setCoverageConfig

> 设置覆盖率配置

#### 1.6.1 参数

- coverageConfig：覆盖率配置参数（CoverageOpts），类型定义如下：

```typescript
/**
 * 覆盖率选项
 * 是否启用覆盖率, 或者覆盖率保存的文件名路径 (如果想对路径, 则相对于basePath 而言), 或者覆盖率配置
 *
 * @member opts.path 保存覆盖率文件的路径, 如果没有填写就自动生成
 * @member opts.tag 标记
 */
export type CoverageOpts = string | boolean | {tag?: string; path: string};
```

#### 1.6.2 返回值

- `void`

### 1.7 setMatmanResultConfig

> 设置运行结果保存配置

#### 1.7.1 参数

- matmanResultConfig：执行结果保存配置（ResultOpts），类型定义如下：

```typescript
/**
 * 执行结果选项
 * 是否启用执行结果，或者执行结果保存的文件名路径(如果想对路径，则相对于basePath 而言)，或者执行结果配置
 *
 * @member opts.path 执行结果保存的完成文件名，如果不填写，则将根据当前路径自动生成名字
 * @member opts.tag 标记
 */
export type ResultOpts = string | boolean | {tag?: string; path: string};
```

#### 1.7.2 返回值

- `void`

### 1.8 setPageUrl

> 设置页面 URL

#### 1.8.1 参数

- pageUrl：待测试页面的 URL（string）

#### 1.8.2 返回值

- `void`

### 1.9 addAction

> 设置页面操作步骤

#### 1.9.1 参数

- actionName：action 的名称（string）
- actionCall：需要执行的方法（`(n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>`）
- 需要注意的是
  - 当 runner 选择 puppeteer 时，需要传入的函数为异步函数
  - 当 runner 选择 Nightmare 时，需要将 Nightmare 实例返回

#### 1.9.2 返回值

- `void`

### 1.10 evaluate

> 设置爬虫、得到结果

#### 1.10.1 参数

- evaluate：需要执行的爬虫脚本的路径或者函数（string 或者 Function）

#### 1.10.2 返回值

- `Promise<MatmanResult | PageDriver>`

## 2. PageDriverSync

- 与 `PageDriverAsync` 基本一致
- `evaluate` 与 `PageDriverAsync` 完全一致
- 除 `evaluat` 外，其余函数为同步函数且返回 `PageDriverSync` 本身
- 其余可参考上述部分

## 3. 接口定义

`PageDriver` 中需要实现的接口如下：

```typescript
export interface PageDriver {
  /**
   * 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
   * 若不配置，则之前请求现网，亦可直接测试现网的服务
   *
   * https://github.com/segmentio/nightmare#switches
   *
   * @param {String} proxyServer 代理服务器，格式为 my_proxy_server.example.com:8080，例如 127.0.0.1:8899
   * @return {PageDriver}
   */
  useProxyServer(proxyServer: string): PageDriver | Promise<void>;

  /**
   * 使用 mockstar 工具来做接口 mock 数据
   *
   * https://github.com/mockstarjs/mockstar
   *
   * @return {PageDriver}
   */
  useMockstar(queryMap: MockstarQueryDataMap): PageDriver | Promise<void>;

  /**
   * 注入 cookie
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md
   * https://github.com/helinjiang/nightmare-handler/tree/master/demo/extend-exCookies
   *
   * @param {String | Object } cookieConfig 支持 `mykey1=myvalue1; mykey2=myvalue2` 和 `{mykey1:'myvalue1', mykey2:'myvalue'}` 写法
   * @return {PageDriver}
   */
  setCookieConfig(cookieConfig: CookieConfigOpts): PageDriver | Promise<void>;

  /**
   * 设置无头浏览器设备参数
   *
   * https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md
   *
   * @param {String | Object} deviceConfig 设备名或者设备配置，默认值为 mobile
   * @param {String} [deviceConfig.name] 设备名字
   * @param {String} [deviceConfig.UA] userAgent
   * @param {Number} [deviceConfig.width] 视窗宽度
   * @param {Number} [deviceConfig.height] 视窗高度，注意这里不是指页面的高度，页面高度要小于这个值
   * @return {PageDriver}
   */
  setDeviceConfig(deviceConfig: DeviceConfigOpts): PageDriver | Promise<void>;

  /**
   * 设置截屏参数，默认不截图
   *
   * @param {Boolean | String | Object} screenshotConfig
   * @return {PageDriver}
   */
  setScreenshotConfig(screenshotConfig: ScreenOpts): PageDriver | Promise<void>;

  /**
   * 设置覆盖率参数
   *
   * @param {Boolean | String | Object} coverageConfig
   * @return {PageDriver}
   */
  setCoverageConfig(coverageConfig: CoverageOpts): PageDriver | Promise<void>;

  /**
   * 设置 MatmanResult 执行结果参数
   *
   * @param {Boolean | String | Object} matmanResultConfig
   * @return {PageDriver}
   */
  setMatmanResultConfig(matmanResultConfig: ResultOpts): PageDriver | Promise<void>;

  /**
   * 加载指定的页面地址
   *
   * @param pageUrl
   * @return {PageDriver}
   */
  setPageUrl(pageUrl: string): PageDriver | Promise<void>;

  /**
   * 增加测试动作
   *
   * @param {String} actionName 动作名称，后续可通过它来获得最后的数据
   * @param {Function} actionCall 执行函数，接受一个 nightmare 对象，可以直接操作
   * @return {PageDriver}
   */
  addAction(
    actionName: string,
    actionCall: (n: Nightmare & puppeteer.Page) => Nightmare | Promise<void>,
  ): PageDriver | Promise<void>;

  /**
   * 执行爬虫脚本或者方法获得结果
   *
   * https://www.npmjs.com/package/nightmare#evaluatefn-arg1-arg2
   *
   * @param {String | Function} fn
   * @param [args]
   * @return {Promise<MatmanResult|PageDriver>}
   */
  evaluate(fn: string): Promise<MatmanResult | PageDriver>;
  evaluate(fn: () => any, ...args: any[]): Promise<MatmanResult | PageDriver>;
}
```
