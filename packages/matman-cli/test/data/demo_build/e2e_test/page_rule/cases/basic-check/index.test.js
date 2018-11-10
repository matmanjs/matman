const expect = require('chai').expect;
const checkPage = require('./index');

describe('提现规则页：常规检查', function () {
    this.timeout(30000);

    let resultData;

    before(function () {
        return checkPage({ show: false, doNotEnd: false, useRecorder: false })
            .then(function (result) {
                // console.log(JSON.stringify(result));
                resultData = result;
            });
    });

    describe('检查-全局设置信息', function () {
        let data;

        before(function () {
            data = resultData.data.projectInfo;
        });

        it('全局badjsId：246', function () {
            expect(data.config.badjsId).to.be.equal(246);
        });

        it('window.__DEV__ 为 false', function () {
            expect(data.basic.isDev).to.be.false;
        });

        it('已经设置了 window._webviewloaded=true', function () {
            expect(data.appNow.isSetWebviewLoaded).to.be.true;
        });

        it('已经定义了 window.__WEBVIEW_LOADFAIL 方法', function () {
            expect(data.appNow.isDefinedWebviewLoadFail).to.be.true;
        });
    });

    describe('检查-提现说明', function () {
        let data;

        before(function () {
            data = resultData.data.section1Info;
        });

        it('存在该模块', function () {
            expect(data.isExist).to.be.true;
        });

        it('标题为：提现说明', function () {
            expect(data.title).to.be.equal('提现说明');
        });

        it('规则数量为：5', function () {
            expect(data.rulesLength).to.be.equal(5);
        });

        it('规则内容正确', function () {
            expect(data.rules).to.be.eql([
                '1.领取厘米秀红包的QQ号码可提现红包余额到该QQ号码的钱包；',
                '2.请注意哦~用户每天至多可以申请提现一次，最低需提现5元，数量有限，先到先得哦；',
                '3.一期红包有效期至2018年7月7日，二期红包有效期为45天，过期系统回收；',
                '4.由于国家和央视加强对网络支付的监管，根据相关政策规定，NOW直播需对所有涉及现金类提现业务统一调整，提现均需要用户实名认证；',
                '5.提现后预计两个工作日将发放至QQ钱包，请到QQ钱包-点击QQ钱包余额数字-交易记录查看；'
            ]);
        });
    });

    describe('检查-税费说明', function () {
        let data;

        before(function () {
            data = resultData.data.section2Info;
        });

        it('存在该模块', function () {
            expect(data.isExist).to.be.true;
        });

        it('标题为：税费说明', function () {
            expect(data.title).to.be.equal('税费说明');
        });

        it('规则数量为：1', function () {
            expect(data.rulesLength).to.be.equal(1);
        });

        it('规则内容正确', function () {
            expect(data.rules).to.be.eql([
                '根据国家税务总局规定，对个人获得企业派发的网络红包（厘米秀红包），应按照所得相应金额缴纳个人所得税，税款由派发红包的企业代扣代缴。为配合国家税务总局政策规定，自2017年5月18日起，NOW开始执行。'
            ]);
        });
    });

    describe('检查-代缴方案', function () {
        let data;

        before(function () {
            data = resultData.data.section3Info;
        });

        it('存在该模块', function () {
            expect(data.isExist).to.be.true;
        });

        it('标题为：代缴方案', function () {
            expect(data.title).to.be.equal('代缴方案');
        });

        it('规则数量为：1', function () {
            expect(data.rulesLength).to.be.equal(1);
        });

        it('规则内容正确', function () {
            expect(data.rules).to.be.eql([
                '按提现金额的20%收取个人所得税。'
            ]);
        });
    });
});
