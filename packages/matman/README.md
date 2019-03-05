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

适合交互行为的操作