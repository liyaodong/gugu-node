import fs from 'fs';
import rp from 'request-promise';
import Promise from 'bluebird';
import iconv from 'iconv-lite';

const URL = {
  bind: 'http://open.memobird.cn/home/setuserbind',
  print: 'http://open.memobird.cn/home/printpaper',
};

class Gugu {
  constructor(CONFIG) {
    if (typeof CONFIG === 'undefined') {
      console.log('undefined CONFIG');
      return;
    }

    this.CONFIG = CONFIG;
    this.isReady = true;
  }

  setup() {
    return this._bindAccount()
      .catch(() => Promise.reject('setup fail, please check your config'));
  }

  print(str) {
    if (typeof str === 'undefined' || str.length === 0) {
      return Promise.reject('#print str can not be empty');
    }

    if (!this.isReady) return Promise.reject('print fail, initialize fail');

    return Promise.resolve()
      .then(() => Array.isArray(str) ? this._flatStrArray(str) : this._encode(str))
      .then(printcontent => this._request('print', { printcontent }));
  }

  catchErr(e) {
    if (typeof e.message !== 'undefined') console.error(`ERR: ${e.message}`);
    else console.error(`ERR: ${e}`);
  }

  // private

  _bindAccount() {
    return this._request('bind').then(d => {
      if (d.showapi_res_code === 1) {
        this.isReady = true;
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

    // console.log(Object.assign(params, defaultParams));
    //
    // return Promise.resolve();

    return rp({
      uri: URL[type],
      method: 'post',
      json: true,
      body: Object.assign(params, defaultParams),
    });
  }

  _flatStrArray(str) {
    const deal = {
      text: s => this._encode(s),
      pic: p => this._encodePic(p),
      pic_url: url => this._request(url).then(d => this._encodePic(d)),
    };

    if (str.some(val => deal[val.type] === undefined || val.value === undefined)) {
      return Promise.reject('array item shoule have prop :type && :value');
    }

    return Promise.all(str.map(item => deal[item.type](item.value)))
      .then(arr => arr.join('|'));
  }

  _encode(str) {
    return `T:${iconv.encode(str, 'gbk').toString('base64')}`;
  }

  _readPicFs(path) {
    return new Promise((res, rej) => {
      fs.readFile(path, (err, buffer) => {
        if (err) rej(err);
        if (buffer) res(buffer);
      });
    });
  }

  _encodePic() {

  }
}

export default Gugu;
