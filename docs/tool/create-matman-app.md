# create-matman-app

[create-matman-app](https://www.npmjs.com/package/create-matman-app) 主要用来初始化使用 Matman 做 web 自动化测试的项目。

## 1. 如何使用

脚手架初始化项目，具体示例可以阅参考 [快速入门](../docs/getting-started) 。

```bash
# 使用 Mocha
$ npx create-matman-app [project_name]
# 或者
$ npx create-matman-app [project_name] --template=mocha

# 使用 Mocha + TS
$ npx create-matman-app [project_name] --template=mocha-ts

# 使用 Jest
$ npx create-matman-app [project_name] --template=jest

# 使用 Jest + TS
$ npx create-matman-app [project_name] --template=jest-ts
```

初始化之后的项目内容也可以参考 [create-matman-app/demo](https://github.com/matmanjs/create-matman-app/tree/master/demo) ，这几个 demo 都是由上述脚手架命令生成的，可以直接运行体验。


## 2. 内置命令

生成的项目中，已经在 `package.json` 中已经配置了几个命令，具体可以查看 README.md 文档说明。

```
# 执行 web 端对端测试
$ npm run test:e2e

# 执行 web 端对端测试，同时展示无头浏览器，可用于调试
$ npm run test:e2e:show

# 直接执行测试命令，适合开发调试阶段使用，需要提前准备好了 SUT
$ npm run test:e2e:direct

# 本地开发版本的自动化测试准备
$ npm run test:e2e:bootstrap:dev

# 生产版本的自动化测试准备
$ npm run test:e2e:bootstrap
```

## 3. 反馈

本项目的代码仓库地址： [https://github.com/matmanjs/create-matman-app](https://github.com/matmanjs/create-matman-app) ，欢迎给我们 [提 Issue](https://github.com/matmanjs/create-matman-app/issues/new) 。
