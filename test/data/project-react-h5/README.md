# UI 自动化测试演示项目

本项目参考了 [sample-matman-react-mocha](https://github.com/matmanjs/test-automation-training/tree/master/sample-matman-react-mocha) 这个项目，并做了适当简化，如何启动运行等命令等请阅读原项目。


## 启动命令

```bash
# 启动本地调试
$ npm start

# 启动构建
$ npm run build
```

## 开发调试

本项目测试的地址为：https://now.qq.com/index.html ，需要设置代理。

本地开发的版本的代理配置：

```
now.qq.com/maybe/report statusCode://200
now.qq.com 127.0.0.1:3000
now.qq.com/manifest.json [project_path]/public/manifest.json

cgi.now.qq.com/cgi-bin 127.0.0.1:9527
```

生产环境的版本的代理配置：

```
now.qq.com/maybe/report statusCode://200
now.qq.com/manifest.json [project_path]/build/manifest.json
/^https?://now\.qq\.com/static/(.*)$/ [project_path]/build/static/$1
/^https?://now\.qq\.com/([\w\-]*)(.*)$/ [project_path]/build/index.html

cgi.now.qq.com/cgi-bin 127.0.0.1:9527
```
