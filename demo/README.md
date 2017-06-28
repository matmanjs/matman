# matman 示例

这是使用 matman 的示例。

## 测试的 CGI

不同的公司和项目中，CGI 的返回内容差别比较大，并且有自己的格式，因此 CGI 的返回内容应该由业务完全控制。

### 简单的 CGI

最简单的 CGI 会直接返回单纯的内容。

本示例中，`/cgi-bin/a/b/simple_cgi` 对应的 Mocker 文件为 `simple_cgi`，其返回的其中一个结果为：

```json
{
    "isExist": true,
    "name": "matman",
    "version": "0.0.1"
}

```

### 标准化的 CGI

实际项目里面，每一个 CGI 返回的内容中，除了实际的数据之外，还会有其他字段的内容，比如状态码等。

本示例中，`/cgi-bin/a/b/standard_cgi` 对应的 Mocker 文件为 `standard_cgi`。将上面的例子改造一下，可能会返回类似如下的结果。其中如果 `retcode` 为 `0`，则指数据获取是成功的，然后将实际的内容放在 `result` 字段中。

```json
{
    "retcode": 0,
    "result": {
        "isExist": true,
        "name": "matman",
        "version": "0.0.1"
    }
}
```

如果`retcode` 不为 `0`，则指数据获取是失败的，这是错误码，可能还有额外的字段例如 `msg` 来进一步解释错误的原因。

```json
{
    "retcode": 100000,
    "msg": "not login"
}
```

### 复杂的 CGI

部分 CGI 可能会比较复杂，例如包含列表等。

本示例中，`/cgi-bin/a/b/complex_cgi` 对应的 Mocker 文件为 `complex_cgi`，其返回的其中一个结果为：

```json
{
    "retcode": 0,
    "result": {
        "isExist": true,
        "name": "matman",
        "version": "0.0.1",
        "author": [
            {
                "name": "helinjiang",
                "email": "me@helinjiang.com"
            }, {
                "name": "a",
                "email": "a@a.com"
            }, {
                "name": "b",
                "email": "b@b.com"
            }
        ]
    }
}
```
