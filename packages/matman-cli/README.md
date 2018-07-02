# matman-cli

matman 项目的 CLI 工具。

## 安装

全局安装：

```
npm install matman-cli -g
```

## 用法说明

### matman.config.js

项目的配置文件，类似 `webpack.config.js` 的功能。

### 参数选项

- `--help`，打印帮助
- `--version`，打印版本号

### 命令

#### matman build [path]

构建命令，将 matman 项目构建为完整可运行的项目，以便 `matman start` 命令能够直接运行。

构建过程主要处理以下事情：

- 将运行在 nightmare 中的脚本进行构建打包，注入 nightmare 的特定代码和 jQuery 等，并且提供方式能够快速引用
- 将 mocker 序列化


#### matman start [--config]

启动本地服务。如果不传入 `config` 参数选项，则会在当前目录寻找 `matman.config.js` 配置文件。
