# matman-cli

matman 项目的 CLI 工具，更多资料请参考： [matman 官方文档](https://matmanjs.github.io/matman/) 。

## 安装

全局安装：

```
npm install matman-cli -g
```

## 用法说明

### matman.config.js

每个 matman 项目的根目录下必须要 `matman.config.js` 文件，就像每个需要 `webpack` 构建的项目得有 `webpack.config.js` 一样。

### 参数选项

- `--help`，打印帮助
- `--version`，打印版本号

### 命令

#### matman build [path]

执行构建命令，构建过程主要处理以下事情：

- 利用 webpack 分析依赖，将前端爬虫脚本打包成一个文件
- 注入 nightmare 的特定代码以便完成通信
- 注入 jQuery 等脚本，方便调用
