# matman-crawler

[matman](https://github.com/matmanjs/matman) 端对端测试方案中使用到的前端爬虫处理工具。

## 安装

```
$ npm install matman-crawler --save
```

## 功能介绍

### 将多个文件打包成一个单文件

nightmare 提供了 [custom preload script](https://github.com/segmentio/nightmare#custom-preload-script) 的能力，支持注入一个单文件脚本（我们称之为**前端爬虫脚本**）。

但我们开发时，大多时候是基于 CommonJS 规范来组织项目，存在多个组件和多个文件。因此，基于 webpack3， 我们开发了这个工具来将源代码打包成一个文件。

### 已自动注入了 jQuery

为了更好的爬取 DOM 上的信息，我们构建前端爬虫脚本时，已注入了 [jQuery 3.3.1 slim 版本](https://github.com/matmanjs/matman/blob/master/packages/matman-crawler/asserts/jquery.slim.min.js)。因此在写前端爬虫脚本时，可以直接用 jQuery 了。

