'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = {
  bind: 'http://open.memobird.cn/home/setuserbind',
  print: 'http://open.memobird.cn/home/printpaper'
};

var Gugu = function () {
  function Gugu(CONFIG) {
    _classCallCheck(this, Gugu);

    if (CONFIG === undefined) {
      console.error('ERR: undefined CONFIG');
      return;
    }
    var keys = ['useridentifying', 'memobirdID', 'ak'];
    if (!this._checkExist(CONFIG, keys)) return;

    this.CONFIG = CONFIG;
    this.isReady = true;
    this.userID = null;
  }

  _createClass(Gugu, [{
    key: 'setup',
    value: function setup() {
      var _this = this;

      if (this.CONFIG === undefined) return _bluebird2.default.reject('config error');
      if (this.userID !== null) return _bluebird2.default.resolve();

      return this._bindAccount().then(function () {
        return _this;
      }).catch(function () {
        return _bluebird2.default.reject('can not binding your account');
      });
    }
  }, {
    key: 'print',
    value: function print(str) {
      var _this2 = this;

      if (typeof str === 'undefined' || str.length === 0) {
        return _bluebird2.default.reject('#print str can not be empty');
      }

      if (!this.isReady) return _bluebird2.default.reject('print fail, initialize fail');

      return _bluebird2.default.resolve().then(function () {
        return Array.isArray(str) ? _this2._flatStrArray(str) : _this2._encode(str);
      }).then(function (printcontent) {
        return _this2._request('print', { printcontent: printcontent, userID: _this2.userID });
      }).then(function (d) {
        if (d.showapi_res_code === 1) {
          return _bluebird2.default.resolve(d);
        } else if (d.showapi_res_code === 0 && d.result === -3) {
          return _bluebird2.default.reject('can not connect to memobird');
        }
        return _bluebird2.default.reject(d);
      });
    }
  }, {
    key: 'catchErr',
    value: function catchErr(e) {
      if (typeof e === 'string') console.error('ERR: ' + e);else if (typeof e.message !== 'undefined') console.error('ERR: ' + e.message);else console.error(JSON.stringify(e));
    }

    // private

  }, {
    key: '_checkExist',
    value: function _checkExist(obj, keys) {
      return keys.every(function (v) {
        var isExist = obj.hasOwnProperty(v);
        if (!isExist) console.error('ERR: ' + v + ' is undefined, please check');
        return isExist;
      });
    }
  }, {
    key: '_bindAccount',
    value: function _bindAccount() {
      var _this3 = this;

      return this._request('bind').then(function (d) {
        if (d.showapi_res_code === 1) {
          _this3.isReady = true;
          _this3.userID = d.showapi_userid;
        } else if (d.showapi_res_code === 0) {
          _bluebird2.default.reject(d.showapi_res_error);
        } else {
          _bluebird2.default.reject('bindAccount fail');
        }
      });
    }
  }, {
    key: '_request',
    value: function _request(type) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _CONFIG = this.CONFIG,
          ak = _CONFIG.ak,
          memobirdID = _CONFIG.memobirdID,
          useridentifying = _CONFIG.useridentifying;

      var defaultParams = {
        ak: ak, memobirdID: memobirdID, useridentifying: useridentifying,
        timestamp: new Date()
      };
      var body = Object.assign(params, defaultParams);

      return (0, _requestPromise2.default)({
        uri: URL[type],
        method: 'post',
        json: true,
        body: body
      });
    }
  }, {
    key: '_flatStrArray',
    value: function _flatStrArray(str) {
      var _this4 = this;

      var deal = {
        text: function text(s) {
          return _this4._encode(s);
        },
        pic: function pic(p) {
          return _this4._encodePic(p);
        },
        pic_url: function pic_url(url) {
          return (0, _requestPromise2.default)({ url: url, encoding: null }).then(function (d) {
            return _this4._encodePic(d);
          });
        }
      };

      if (str.some(function (val) {
        return deal[val.type] === undefined || val.value === undefined;
      })) {
        return _bluebird2.default.reject('array item shoule have prop :type && :value');
      }

      return _bluebird2.default.all(str.map(function (item) {
        return deal[item.type](item.value);
      })).then(function (arr) {
        return arr.join('|');
      });
    }
  }, {
    key: '_encode',
    value: function _encode(str) {
      return 'T:' + _iconvLite2.default.encode(str + '\n', 'gbk').toString('base64');
    }
  }, {
    key: '_encodePic',
    value: function _encodePic(image) {
      return new _bluebird2.default(function (res, rej) {
        if (typeof image === 'string') {
          try {
            _fs2.default.readFileSync(image);
          } catch (e) {
            rej(e);
          }
        }

        (0, _gm2.default)(image).resize(384).flip().type('Grayscale').colors(2).toBuffer('bmp', function (err, buffer) {
          if (err) rej(err);
          res('P:' + buffer.toString('base64'));
        });
      });
    }
  }]);

  return Gugu;
}();

exports.default = Gugu;
