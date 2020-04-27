# matman-config

[matman](https://github.com/matmanjs/matman) 端对端测试方案中配置文件。

## 1. 安装

```
$ npm install matman-config --save
```

## 2. API 说明

### 2.1 MatmanConfig 类

matman.config.js 配置。

#### 2.1.1 constructor(rootPath, opts)

- `rootPath`: `String`， 项目的根目录，必填项
- `opts`: 额外参数
  - `opts.testerPath`: `String`， 测试对象的根目录，默认值为 `path.resolve(rootPath, './src/testers')`
  - `opts.crawlerBuildPath`: `String`， 前端爬虫脚本构建之后的目录，默认值为 `path.resolve(rootPath, './build/crawler-script')`
  - `opts.crawlerMatch`: `RegExp`， 用于匹配是否为前端爬虫脚本的正则表达式，默认值为 `/[\/|\\]crawlers[\/|\\].*\.js$/`
  - `opts.crawlerInjectJQuery`: `Boolean`， 前端爬虫脚本中是否注入jQuery，默认值为 `true`
  - `opts.screenshotPath`: `String`， 屏幕截图保存的路径，默认值为 `path.resolve(rootPath, './build/screenshot')`
  - `opts.coveragePath`: `String`， 覆盖率文件保存的路径，默认值为 `path.resolve(rootPath, './build/coverage_output')`
  - `opts.isDevBuild`: `Boolean`， 是否为开发模式，默认值为 `false`

#### 2.1.2 check()

检验参数是否合理，返回一个对象：

- `result`: `Boolean`， 校验结果，`true` 为通过校验
- `msg`: `String`， 当 `result` 为 `false` 时，该值提供了具体的错误信息

注意，在调用其他函数之前，必须先调用该方法校验。因为该方法会校验：

- `rootPath` 必须真实存在
- `testerPath` 必须真实存在


```javascript
const matmanConfig = new MatmanConfig(rootPath, opts);

// 校验 matmanConfig 参数合法性
let checkResult = matmanConfig.check();
if (!checkResult.result) {
    throw new Error(checkResult.msg);
}

// do something else
```
