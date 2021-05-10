import puppeteer from 'puppeteer';

export function getPuppeteerDefinedDevice(name: string): puppeteer.devices.Device | undefined {
  // https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
  return puppeteer.devices[name];
}
