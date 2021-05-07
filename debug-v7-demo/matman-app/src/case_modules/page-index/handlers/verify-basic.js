module.exports = async pageDriver => {
  // 加载页面地址
  await pageDriver.setPageUrl('https://now.qq.com/index.html');

  // 第一步：开始操作之前
  await pageDriver.addAction('init', async (page) => {
    await page.waitFor('#root .verify-identity');
    await page.waitFor('#name-value');
  });

  // 第二步：姓名输入框输入: 至尊宝
  await pageDriver.addAction('inputName', async (page) => {
    await page.type('#name-value', '至尊宝');
  });

  // 第三步：尝试点击验证按钮
  await pageDriver.addAction('clickBtnWithoutID', async (page) => {
    await page.click('#verify-btn');
  });

  // 第四步：身份证输入框输入: 431129
  await pageDriver.addAction('inputIdPart1', async (page) => {
    await page.type('#id-value', '431129');
  });

  // 第五步：身份证输入框继续输入: 199909098888
  await pageDriver.addAction('inputIdPart2', async (page) => {
    await page.type('#id-value', '199909098888');
  });

  // 第六步：再次尝试点击验证按钮
  await pageDriver.addAction('clickBtnWithID', async (page) => {
    await page.click('#verify-btn');
    await page.waitFor('.message-tips');
  });

  // 第七步：3s后再次获取页面状态
  await pageDriver.addAction('checkPageStatus', async (page) => {
    await page.waitFor(3000);
  });

  // 获取结果
  return pageDriver;
};
