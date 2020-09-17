# 02. 简单静态页面

从本节开始，我们通过几个例子看看具体的 matman 具体的工作方式，我们的项目中同样内置了单元测试的文件，与普通的 `mocha、chai` 单元测试没有什么区别，大家直接查看 `test/unit` 下的文件即可。

## 1. 测试概述

<img src="./simple.assets/image-20200522093401304.png" alt="image-20200522093401304" style="zoom:33%;" />

简单静态页面的结构如上。

我们需要测试的页面元素为下面几部分：

- 图片正确展示
- 规则说明正确显现
- 同意与不同意按钮显示
- 友情提示正确显示

## 2. 获取页面数据快照

> 在示例文件中，我们给出了两种编写爬虫方式
>
> - 直接使用 jQuery
> - 使用 web-crawl-util 的 API
>
> 在这里我们只展示使用 web-crawl-util 的 API 的版本

### 2.1 爬虫脚本

在 `DevOps/matman-app/case_modules/page-simple/crawlers/get-page-info.js` 文件中，有我们获取页面信息内容的脚本

```js
const { useJquery } = require('web-crawl-util');

module.exports = () => {
  return {
    topImageInfo: getTopImageInfo(),
    middleRule: getMiddleRule(),
    buttonCondition: getButtonCondition(),
    oneLineText: getOneLineText(),
    remarks: 'Got data by npm package: web-crawl-util',
  };
};

/**
 * 顶层图片信息
 */
function getTopImageInfo() {
  const parentSelector = '#anchors';

  const result = {
    isExist: useJquery.isExist(parentSelector),
  };

  if (result.isExist) {
    result.anchor1 = useJquery.getImageDomUrl('.use-img', parentSelector);
    result.anchor2 = useJquery.getBackgroundImageUrl('.use-background', parentSelector);
  }

  return result;
}

/**
 * 规则说明
 */
function getMiddleRule() {
  const parentSelector = '#rules';

  const result = {
    isExist: useJquery.isExist(parentSelector),
  };

  if (result.isExist) {
    result.text = useJquery.getText(parentSelector);
  }

  return result;
}

/**
 * 获取按钮状态
 */
function getButtonCondition() {
  const parentSelector = '.btn-group';

  const result = {
    isExist: useJquery.isExist(parentSelector),
  };

  if (result.isExist) {
    result.active_btn = useJquery.getText('.active', parentSelector);
    result.disable_btn = useJquery.getText('.disable', parentSelector);
  }

  return result;
}

/**
 * 获取不能换行的文本
 */
function getOneLineText() {
  const parentSelector = '#tips';

  const result = {
    isExist: useJquery.isExist(parentSelector),
  };

  if (result.isExist) {
    result.isOneLine = useJquery.getStyle('div.long-word', parentSelector).isOneLine;
    result.text = useJquery.getText('div.long-word', parentSelector);
  }

  return result;
}

```

### 2.2 启动脚本

在 `DevOps/matman-app/case_modules/page-simple/basic-check.js` 文件中，我们利用matman 编写端到端测试的逻辑，内容如下（需要注意的是我们一定需要一个 action 这样才可以捕捉页面的快照）：

```js
const path = require('path');
const { createPageDriver } = require('../../helpers');
const { WAIT } = require('./env');

module.exports = async pageDriverOpts => {
  // 创建 PageDriver
  const pageDriver = await createPageDriver(__filename, pageDriverOpts);

  await pageDriver.setPageUrl('http://now.qq.com/simple');

  await pageDriver.addAction('init', async page => {
    await page.waitFor(WAIT.READY);
  });

  return await pageDriver.evaluate(path.resolve(__dirname, './crawlers/get-page-info.js'));
};
```

使用 matman 执行无头浏览器模拟浏览，调用爬虫脚本得到数据快照。

## 3. 测试样例文件

在 `test/e2e/page-simple/basic-check.test.js` 文件中，我们可以对捕捉到的页面快照进行校验，确认页面状态：

```js
const {expect} = require('chai');

const checkPage = require('../../../DevOps/matman-app/case_modules/page-simple/basic-check');

describe('simple 页面：常规检查-普通静态页面', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await checkPage({
      show: false,
      doNotCloseBrowser: false,
      useRecorder: true,
    });
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = matmanResult.get('init');
    });

    it('顶层图片检查通过', function () {
      expect(data.topImageInfo).to.eql({
        anchor1:
          '//pic.url.cn/hy_personal/33ab1df8c733dfb724654cb8d9b8fe91647fc4ed4ade9ec4002d92f0e8867248/640',
        anchor2:
          'http://pic.url.cn/hy_personal/e308b9c90742cc3c5c67334b6db49b19f891e8d507212fde3af431b8b8597b02/640',
        isExist: true,
      });
    });

    it('规则文案检查通过', function () {
      expect(data.middleRule).to.eql({
        isExist: true,
        text:
          '规则说明：1.第一条规则；2.第二条规则；3.第三条规则，这条规则很长，会自动换行展示自动换行展示自动换行展示自动换行展示自动换行展示；同意不同意',
      });
    });

    it('按钮样式检查通过', function () {
      expect(data.buttonCondition).to.eql({
        isExist: true,
        active_btn: '同意',
        disable_btn: '不同意',
      });
    });

    it('文字单行检查通过', function () {
      expect(data.oneLineText).to.eql({
        isExist: true,
        isOneLine: true,
        text:
          '我简单说两句，我很长，但是不能够换行不能够换行不能够换行不能够换行不能够换行不能够换行不能够换行',
      });
    });
  });
});

```

## 4. 测试结果

<img src="./simple.assets/image-20200522155206545.png" alt="image-20200522155206545" style="zoom:50%;" />

