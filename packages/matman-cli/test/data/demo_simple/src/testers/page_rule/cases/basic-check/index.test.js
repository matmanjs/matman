const expect = require('chai').expect;
const checkPage = require('.');

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

    describe('检查-提现说明', function () {
        let data;

        before(function () {
            data = resultData.data.sectionInfo;
        });

        it('存在该模块', function () {
            expect(data.isExist).to.be.true;
        });

        it('标题为：提现说明', function () {
            expect(data.title).to.be.equal('通知：提现说明：');
        });

        it('规则数量为：9', function () {
            expect(data.rulesLength).to.be.equal(10);
        });

        it('规则内容正确', function () {
            expect(data.rules).to.be.eql([
                '摇一摇红包活动将于2019年2月28日下线！',
                '1.登录领取摇一摇红包的QQ号码，可提现红包余额到该QQ号码的钱包；',
                '2.单个红包有效期30天，过期系统回收；',
                '3.可提现金额等于红包金额及提现额度的最小值，用户提现或兑换礼物成功后，将消耗对应提现额度；',
                '4.红包金额四舍五入保留两位小数进行发放；',
                '5.每位用户活动期间仅可兑换一次礼物，礼物兑换将会消耗对应的额度；',
                '6.请注意哦~用户每天至多可以申请提现或兑换礼物一次，初始提现额度为1元；',
                '7.由于国家和央视加强对网络支付的监管，根据相关政策规定，Now直播需对所有涉及现金类提现业务统一调整，提现需要用户实名认证；',
                '8.提现后预计两个工作日将发放至QQ钱包，请到QQ钱包-点击QQ钱包余额数字-交易记录查看；',
                '9.如有其他问题，可通过添加QQ2群：708456280，联系NOW直播客服（1群676601895已暂停使用）；',
            ]);
        });
    });
});
