module.exports = async pageDriver => {
  // 设置页面地址
  await pageDriver.setPageUrl('https://now.qq.com/withdraw.html');

  // 增加自定义动作
  await pageDriver.addAction('init', async page => {
    await page.waitFor('#loaded');
  });

  return pageDriver;
};
