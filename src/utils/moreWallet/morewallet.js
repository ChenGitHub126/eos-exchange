/**
 *
 * more wallet 钱包所有接口
 *
 */
import mw from 'morewallet.js'; // morewallet JS
import * as compareVersions from 'compare-versions';

const dappName = 'Newdex';

let client = null;

const MoreWallet = {
  /* -------- 初始化 start -------- */
  init() {
    client = mw.getClient(dappName);
  },
  /* -------- 初始化 end -------- */

  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    client.getAccount().then(((data) => {
      callback(null, data);
    })).catch((e) => {
      callback(e, null);
    });
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    client.getAppVersion().then(((version) => {
      const userAgent = navigator.userAgent;
      const isAndroid = userAgent.indexOf('Android') > -1 && userAgent.indexOf('Linux') > -1;
      let available = false;
      if (isAndroid) {
        available = compareVersions(version, '1.4.3') >= 0;
      } else {
        available = compareVersions(version, '1.4.2') >= 0;
      }
      callback(null, available);
    })).catch((e) => {
      callback(e, null);
    });
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    client.getCurrencyBalance(params.code, params.coin).then((data) => {
      // 返回值为空
      if (data === ' ') {
        callback(null, `0.0000 ${params.coin}`);
        return;
      }
      callback(null, data);
    }).catch((e) => {
      callback(e, null);
    });
  },
  /* -------- 获取余额 end -------- */

  /* -------- 转账 start -------- */
  transfer(params, callback) {
    client.transfer(params.code, params.toAccount, params.quantity, params.memo).then((data) => {
      callback(null, data);
    }).catch((e) => {
      callback(e, null);
    });
  },
  /* -------- 转账 end -------- */

  /* -------- 签名 start -------- */
  signText(text, callback) {
    client.signText(text).then((data) => {
      callback(null, data);
    }).catch((e) => {
      callback(e, null);
    });
  },
  /* -------- 签名 end -------- */
};

export default MoreWallet;
