// import assert from 'assert';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const assert = chai.assert;


import CONFIG from '../../config';
import Gugu from '../../lib/index';

describe('GUGU sdk', () => {
  const test = new Gugu();
  const test1 = new Gugu(CONFIG);

  it('shoudle pass config', () => {
    assert.ok(typeof test.CONFIG === 'undefined');
    assert.ok(typeof test1.CONFIG === 'object');
  });

  describe('#print', () => {
    it('should reject when empty str', () => {
      assert.isRejected(test1.print(''));
      assert.isRejected(test1.print());
    });

    const printArr = [
      { type: 'text', value: 'Test 101' },
      { type: 'text', value: 'Test 101' },
      { type: 'text', value: 'Test 101' },
      // { type: 'pic', value: '../images/npm.png' },
      // { type: 'pic_url', value: 'https://dn-geekpark-new.qbox.me/uploads/image/file/6b/24/6b24096efce8f2842c5c764f58acfca9.jpg' },
    ];

    it('#_flatStrArray hould return str join with | and have same length', () => {
      assert.ok(test1._flatStrArray(printArr).then(d => d.split('|').length === printArr.length));
    });
  });
});
