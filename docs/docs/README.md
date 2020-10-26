---
sidebarDepth: 0
---

# 关于 matman

[matman](https://github.com/matmanjs/matman) 是一个可用于做 **web 端对端测试**（E2E，End-to-End Testing）的框架，十分适合 web 前端开发人员来编写端对端测试。


## 1. 有何特色

- 纯 JavaScript： 使用 JS 语言来写用例，无额外学习成本
- 简单易用，告别繁琐： 封装了 [puppeteer](https://github.com/puppeteer/puppeteer) 等开源框架，可完美支持模拟点击、跳转和输入等用户操作；且基于独创的快照机制，支持自定义前端爬虫脚本，将 UI 等转为数据，降低理解和使用成本
- 不只是测试UI： 独有的数据快照模型，不仅可以测UI，还可以测接口请求、性能分析等依赖关系

## 2. 与其他框架有什么不同

### 2.1 更适合 web 前端开发者使用

matman 可能是 `最适合` **web 前端开发人员编写端对端测试的方案**。

- 整个过程无需去学习 Python 等新语言，只需要了解 `HTML/CSS/JS` 基础知识即可，对前端同学更友好
- 没有繁杂的安装配置，依靠 npm 包，你所需要的可能只是 `npm install`
- 无需高深的编程技能，框架提供了众多测试工具，只需要专注写自己的业务测试逻辑

### 2.2 更适合做 UI 级别的精细化测试

matman 方案推荐 [基于白盒数据做端对端测试方案](basic-concepts/test-by-mock.md)，尤其适合做 UI 级别的精细化测试，例如针对 H5 活动页对 UI 展示和行为交互的深度测试。

### 2.3 拥抱开源，不重复造轮子

整套方案是对外开源的（代码仓库地址：[https://github.com/matmanjs/matman](https://github.com/matmanjs/matman)），欢迎大家参与！

同时，我们不重复造轮子，底层基于开源框架 [puppeteer](https://github.com/puppeteer/puppeteer) 等，可直接使用其原始的 API，无需额外的学习成本，同时扩展了一些高级 API，进一步提升编写端对端测试的效率。

## 3. 适合什么人阅读

- 如果你是新手，想了解 web 前端如何做端对端测试；
- 如果你是 [matman](https://github.com/matmanjs/matman) 的使用者，想查阅 api 和学习实践经验；
- 如果你已经用了其他的端对端测试框架，想做更多探索研究；

## 4. 如何反馈问题

如果对于我们的方案有疑问，则请移步到 [https://github.com/matmanjs/matman/issues](https://github.com/matmanjs/matman/issues) 提 issue，我们将定时进行回复。
