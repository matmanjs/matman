const expect = require('chai').expect;

const checkPage = require('../../../packages/matman/test/data/hi-demo/demo_03/src/page_baidu_index/cases/basic-check');

describe('百度首页：使用本地项目测试', function () {
    this.timeout(30000);

    let resultData;

    before(function () {
        return checkPage({ show: false, doNotCloseBrowser: false, useRecorder: false })
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

        it('网站title应该为：hi jack', function () {
            expect(data.title).to.equal('hi jack');
        });

        it('打招呼的文字应该为：你好，我不是 www.baidu.com', function () {
            expect(data.sayHello).to.equal('你好，我不是 www.baidu.com');
        });
    });
});
