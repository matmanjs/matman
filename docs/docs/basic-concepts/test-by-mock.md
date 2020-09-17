# 基于白盒数据测试数据快照

既然输入的数据在变化，那么我们就需要消除这种变化。业界中常用的办法之一就是使用非真实数据进行打桩测试，因此我们选择的策略也是基于白盒数据来进行。

## 1. 测试思路

基于白盒数据（桩数据）的测试策略。

- 开发者根据业务逻辑构造桩数据，产生“预期值”
- 程序使用同一份桩数据，产生“数据快照”
- 单元测试校验“数据快照”与“预期值”是否相同

![](./img/test-by-mock-solution.png)

## 2. 数据打桩

我们推荐使用 [mockstar](https://github.com/mockstarjs/mockstar)，后面我们还会进一步说，此处先贴一个图。

![](./img/test-by-mock-mockstar.png)


## 3. 针对数据快照的单元测试

由于输入确定了，因此输出的数据也是确定，我们写单元测试时就会很简单。

以下是用 mocha + chai 写的例子：

```javascript
describe('检查：基本信息', function () {
    it('检查: 红包兑换商城', function () {

        let checkData = Object.assign({}, resultData.data.exchangeGiftInfo);

        expect(checkData.i2.limit).to.match(/限时\d+小时/);

        checkData.i2.limit = 'has checked';

        expect(checkData).to.eql({
            'description': '商品兑换后可在任一直播间-礼品-包裹中查看',
            'i0': {
                'btnText': '兑换',
                'count': 'x110',
                'currentPrice': '￥10.00',
                'isExist': true,
                'limit': '',
                'originalPrice': '￥11.00',
                'pic': 'http://11.url.cn/huayang/resource/yule/new_gift/ilivenew/memeda91.png'
            },
            'i1': {
                'btnText': '兑换',
                'count': 'x55',
                'currentPrice': '￥8.00',
                'isExist': true,
                'limit': '',
                'originalPrice': '￥8.00',
                'pic': 'http://11.url.cn/huayang/resource/yule/new_gift/ilivenew/ainio91.png'
            },
            'i2': {
                'btnText': '兑换',
                'count': 'x4',
                'currentPrice': '￥30.00',
                'isExist': true,
                'limit': 'has checked',
                'originalPrice': '￥35.00',
                'pic': 'http://11.url.cn/huayang/resource/yule/new_gift/ilivenew/xianhua91.png'
            },
            'isExist': true,
            'title': '红包商城兑换',
            'total': 3
        });
    });
});
```