const expect = require('chai').expect;

const checkPage = require('.');

describe('百度首页：常规检查', function () {
    this.timeout(30000);

    let resultData;

    before(function () {
        return checkPage({ show: false, doNotEnd: false, useRecorder: true })
            .then(function (result) {
                // console.log(JSON.stringify(result));
                resultData = result;
            });
    });

    describe('检查基本信息', function () {
        let data;

        before(function () {
            data = resultData.data;
        });

        it('网站title应该为：百度一下，你就知道', function () {
            expect(data.title).to.equal('百度一下，你就知道');
        });

        it('搜索按钮的文字应该为：百度一下', function () {
            expect(data.searchBtnTxt).to.equal('百度一下');
        });

        it('顶部导航信息正确', function () {
            expect(data.navInfo).to.eql({
                'isExist': true,
                'moreProduct': { 'href': 'http://www.baidu.com/more/', 'isExist': true, 'name': '更多产品' },
                'setting': { 'href': 'http://www.baidu.com/gaoji/preferences.html', 'isExist': true, 'name': '设置' }
            });
        });
    });
});
