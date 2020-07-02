---
sidebarDepth: 0
---
# 前端爬虫工具 web-crawl-util

在我们的端对端测试方案中，很重要的一个步骤就是将页面快照转换为数据快照，其中一块就是需要从 dom 结构中获得需要的数据。为了简化操作，我们提供了 
[web-crawl-util](https://www.npmjs.com/package/web-crawl-util) 这个工具库。

## 如何使用

安装：

```bash
npm install web-crawl-util
```

使用：

```javascript
const { useJquery } = require('web-crawl-util');
console.log(useJquery.getText('#id .css'));
```

## API

工具提供了一个 `useJquery` 对象，其包含了如下几个方法，更详细文档请参考 [web-crawl-util](https://www.npmjs.com/package/web-crawl-util) 。

|                    名称                     |                   功能                   |
| :-----------------------------------------: | :--------------------------------------: |
|        `getText(jqCur, jqContainer)`        |               获得文字信息               |
|     `getAttr(name, jqCur, jqContainer)`     |                获得属性值                |
|       `getTotal(jqCur, jqContainer)`        |          获得符合条件的DOM数量           |
|        `isExist(jqCur, jqContainer)`        |                 是否存在                 |
|    `getImageDomUrl(jqCur, jqContainer)`     |        获得 img 标签中图片的地址         |
|       `getStyle(jqCur, jqContainer)`        |     获得 dom 元素中的部分计算属性值      |
| `getBackgroundImageUrl(jqCur, jqContainer)` | 获得 `background-image` 属性中图片的链接 |