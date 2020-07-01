# matman 包 API

## 1. launch

> 获得异步的 PageDriver

### 1.1 原型定义

```typescript
/**
 * 获得异步的 PageDriver
 *
 * @param {BrowserRunner} browserRunner 浏览器运行器，目前支持 puppeteer 和 nightmare 两种
 * @param {PageDriverOpts} pageDriverOpts
 * @param {MatmanConfigOpts} matmanConfigOpts
 */
export declare function launch(browserRunner: BrowserRunner, pageDriverOpts?: PageDriverOpts, matmanConfigOpts?: MatmanConfigOpts): PageDriverAsync;
```

### 1.2 入参类型

#### 1.2.1 BrowserRunner

浏览器运行器，目前支持 `puppeteer` 和 `nightmare` 两种。

大家不需要关心 Runner 的实现细节，只需要引入对应的 `matman-runner-puppeteer` 或者 `matman-runner-nightmare` 包并实例化传入即可，例如下面这样：

```js
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

const page = matman.launch(new BrowserRunner(), opts);

// or

const matman = require('matman');
const {BrowserRunner} = require('matman-runner-nightmare');

const page = matman.launch(new BrowserRunner(), opts);
```

#### 1.2.2 PageDriverOpts

传递给运行器的启动参数，他的类型定义如下：

```typescript
export interface PageDriverOpts {
  caseModuleFilePath: string;
  tag?: string;
  show?: boolean;
  doNotCloseBrowser?: boolean;
  useRecorder?: boolean;
  delayBeforeRun?: number;
}
```

- `caseModuleFilePath`：端到端测试文件路径
- `tag`：生成文件的标识，matman 会在生成产物后面附带 tag，这对于生成多份输出相当有用
- `show`：是否显示浏览器界面
- `doNotCloseBrowser`：执行完成后是否关闭浏览器
- `useRecorder`：是否启用全局的记录器，用于监听网络请求、console 等
- `delayBeforeRun`：延迟执行

#### 1.2.3 MatmanConfigOpts

- matman 全局配置，不推荐使用
- 推荐在根目录下定义 `matman.config.js` 进行使用，请[参考](./matman-config)

### 1.3 返回结果

返回 `PageDriverAsync`，请[参考](./pageDriver#_2-pagedriverasync)

## 2. launchSync

> 获得同步的 PageDriver

### 2.1 原型定义

```typescript
/**
 * 获得同步的 PageDriver
 *
 * @param {BrowserRunner} browserRunner 浏览器运行器，目前支持 puppeteer 和 nightmare 两种
 * @param {PageDriverOpts} pageDriverOpts
 * @param {MatmanConfigOpts} matmanConfigOpts
 */
export declare function launchSync(browserRunner: BrowserRunner, pageDriverOpts?: PageDriverOpts, matmanConfigOpts?: MatmanConfigOpts): PageDriverSync;
```

### 2.2 入参类型

#### 2.2.1 BrowserRunner

浏览器运行器，目前支持 `puppeteer` 和 `nightmare` 两种。

大家不需要关心 Runner 的实现细节，只需要引入对应的 `matman-runner-puppeteer` 或者 `matman-runner-nightmare` 包并实例化传入即可，例如下面这样：

```js
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

const page = matman.launchSync(new BrowserRunner(), opts);

// or

const matman = require('matman');
const {BrowserRunner} = require('matman-runner-nightmare');

const page = matman.launchSync(new BrowserRunner(), opts);
```

#### 2.2.2 PageDriverOpts

与 `lunch` 中的定义相同，请参考上述文档。

#### 2.2.3 MatmanConfigOpts

- matman 全局配置，不推荐使用
- 推荐在根目录下定义 `matman.config.js` 进行使用，请[参考](./matman-config)

### 2.3 返回结果

返回 `PageDriverSync`，请[参考](./pageDriver#_2-pagedriversync)

## 3. getLocalWhistleServer

> 获得本地 whistle 地址

### 3.1 原型定义

```typescript
/**
 * 获得本地 whistle 地址
 *
 * @param {Number} port 指定端口
 * @param {Boolean} doNotAutoCheckStartedPort 不需要自动获得已经启动的端口
 */
export declare function getLocalWhistleServer(port: number, doNotAutoCheckStartedPort?: boolean): Promise<string>;
```

### 3.2 入参类型

#### 3.2.1 port

指定 Whistle 端口

#### 3.2.2 doNotAutoCheckStartedPort

是否自动嗅探，正在运行的 whistle 服务

### 3.3 返回结果

- 返回结果为：`Promise<string>`
- 例如：`127.0.0.1:8899`

