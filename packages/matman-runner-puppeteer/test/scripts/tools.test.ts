import 'mocha';
import { expect } from 'chai';

import { getPuppeteerDefinedDevice } from '../../src/tools';

describe('./DeviceInstance.ts', () => {
  describe('check getPuppeteerDefinedDevice(name)', () => {
    it('exist: iPhone 6', () => {
      const result = getPuppeteerDefinedDevice('iPhone 6');

      expect(result).to.eql({
        name: 'iPhone 6',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      });
    });

    it('not exist: iPhone 66666', () => {
      const result = getPuppeteerDefinedDevice('iPhone 66666');

      expect(result).to.be.undefined;
    });
  });
});
