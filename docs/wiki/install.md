# 安装和升级

在使用 matman 来构建项目之前，需要先安装 Node 和 [matman-cli](https://www.npmjs.com/package/matman-cli) 。

## 1. 安装 Node.js 并验证版本

### 1.1 Node.js 安装

matman 是基于 Node.js 来实现的，因此需要在本机安装 [Node.js](https://nodejs.org/)，可以选择：

- 进入 [https://nodejs.org/](https://nodejs.org/) 官网，选择 LTS 版本的 Node 安装
- 采用 [NVM](https://github.com/nvm-sh/nvm) 进行多版本管理

### 1.2 版本验证

完成安装后，执行下面命令，查看当前 Node 版本：

```bash
$ node -v
```

- 如果能正常输出 Node 的版本号，表示 Node 已安装成功（ Windows 系统可能需要重新打开 cmd）
- 值得注意的是，一定要确保 Node.js 版本在 `10.18.1` 及以上，否则将无法运行

## 2. 安装 matman-cli

### 2.1 初始化项目

[matman-cli](https://www.npmjs.com/package/matman-cli) 提供了一些命令行，用于初始化项目和构建等。

> 需要注意的是 matman 虽然提供了 Nightmare 与 puppeteer 两种能力、写法也支持链式调用与异步操作，但是推荐使用 puppeteer + 异步操作，所以 cli 工具只会为你生成 puppeteer + 异步的版本。

执行下面的命令初始化你的 matman 项目：

```bash
# 如果安装缓慢请大家配置镜像
$ npm config set registry https://registry.npm.taobao.org

# 推荐大家使用 npx 进行初始化，保证运行 cli 的最新版本
$ npx matman-cli init
```

### 2.2 命令参考

| 命令  |       选项        |                     说明                     |
| :---: | :---------------: | :------------------------------------------: |
|   /   | --version、--help |          `查看版本`、`显示帮助信息`          |
| build |   -d 或者 --dev   |   `编译爬虫脚本`，-d 与 --dev 生成调试版本   |
| init  |  -t 或者 --type   | `初始化项目`，-t 与--type 指定生成所用的模板 |

## 3. puppeteer 安装问题

### 需求场景

由于种种原因，安装 puppeteer 可能会非常的慢。在没有梯子的情况下采用淘宝镜像安装是最快的方式。

### 解决方法

1. 在用户目录下新建 `.npmrc`
2. 在其中设置 `PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors`