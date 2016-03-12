import fs from 'fs';
import gm from 'gm';
import Promise from 'bluebird';
import iconv from 'iconv-lite';
import rp from 'request-promise';

const URL = {
  bind: 'http://open.memobird.cn/home/setuserbind',
  print: 'http://open.memobird.cn/home/printpaper',
};

class Gugu {
  constructor(CONFIG) {
    if (CONFIG === undefined) {
      console.error('ERR: undefined CONFIG');
      return;
    }
    const keys = ['useridentifying', 'memobirdID', 'ak'];
    if (!this._checkExist(CONFIG, keys)) return;

    this.CONFIG = CONFIG;
    this.isReady = true;
  }

  setup() {
    if (this.CONFIG === undefined) Promise.reject('config error');

    return this._bindAccount()
      .then(() => this)
      .catch(() => Promise.reject('can not binding your account'));
  }

  print(str) {
    if (typeof str === 'undefined' || str.length === 0) {
      return Promise.reject('#print str can not be empty');
    }

    if (!this.isReady) return Promise.reject('print fail, initialize fail');

    return Promise.resolve()
      .then(() => Array.isArray(str) ? this._flatStrArray(str) : this._encode(str))
      .then(printcontent => this._request('print', { printcontent }))
      .then(d => {
        if (d.showapi_res_code === 1) {
          return Promise.resolve(d);
        } else if (d.showapi_res_code === 0 && d.result === -3) {
          return Promise.reject('can not connect to memobird');
        }
        return Promise.reject(d);
      });
  }

  catchErr(e) {
    if (typeof e === 'string') console.error(`ERR: ${e}`);
    else if (typeof e.message !== 'undefined') console.error(`ERR: ${e.message}`);
    else console.error(JSON.stringify(e));
  }

  // private

  _checkExist(obj, keys) {
    return keys.every(v => {
      const isExist = obj.hasOwnProperty(v);
      if (!isExist) console.error(`ERR: ${v} is undefined, please check`);
      return isExist;
    });
  }

  _bindAccount() {
    return this._request('bind')
      .then(d => {
        if (d.showapi_res_code === 1) {
          this.isReady = true;
        } else if (d.showapi_res_code === 0) {
          Promise.reject(d.showapi_res_error);
        } else {
          Promise.reject('bindAccount fail');
        }
      });
  }

  _request(type, params = {}) {
    const { ak, memobirdID, useridentifying } = this.CONFIG;
    const defaultParams = {
      ak, memobirdID, useridentifying,
      timestamp: new Date(),
    };
    const body = Object.assign(params, defaultParams);

    return rp({
      uri: URL[type],
      method: 'post',
      json: true,
      body,
    });
  }

  _flatStrArray(str) {
    const deal = {
      text: s => this._encode(s),
      pic: p => this._encodePic(p),
      pic_url: url => rp({ url, encoding: null }).then(d => this._encodePic(d)),
    };

    if (str.some(val => deal[val.type] === undefined || val.value === undefined)) {
      return Promise.reject('array item shoule have prop :type && :value');
    }

    return Promise.all(str.map(item => deal[item.type](item.value)))
      .then(arr => arr.join('|'));
  }

  _encode(str) {
    return `T:${iconv.encode(`${str}\n`, 'gbk').toString('base64')}`;
  }

  _encodePic(image) {
    return new Promise((res, rej) => {
      if (typeof image === 'string') {
        try {
          fs.readFileSync(image);
        } catch (e) {
          rej(e);
        }
      }

      gm(image).resize(384).flip().type('Grayscale').colors(2).toBuffer('bmp', (err, buffer) => {
        if (err) rej(err);
        res(`P:${buffer.toString('base64')}`);
      });
    });
  }
}

export default Gugu;
