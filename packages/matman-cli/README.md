# matman-cli

matman 项目的 CLI 工具，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

## 1. 安装

全局安装（Linux/MacOS 等系统下可能需要使用 `sudo`）：

```bash
$ npm install matman-cli -g
```

特别注意：全局安装 `matman-cli` 时，可能会提示 [electron 权限安装问题](https://github.com/matmanjs/matman-cli/issues/30)。此时需要增加一些额外参数来安装：

```bash
$ sudo npm install matman-cli -g --unsafe-perm=true --allow-root
```

## 2. 用法说明

### 2.1 matman.config.js

每个 matman 项目的根目录下必须要 `matman.config.js` 文件，就像每个需要 `webpack` 构建的项目得有 `webpack.config.js` 一样。

### 2.2 参数选项

- `--help`，打印帮助
- `--version`，打印版本号

### 2.3 命令

#### 2.3.1 matman build [options]

执行构建命令。

`options` 支持两个：

- `dev`： 是否为开发者模式，使用方式: `--dev`
- `config`： 自定义配置文件，使用方式: `--config=matman.config.js`


构建过程主要处理以下事情：

- 利用 webpack 分析依赖，将前端爬虫脚本打包成一个文件
- 注入 nightmare 的特定代码以便完成通信
- 注入 jQuery 等脚本，方便调用


