## 标准 CGI

这是标准的 CGI 的示例，如果你想够简单，每个 mock module 只需返回 json 格式的数据即可。例如

```javascript
module.exports = {
  "isExist": true,
  "name": "matman",
  "version": "0.0.1"
};
```

## 排列在最前面

由于设置了 `priority=100`，因此，它将展示在所有 CGI 的最前面。而 `success_exist_matman` 模块也设置了 `priority=100`，因此也将展示在最前面。

## 截图

![](__MOCKER__/static/1.png)
![](__MOCKER__/static/2.png)
![](__MOCKER__/static/subdir/3.png)
