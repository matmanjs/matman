---
sidebarDepth: 0
---

# 快速入门

## 新建项目

按照 [安装和升级](../install.md) 一文配置好环境之后，我们将开启学习 **web 端对端测试**之旅。记下来，我们将以百度（ [https://www.baidu.com](https://www.baidu.com) ）为测试对象，使用 matman 做一些简单的 web 端对端测试。

> 如果你不想跟着步骤来做，则可以直接访问 [https://github.com/matmanjs/matman-demo-getting-started](https://github.com/matmanjs/matman-demo-getting-started) 来获取最终的代码。

在开始之前，请再次确认下环境是否准备好：

```bash
# node 版本需 >= 10.18.1
$ node -v

# 使用脚手架初始化项目
$ npx matman-cli init
```

## 目录结构

```bash
.
├── case_modules
│   └── page_baidu_index
│       ├── basic-check.js
│       ├── crawlers
│       │   └── get-page-info-for-search.js
│       └── search-check.js
├── matman.config.js
├── package.json
└── test
    ├── basic-check.test.js
    └── search-check.test.js
```

使用脚手架新建的目录结构如上面所示，这也是我们推荐的目录结构。

- `case_modules`：存放所有的端到端测试文件，我们推荐使用 `page_<二级域名>_<URI>` 命名同一个页面的不同数据快照获取方式
- `matman.config.js`：存放matman配置文件
- `test`：存放所有的 mocha 测试文件