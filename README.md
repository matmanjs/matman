# matman

matman 是一个用于数据模拟和段对端测试的工具。

> Node `v7.6.0` 开始默认支持 `Async/Await`，请将 Node 升级到 `v7.6.0` 以上。

## 特性

- 强大的自定义产生模拟数据的能力
- 灵活的获取不同模拟数据
- E2E（段对端）测试的集成

## 安装

```
$ npm install matman --save
```

## FAQ

全局安装 `matman-cli` 时，可能会出现以下错误。错误是由 electron 安装时造成的，详见 https://github.com/matmanjs/matman-cli/issues/30 。此时需要增加一些额外参数来安装：

```bash
sudo npm install matman-cli -g --unsafe-perm=true --allow-root
```

## 文档

- 中文文档
- [贡献代码](https://github.com/helinjiang/matman/wiki/%E8%B4%A1%E7%8C%AE%E4%BB%A3%E7%A0%81)
