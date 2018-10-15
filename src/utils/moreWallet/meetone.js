/**
 *
 * meetone 钱包所有接口
 *
 */

import Bridge from 'meet-bridge'; // meetone JS
import * as compareVersions from 'compare-versions';
import { GetUrlPara } from '@/utils/public';
import axios from 'axios';

// store
import store from '../../store';

let bridge = null; // meetone

const MeetOne = {
  /* -------- 初始化 start -------- */
  init() {
    bridge = new Bridge();
  },
  /* -------- 初始化 end -------- */

  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    const listen = (e) => {
      // 协议请求参数
      const message = e.data;
      // 协议 - 返回数据
      const { params } = JSON.parse(message);
      const res = JSON.parse(decodeURIComponent(atob(params)));
      if (res.code !== 0) {
        callback('e', null);
        return;
      }
      const newData = {
        account_name: res.data.account,
      };
      callback(null, newData);

      //  取消监听
      window.document.removeEventListener('message', listen);
    };
    window.document.addEventListener('message', listen);
    const uri = bridge.invokeAuthorizeInWeb({});
    window.postMessage(uri);
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    const version = GetUrlPara().meetone_version;
    let available = false;
    if (!version) {
      callback(null, available);
      return;
    }
    available = compareVersions(version, '1.2.1') >= 0;
    callback(null, available);
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    const newParams = {
      code: params.code,
      symbol: params.coin,
      account: store.state.app.accountInfo.account_name,
    };
    axios.post('https://api.bp.fish/v1/chain/get_currency_balance', JSON.stringify(newParams)).then((res) => {
      if (!res.data.length) {
        callback(null, `0.0000 ${params.coin}`);
        return;
      }
      const returnData = res.data[0];
      callback(null, returnData);
    }).catch((e) => {
      console.log(`e: ${e}`); // eslint-disable-line
    });
  },
  /* -------- 获取余额 end -------- */

  /* -------- 转账 start -------- */
  transfer(myparams, callback) {
    const listen = (e) => {
      // 协议请求参数
      const message = e.data;
      // 协议 - 返回数据
      const { params } = JSON.parse(message);
      const res = JSON.parse(decodeURIComponent(atob(params)));
      if (res.code !== 0) {
        if (res.code === 100) {
          return;
        }
        callback('e', null);
        // 取消监听
        window.document.removeEventListener('message', listen);
        return;
      }
      // 取消监听
      window.document.removeEventListener('message', listen);
      callback(null, res);
    };
    window.document.addEventListener('message', listen);
    const uri = bridge.invokeTransfer({
      amount: parseFloat(myparams.quantity),
      to: store.state.app.toAccount,
      tokenName: myparams.tokenName,
      tokenContract: myparams.code,
      tokenPrecision: myparams.precision,
      orderInfo: myparams.memo,
      memo: myparams.memo,
    });
    window.postMessage(uri);
  },
  /* -------- 转账 end -------- */

  /* -------- 签名 start -------- */
  signText(text, callback) {
    const listen = (e) => {
      // 协议请求参数
      const message = e.data;
      // 协议 - 返回数据
      const { params } = JSON.parse(message);
      const res = JSON.parse(decodeURIComponent(atob(params)));
      if (res.code !== 0) {
        if (res.code === 100) {
          return;
        }
        callback('e', null);
        // 取消监听
        window.document.removeEventListener('message', listen);
        return;
      }
      // type === 6,meetone签名接口
      if (res.type === 6) {
        callback(null, res.data.signature);
        // 取消监听
        window.document.removeEventListener('message', listen);
      }
    };
    window.document.addEventListener('message', listen);

    const uri = bridge.invokeSignature({
      data: text,
    });
    window.postMessage(uri);
  },
  /* -------- 签名 end -------- */
};
export default MeetOne;
