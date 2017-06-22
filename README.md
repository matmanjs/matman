# matman
Mock service and Tester assistant

## application

```
# 启动服务器
npm run server-babel;

# 前端页面编译
npm run webpack;
```

## 系统 CGI

`/sys-cgi/mocker`: 获得 mocker 的列表

## 字段定义

mocker 的 `config.json` 文件中字段的定义

| 字段名 | 是否必须 | 含义描述 |
| --- | --- | --- |
| `route` | 是 | 路由 |
| `disable` | 否 | 如果该值为 `true`，则会直接请求现网数据，不再使用 mock 服务了 |
| `params` | 否 | 数组，如果路由中包含了参数，则必须定义它。例如 `/a/b/id/:id`，则需要定义 `[{"name": "id","type": "number"}]` |
| `method` | 否 | 请求类型：`get`、`post` 等， 默认为 `get` |
| `version` | 否 | 版本号 |
| `description` | 否 | 描述，默认值为name字段的值 |
| `author` | 否 | 作者 |
| `name` | 否 | 名字，默认为文件名 |
| `defaultModule` | 否 | 默认的 mock module 模块，如果不填，则会按文件名取第一个 mock module |

mock module 的 `config.json` 文件中字段的定义

| 字段名 | 是否必须 | 含义描述 |
| --- | --- | --- |
| `version` | 否 | 版本号 |
| `description` | 否 | 描述，默认值为name字段的值 |
| `author` | 否 | 作者 |
| `name` | 否 | 名字，默认为文件名 |
| `query` | 否 | 对象，额外的请求参数和值 |

如果是 mock 数据，则在 response header 中会有 `matman-mocker` 和 `matman-mock-module` 字段。