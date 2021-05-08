# matman-plugin-puppeteer

[matman](https://github.com/matmanjs/matman) 端对端测试方案中使用到的前端爬虫处理工具，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

## 1. 安装

```
$ npm install matman-plugin-puppeteer --save
```

## 2. 功能介绍

自动化测试插件，使用 puppeteer 进行自动化测试。

## 3. API 说明

### 3.1 build(matmanConfig)

利用 webpack 按照规则进行构建。构建完成之后会生成构建文件。

- `matmanConfig`: `MatmanConfig`， 参考 [matman 组件](https://www.npmjs.com/package/matman)
