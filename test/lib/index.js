import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const assert = chai.assert;


import CONFIG from '../../config.example';
import Gugu from '../../lib/index';

describe('GUGU sdk', () => {
  const test = new Gugu();
  const test1 = new Gugu(CONFIG);

  it('shoudle pass config', () => {
    assert.ok(typeof test.CONFIG === 'undefined');
    assert.ok(typeof test1.CONFIG === 'object');
  });

  describe('#_flatStrArray', () => {
    const printArr = [
      { type: 'text', value: 'Test 101' },
      { type: 'pic', value: 'test/images/cat.jpg' },
      { type: 'pic_url', value: 'http://3.im.guokr.com/OYnNTiIv7BqE3mKECxYluSRBssRB7HUdfIAwF_QrhxwAAQAAAAEAAFBO.png' },
    ];

    it('should return str join with | and have same length', () => {
      assert.ok(test1._flatStrArray(printArr).then(d => d.split('|').length === printArr.length));
    });
  });

  describe('#_encodPic', () => {
    it('#_encodePic should reject none exist image', () => {
      assert.isRejected(test1._encodePic('xxx'));
    });
  });

  describe('#print', () => {
    it('should reject when empty str', () => {
      assert.isRejected(test1.print(''));
      assert.isRejected(test1.print());
    });
  });
});
