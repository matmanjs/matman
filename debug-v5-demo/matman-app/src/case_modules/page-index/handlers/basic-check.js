module.exports = async pageDriver => {
  // 设置页面地址
  await pageDriver.setPageUrl('https://now.qq.com/index.html');

  // 增加自定义动作
  await pageDriver.addAction('init', async page => {
    await page.waitFor('#root .verify-identity');
  });

  return pageDriver;
};

