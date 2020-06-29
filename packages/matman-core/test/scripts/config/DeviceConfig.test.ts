import 'mocha';
import {expect} from 'chai';

import DeviceConfig from '../../../src/config/DeviceConfig';

describe('check config/DeviceConfig.js', () => {
  describe('opts is undefined', () => {
    const deviceConfig = new DeviceConfig();

    it('check constructor', () => {
      expect(deviceConfig).to.eql({
        name: 'unknown device',
      });
    });

    it('getConfig()', () => {
      expect(deviceConfig.getConfig()).to.eql({
        name: 'unknown device',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36 matman/DEVICE_CHROME',
        viewport: {
          deviceScaleFactor: 1,
          hasTouch: false,
          height: 600,
          isLandscape: false,
          isMobile: false,
          width: 800,
        },
      });
    });
  });

  describe('opts is mobile', () => {
    const deviceConfig = new DeviceConfig('mobile');

    it('check constructor', () => {
      expect(deviceConfig).to.eql({
        extend: 'iPhone 6',
        name: 'mobile',
      });
    });

    it('getConfig()', () => {
      expect(deviceConfig.getConfig()).to.eql({
        name: 'mobile',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36 matman/DEVICE_CHROME',
        viewport: {
          deviceScaleFactor: 1,
          hasTouch: false,
          height: 600,
          isLandscape: false,
          isMobile: false,
          width: 800,
        },
      });
    });
  });

  describe('opts is othername', () => {
    const deviceConfig = new DeviceConfig('othername');

    it('check constructor', () => {
      expect(deviceConfig).to.eql({
        name: 'othername',
      });
    });

    it('getConfig()', () => {
      expect(deviceConfig.getConfig()).to.eql({
        name: 'othername',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36 matman/DEVICE_CHROME',
        viewport: {
          deviceScaleFactor: 1,
          hasTouch: false,
          height: 600,
          isLandscape: false,
          isMobile: false,
          width: 800,
        },
      });
    });
  });

  describe('opts is obj', () => {
    const deviceConfig = new DeviceConfig({
      name: 'i-am-name',
      userAgent: 'i-am-ua',
      viewport: {
        width: 888,
        height: 666,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false,
      },
    });

    it('check constructor', () => {
      expect(deviceConfig).to.eql({
        name: 'i-am-name',
        userAgent: 'i-am-ua',
        viewport: {
          width: 888,
          height: 666,
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
          isLandscape: false,
        },
        extend: undefined,
      });
    });

    it('getConfig()', () => {
      expect(deviceConfig.getConfig()).to.eql({
        name: 'i-am-name',
        userAgent: 'i-am-ua',
        viewport: {
          width: 888,
          height: 666,
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
          isLandscape: false,
        },
      });
    });
  });
});
