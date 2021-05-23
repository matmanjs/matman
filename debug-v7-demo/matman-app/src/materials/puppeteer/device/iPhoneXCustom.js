const { DeviceInstance } = require('../../../../../../packages/matman-plugin-puppeteer');

module.exports = clone => {
  // https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
  const device = clone('iPhone X');

  // 修改 ua
  device.userAgent = `${device.userAgent} mycustomeua`;

  // 修改视窗大小
  device.viewport.width = 375;
  device.viewport.height = device.viewport.height + 100;

  return new DeviceInstance('自定义的 iPhone X机型', device);
};
