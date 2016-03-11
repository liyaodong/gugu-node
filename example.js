import CONFIG from './config';
import Gugu from './lib/index';

const inst = new Gugu(CONFIG);

const strs = [
  {
    type: 'text',
    value: 'Hello',
  },
  {
    type: 'text',
    value: 'world',
  },
];

// inst.setup()
//   .then(() => inst.print(strs))
//   .then(() => console.log('print ok'))
//   .catch(inst._catchErr);


inst._flatStrArray(strs).catch(inst.catchErr);
