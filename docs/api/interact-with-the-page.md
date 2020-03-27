# 页面交互函数

matman 的交互函数继承自 nightmare，首先具备 nightmare 原有的交互函数的能力，其次自身封装了一些交互函数，扩展了 nightmare 的能力。

nightmare 的交互函数可以参考 [Interact with the Page](https://www.npmjs.com/package/nightmare#interact-with-the-page) 。

常用的有:

| API |   作用   |  来源
| --- | --- | --- |
|.goto(url[, headers])|转到指定页面|nightmare|
|.back() | 回退到上一个页面|nightmare|
|.forward() | 前进到下一个页面 | nightmare|
|.type(selector[, text]) | 输入文本|nightmare|
|.scrollTo(top, left)|滑动到指定位置|nightmare|
|.wait(ms)|等待一段时间后执行下一步操作（毫秒）|nightmare|
|.wait(selector)|等待指定选择器出现之后执行下一步操作| nightmare|
|.exDevice(name, opts)|设定设备样式，[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exDevice.md)|matman|
|.exCookies(cookies, url)|为指定的url地址注入 cookie。[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exCookies.md)|matman|
|.exMergeCookies(cookies)|为当前的页面变更 cookie ，如果有同样的key，则会覆盖旧值。[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exMergeCookies.md)|matman|
|.exScrollToTop()|将页面滚动到顶部。[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exScrollToTop.md)|matman|
|.exScrollToBottom()|将页面滚动到底部。[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exScrollToBottom.md)|matman|
|.exScrollToSelector(selector)|将页面滚动到指定的 selector 所在的位置。[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exScrollToSelector.md)|matman|
|.exChangeMockStar(cookieString)|切换 mockstar 的指定桩数据 。[文档](https://github.com/helinjiang/nightmare-handler/blob/master/docs/exChangeMockStar.md)|matman|