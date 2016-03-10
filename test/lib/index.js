import assert from 'assert';

import CONFIG from '../../config';
import { Init } from '../../lib/index';

describe('GUGU init', () => {
  const test = new Init();
  const test1 = new Init(CONFIG);

  it('shoudle pass config', () => {
    assert.ok(typeof test.CONFIG === 'undefined');
    assert.ok(typeof test1.CONFIG === 'object');
  });
});
