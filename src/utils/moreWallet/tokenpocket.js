/**
 *
 * token pocket 全部接口
 *
 */
import Tp from 'tp-eosjs'; // tokenpocket JS
import * as compareVersions from 'compare-versions';

// store
import store from '../../store';

let tokenpocket = null; // token pocket

const TokenPocket = {
  /* -------- 初始化 start -------- */
  init() {
    tokenpocket = Tp;
  },
  /* -------- 初始化 end -------- */

  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    tokenpocket.getCurrentWallet().then((data) => {
      if (!data.result) {
        callback(data, null);
        return;
      }
      const newData = {
        account_name: data.data.name,
        address: data.data.address,
      };
      callback(null, newData);
    }).catch((e) => {
      alert(`err: ${e}`); // eslint-disable-line
    });
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    tokenpocket.getAppInfo().then(((data) => {
      let available = false;
      if (data.data.system === 'android') {
        available = compareVersions(data.data.version, '0.4.7') >= 0;
      } else {
        available = compareVersions(data.data.version, '0.4.5') >= 0;
      }
      callback(null, available);
    })).catch((e) => {
      callback(e, null);
    });
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    tokenpocket.getEosBalance({
      account: store.state.app.accountInfo.account_name,
      contract: params.code,
      symbol: params.coin,
    }).then((data) => {
      if (!data.result) {
        callback(data, null);
        return;
      }
      if (!data.data.balance.length) {
        callback(null, `0.0000 ${params.coin}`);
        return;
      }
      // 处理返回多个币种余额
      for (let i = 0; i < data.data.balance.length; i += 1) {
        const arr = data.data.balance[i].split(' ');
        if (arr[1] === params.coin.toUpperCase()) {
          const returnData = data.data.balance[i];
          callback(null, returnData);
          return;
        }
      }
      callback(null, `0.0000 ${params.coin}`);
      // const returnData = data.data.balance[0];
      // callback(null, returnData);
    });
  },
  /* -------- 获取余额 end -------- */

  /* -------- 转账 start -------- */
  transfer(params, callback) {
    tokenpocket.eosTokenTransfer({
      from: store.state.app.accountInfo.account_name,
      to: store.state.app.toAccount,
      amount: parseFloat(params.quantity),
      tokenName: params.tokenName,
      precision: params.precision,
      contract: params.code,
      memo: params.memo,
      address: store.state.app.accountInfo.address,
    }).then((data) => {
      if (!data.result) {
        callback(data, null);
        return;
      }
      callback(null, data);
    }).catch((e) => {
      alert(`e: ${e}`); // eslint-disable-line
    });
  },
  /* -------- 转账 end -------- */

  /* -------- 签名 start -------- */
  signText(text, callback) {
    const params = {
      from: store.state.app.accountInfo.account_name,
      publicKey: store.state.app.accountInfo.address,
      signdata: text,
    };
    tokenpocket.eosAuthSign(params).then((data) => {
      if (!data.result) {
        callback(data, null);
        return;
      }
      const res = data.data;
      callback(null, res);
    }).catch((e) => {
      alert(`e: ${JSON.stringify(e)}`); // eslint-disable-line
    });
  },
  /* -------- 签名 end -------- */

  /* -------- 获取账户列表 start -------- */
  getWalletList(callback) {
    const params = 'eos';
    tokenpocket.getWalletList(params).then((data) => {
      // alert(JSON.stringify(data)); // eslint-disable-line
      // if (!data.result) {
      //   callback(data, null);
      //   return;
      // }
      callback(null, data.wallets.eos);
    }).catch((e) => {
      alert(`e: ${JSON.stringify(e)}`); // eslint-disable-line
    });
  },
  /* -------- 获取账户列表 end -------- */
};

export default TokenPocket;
