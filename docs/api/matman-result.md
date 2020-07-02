---
sidebarDepth: 2
---

# MatmanResult 对象

> Matman 运行之后返回的格式化的结果

## 1. 结果对象

处理之后的数据如下：

```typescript
interface Result {
  // 使用的 Runner 的名称
  runnerName: string;
  // 页面爬虫返回的真实数据
  data: unknown[];
  // 全局监听到的请求等事件
  globalInfo: {
    recorder?: {
      queue: MatmanResultQueueItem[];
      allRequestUrl: string[];
    };
    isExistCoverageReport?: boolean;
  };
  // 名称索引映射
  readonly dataIndexMap;
  readonly queueHandler;
}
```

## 2. 内建方法

### 2.1 toString

> 将对象中的数据转化为 `JSON` 字符串

#### 2.1.1 参数

- none

#### 2.1.2 返回值

`JSON` 字符串

### 2.2 get

> 通过测试动作名字获得数据

#### 2.2.1 参数

- actionName：测试动作名字，可以是自定义的名字，也可以是数组索引（`string` 或者 `number`）

#### 2.2.2 返回值

指定的爬虫数据

### 2.3 getQueue

>获得捕获到的请求队列

#### 2.3.1 参数

- none

#### 2.3.2 返回值

请求队列 `MatmanResultQueueItem` 数组

### 2.4 getNetwork

> 从结果队列中过滤出网络请求

#### 2.4.1 参数

- resourceType：资源类型，定义如下：

```typescript
/**
 * nightmare 资源类型的枚举，详见 nightmare-handler 组件中的 RESOURCE_TYPE
 */
declare type NightmareResourceType = 'mainFrame' | 'subFrame' | 'stylesheet' | 'script' | 'image' | 'object' | 'xhr' | 'other' | '';
/**
 * puppeteer 资源类型的枚举
 * https://github.com/puppeteer/puppeteer/blob/v4.0.0/docs/api.md#httprequestresourcetype
 */
declare type PuppeteerResourceType = 'document' | 'stylesheet' | 'image' | 'media' | 'font' | 'script' | 'texttrack' | 'xhr' | 'fetch' | 'eventsource' | 'websocket' | 'manifest' | 'other' | '';
export declare type ResourceType = PuppeteerResourceType | NightmareResourceType;
```

#### 2.4.2 返回值

请求队列 `MatmanResultQueueItem` 数组

### 2.5 isExistInNetwork

> 通过传入的参数判断是否存在某个网络请求

#### 2.5.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）
- resourceType：资源类型（可选）
- status：状态（可选）

#### 2.5.2 返回值

`Boolean`

### 2.6 isExistPage

> 是否存在某个页面

#### 2.6.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）
- status：状态（可选）

#### 2.6.2 返回值

`Boolean`

### 2.7 isExistXHR

> 是否存在某个 xhr 请求

#### 2.7.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）
- status：状态（可选）

#### 2.7.2 返回值

`Boolean`

### 2.8 isExistImage

> 是否存在某个 image 请求

#### 2.8.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）
- status：状态（可选）

#### 2.8.2 返回值

`Boolean`

### 2.9 isExistStylesheet

#### 2.9.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）
- status：状态（可选）

#### 2.9.2 返回值

`Boolean`

### 2.10 isExistScript

> 是否存在某个 script 请求

#### 2.10.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）
- status：状态（可选）

#### 2.10.2 返回值

`Boolean`

### 2.11 isExistJSBridge

> 是否存在某个 jsbridge 的调用

#### 2.11.1 参数

- partialURL：请求的 URL
- query：查询参数（可选）

#### 2.11.2 返回值

`Boolean`