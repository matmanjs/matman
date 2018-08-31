# mock server

本项目用于处理数据打桩。


## 启动

在 matman-app 中执行以下命令即可。

```
npm start
```


## 管理

服务启动之后，可以打开 `http://localhost:9527` 进行管理端操作。


## 查看运行情况

使用了 [pm2](https://www.npmjs.com/package/pm2) 来启动，命名为 `matman-app`，启动之后服务会常驻内存。关于 pm2 常用的操作包括：

- `pm2 list` ： 查看所有服务
- `pm2 logs` ： 查看日志


## 其他

如果发现启动服务失败，则使用 `pm2 logs` 来查看运行情况。