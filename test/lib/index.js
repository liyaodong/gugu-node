import assert from 'assert';
// import { expect } from 'chai';

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
    it('can not pass empty str', () => {
      assert.ok(typeof test1.print() === 'undefined');
      assert.ok(typeof test1.print('') === 'undefined');
    });
  });
});
