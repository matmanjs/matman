import 'mocha';
import {expect} from 'chai';

import DeviceConfig from '../../../src/config/DeviceConfig';

describe('check config/DeviceConfig.js', () => {
  describe('check constructor(opts)', () => {
    it('if opts is String', () => {
      expect(new DeviceConfig('myname')).to.eql({
        name: 'myname',
      });
    });

    it('if opts is Object', () => {
      expect(
        new DeviceConfig({
          name: 'myname-from-object',
          width: 600,
          height: 300,
          UA: 'hello i am new ua',
        }),
      ).to.eql({
        name: 'myname-from-object',
        width: 600,
        height: 300,
        UA: 'hello i am new ua',
      });
    });
  });
});
