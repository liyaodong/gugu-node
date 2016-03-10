import CONFIG from './config';
import Gugu from './lib/index';

const inst = new Gugu(CONFIG);

inst.setup()
  .then(() => inst.print('xxx'))
  .then(() => console.log('print ok'))
  .catch(inst._catchErr);
