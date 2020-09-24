# 安装和升级

在使用 matman 来构建项目之前，需要先安装 Node 。

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
- 值得注意的是，如果使用 puppeteer （即 [matman-runner-puppeteer](https://www.npmjs.com/package/matman-runner-puppeteer) 组件），则需要要确保 Node.js 版本在 `10.18.1` 及以上，否则将无法运行，这是 [puppeteer 本身限定的](https://github.com/puppeteer/puppeteer/blob/72fe86fe6a51b401aa659aee555edbe8ef8d28d8/package.json#L8) 。


## 2. puppeteer 安装问题

由于种种原因，安装 puppeteer 可能会非常的慢。在没有梯子的情况下采用淘宝镜像安装是最快的方式。解决办法如下：

1. 在用户目录下新建 `.npmrc`
2. 在其中设置 `PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors`
