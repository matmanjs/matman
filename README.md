# matman

matman 是一个用于端对端测试的工具。更多文档详见 https://matmanjs.gitbook.io/cookbook/ 。

> 文档正在补齐中


## 特性

- 支持自定义脚本，将UI转为数据
- 支持模拟用户的操作
- 支持获取页面加载的事件，包括接口请求等

## 安装

```
$ npm install matman-cli -g
```

## FAQ

全局安装 `matman-cli` 时，可能会出现以下错误。错误是由 electron 安装时造成的，详见 https://github.com/matmanjs/matman-cli/issues/30 。此时需要增加一些额外参数来安装：

```bash
sudo npm install matman-cli -g --unsafe-perm=true --allow-root
```

## 参与协作开发

详见 [开发指引说明](./DEVELOP.md) 。

## 文档

- [中文文档](https://matmanjs.gitbook.io/cookbook/)
