# matman-core

[matman](https://github.com/matmanjs/matman) 端对端测试方案中的基础库，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

> 该库主要给内部使用，一般情况下不会需要直接使用该库。

## 1. 安装

```
$ npm install matman-core --save
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
| `rootPath` | `String` | 无 | matman 项目的根目录，一般情况是 `matman.config.js` 的目录 |
| `caseModulesPath` | `String` | `path.resolve(rootPath, './case_modules')` | 测试案例的根目录 |
| `crawlerBuildPath` | `String` | `path.resolve(rootPath, './build/crawler-script')` | 前端爬虫脚本构建之后的目录 |
| `crawlerMatch` | `RegExp` | <code>/[\\/&#124;\\\\]crawlers[\\/&#124;\\\\].*\\.js$/</code> | 用于匹配是否为前端爬虫脚本的正则表达式，默认识别 `crawlers` 文件夹下的js |
| `crawlerInjectJQuery` | `Boolean` | `true` | 前端爬虫脚本中是否注入jQuery |
| `screenshotPath` | `String` | `path.resolve(rootPath, './build/screenshot_output')` | 屏幕截图保存的路径 |
| `coveragePath` | `String` | `path.resolve(rootPath, './build/coverage_output')` | 测试覆盖率文件保存的路径 |
| `matmanResultPath` | `String` | `path.resolve(rootPath, './build/matman_result_output')` | `MatmanResult` 执行结果数据保存的路径 |
| `isDevBuild` | `Boolean` | `false` | 是否为开发模式，若值为 `true`，则构建之后的前端爬虫脚本可用于代码调试 |

注意，必须要满足以下条件，否则会直接报错：

- `rootPath` 必须真实存在
- `caseModulesPath` 必须真实存在

### 2.2 MATMAN_CONFIG_FILE

常量，配置文件名，默认值为 `matman.config.js` 。

### 2.3 getAbsolutePath(targetPath, basePath)

获得目标路径的绝对路径。

- `targetPath`: `String`， 需要处理的目标路径
- `basePath`: `String`， 如果 `targetPath` 为相对路径，则将相对这个基础路径而言转换

### 2.4 findMatmanConfig(basePath, matmanConfigOpts)

从指定的目录开始向上查找 `MatmanConfig`，若找不到则返回 `null`。

- `basePath`: `String`， 从该路径开始查找
- `matmanConfigOpts`: `Object`， 额外的参数，将与找到的 `matman.config.js` 内容进行合并

### 2.5 requireSync(filePath: string)

以同步的方式 require 文件。

- `filePath`: `String`， 模块文件的绝对路径

### 2.6 requireAsync(filePath: string)

以异步的方式 require 文件，返回的是 `Promise`。

- `filePath`: `String`， 模块文件的绝对路径