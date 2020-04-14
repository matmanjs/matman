---
sidebarDepth: 0
---

# 关于 matman

 [matman](https://github.com/matmanjs/matman) 是一个用于**web 端对端测试**（E2E，End-to-End Testing）的框架，它提供了一整套方案，十分适合 web 前端开发人员来编写端对端测试。

## 更适合 web 前端开发者使用

matman 可能是**最适合 web 前端开发人员编写端对端测试的方案**。

- 整个过程无需去学习 python 等新语言，只需要了解 html/js/css 即可
- 没有繁杂的安装配置，依靠 npm 包，你所需要的可能只是 `npm install`
- 无需高深的编程技能，框架提供了众多测试工具，只需要你安心写自己的逻辑

## 更适合单页面的精细化测试

matman 方案推荐[基于白盒数据做端对端测试方案](basic-concepts/test-by-mock.md)，尤其适合单页面的精细化测试，例如移动端 h5 页等。

> 精细化测试的意思是：对 UI 展示和行为交互进行深度测试。而单页面测试是相对而言的，毕竟有些业务是那种需要测试多个页面之间交互（例如淘宝页面之间的跳转），这种场景 matman 方案也可以做，只是并不擅长。


## 特性

- 支持自定义脚本，将UI转为数据
- 支持模拟用户的操作
- 支持获取页面加载的事件，包括接口请求等

## 适合什么人阅读

- 如果你是新手，想了解 web 前端如何做端对端测试；
- 如果你是 [matman](https://github.com/matmanjs/matman) 的使用者，想查阅 api 和学习实践经验；
- 如果你已经用了其他的端对端测试框架，想做更多探索研究；

> 基于 matman 做 web 前端自动化的整套方案全部是用 js 语言来写，相比业界使用 python 等方式，对前端同学会更友好。但整套方案中，其实对 js 能力的要求并不高，只要会写 hello world ，基本也能够自己编写端对端测试用例。

## 如何反馈问题

如果对于我们的方案有疑问，则请移步到 [https://github.com/matmanjs/matman/issues](https://github.com/matmanjs/matman/issues) 提 issue，我们将定时进行回复。
