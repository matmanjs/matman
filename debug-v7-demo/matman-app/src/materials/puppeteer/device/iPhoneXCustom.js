const { DeviceMaterial } = require('../../../../../../packages/matman');

module.exports = clone => {
  // https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
  const device = clone('iPhone X');

  // 修改 ua
  device.userAgent = `${device.userAgent} mycustomeua`;

  // 修改视窗大小
  device.viewport.width = 375;
  device.viewport.height = device.viewport.height + 100;

  return new DeviceMaterial(__filename, device, '自定义的 iPhone X 机型');
};
