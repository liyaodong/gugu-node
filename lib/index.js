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
    this.isReady = false;
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

    let printcontent;

    if (Array.isArray(str)) {
      // printcontent = str.reduce();
    } else {
      printcontent = this._encode(str);
    }

    return this._request('print', { printcontent })
      .catch(() => Promise.reject('print error, please check your code'));
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

    return rp({
      uri: URL[type],
      method: 'post',
      json: true,
      body: Object.assign(params, defaultParams),
    });
  }

  _encode(str) {
    return `T:${iconv.encode(str, 'gbk').toString('base64')}`;
  }
}

export default Gugu;
