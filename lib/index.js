import rp from 'request-promise';

const URL = {
  bind: 'http://open.memobird.cn/home/setuserbind',
};

class Init {
  constructor(CONFIG) {
    if(typeof CONFIG === 'undefined') {
      console.log('undefined CONFIG');
      return;
    }

    this.CONFIG = CONFIG;
    this.isReady = false;

    this._bindAccount();
  }

  _bindAccount() {
    this._request('bind')
      .then(d => {
        if (d.showapi_res_code === 1) this.isReady = true;
        else console.log(d);
      })
      .catch(this._catchErr);
  }

  _request(type) {
    const { ak, memobirdID, useridentifying } = this.CONFIG;

    return rp({
      uri: URL[type],
      method: 'post',
      json: true,
      body: {
        ak, memobirdID, useridentifying,
        timestamp: new Date(),
      },
    });
  }

  _catchErr(e) {
    console.error(e);
  }

}

class Print extends Init {
  super() {

  }
}

export { Init, Print };
