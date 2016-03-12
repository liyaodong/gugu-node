# gugu-node

## Install
`$ npm i gugu-node`

> If you need print picture, you should install [GraphicsMagick](http://www.graphicsmagick.org/)
>
> `$ brew install graphicsmagick`

## Usage

### Tiny Example
```javascript
import Gugu from 'gugu-node';

const gu = new Gugu({
  useridentifying: 'xxxxxx',
  memobirdID: 'xxxxxxxxxxxx',
  ak: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
});

gu.setup()
  .then(gu => gu.print('hello, world!'))
  .catch(gu.catchErr);
```

### Print Array && Image

```javascript
import Gugu from 'gugu-node';
import CONFIG from './config';

const gu = new Gugu(CONFIG);

const printArr = [
  { type: 'text',  value: 'Hello, Arr' },
  { type: 'pic',   value: 'images/test.png' },
  { type: 'pic_url', value: 'http://abc.xyz/images/xxx.png' },
];

gu.setup()
  .then(() => gu.print('Hello, World!'))
  .then(() => gu.print(printArr))
  .then(() => console.log('all print task have done!'))
  .catch(gu.catchErr);
```

## Example
`$ npm run example`

## Test
`$ npm run test`

## TODO
* CLI version

## License

(The MIT License)

Copyright (c) 2010 [Aaron Heckmann](aaron.heckmann+github@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
