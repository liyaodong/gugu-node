import CONFIG from './config';
import Gugu from './lib/index';

const inst = new Gugu(CONFIG);

const strs = [
  {
    type: 'text',
    value: 'Hello, World!',
  },
  {
    type: 'pic',
    value: 'test/images/cat.jpg',
  },
  {
    type: 'pic_url',
    value: 'http://3.im.guokr.com/OYnNTiIv7BqE3mKECxYluSRBssRB7HUdfIAwF_QrhxwAAQAAAAEAAFBO.png',
  },
];

inst.setup()
  .then(z => z.print(strs))
  .then(() => console.log('print ok!'))
  .catch(inst.catchErr);
