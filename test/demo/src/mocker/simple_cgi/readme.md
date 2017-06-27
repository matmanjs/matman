## 简单 CGI

这是最简单的 CGI 的示例，如果你想够简单，每个 mock module 只需返回 json 格式的数据即可。例如

```javascript
module.exports = {
  "isExist": true,
  "name": "matman",
  "version": "0.0.1"
};
```