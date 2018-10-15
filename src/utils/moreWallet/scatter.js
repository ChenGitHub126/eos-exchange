
/**
 * scatter 所有接口
 */
import Eos from 'eosjs';
import Ecc from 'eosjs-ecc';
import axios from 'axios';

// store
import store from '../../store';

const envobj = {
  httpEndpoint: 'https://mainnet.meet.one',
  protocol: 'https',
  host: 'mainnet.meet.one',
  port: 443,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};
// 配置
const EosJs = Eos({
  httpEndpoint: envobj.httpEndpoint,
  chainId: envobj.chainId,
  verbose: false,
});
// 网络
const network = {
  blockchain: 'eos',
  protocol: envobj.protocol,
  host: envobj.host,
  port: envobj.port,
  chainId: envobj.chainId,
};
const eosOptions = {
  broadcast: true,
  sign: true,
  chainId: envobj.chainId,
};

const Scatter = {
  // 保存window.scatter
  scatter: null,
  hasScatter: false,
  Ecc,
  EosJs,
  scatterEosJs: null,

  /* -------- 初始化 start -------- */
  init() {
    if (window.scatter) {
      this.scatter = window.scatter;
      this.scatterEosJs = this.scatter.eos(network, Eos, eosOptions, 'https');
      this.hasScatter = true;
      // 登出
      // if (self.scatter.identity) {
      //   window.scatter.forgetIdentity(); // 登出
      // }
      return;
    }
    setTimeout(() => {
      this.init();
    }, 500);
  },
  /* -------- 初始化 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    setTimeout(() => {
      let available = false;
      // console.log(this.scatter); // eslint-disable-line
      if (this.scatter) {
        available = true;
        callback(null, available);
        return;
      }
      callback(null, available);
    }, 2000);
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

  /* -------- 获取账户信息 start ------- */
  /*
  * 获取钱包身份
  * get scatter identityInfo => publicKey
  */
  getAccount(callback) {
    // alert(this.hasScatter)
    if (!this.hasScatter) {
      setTimeout(() => {
        this.getAccount(callback);
      }, 500);
      return;
    }
    const self = this;
    // 登出
    // if (self.scatter.identity) {
    //   store.dispatch('setAccountInfo', null);
    //   window.scatter.forgetIdentity(); // 登出
    // }
    // 获取授权
    self.scatter.getIdentity({
      accounts: [network],
    }).then((identity) => {
      const newAccount = {
        account_name: identity.accounts[0].name,
      };
      callback(null, newAccount);
    }).catch((error) => {
      // 用户拒绝
      if (error.code === 402) {
        // alert('用户拒绝')
        self.scatter.forgetIdentity();
        return false;
      }
      // 未解锁
      if (error.code === 423) {
        // alert('未解锁')
        // setTimeout(() => {
        //   this.getIdentity(callback);
        // }, 1000);
        return false;
      }
      return '';
    });
  },
  /* -------- 获取账户信息 end ------- */

  /*
  * 获取eos账号信息
  * @params eosAccount
  * @return 账户信息
  */
  getAccountMain(callback) {
    const params = {
      account_name: this.scatter.identity.accounts[0].name,
    };
    this.EosJs.getAccount(params).then(callback).catch(e => this.errorCall(e, callback));
  },

  /* -------- 签名 start -------- */
  /*
  * 给定的公钥的私钥对任意数据进行签名
  * @params publicKey EOS账户的公钥
  * @params data EOS账户名+时间戳
  * @params whatFor 标题
  * @params isHash data是否为hash
  */
  signText(text, callback) {
    const self = this;
    self.getAccountMain((res) => {
      // onechain getAccountMain方法连续返回两次 - 1.正常 / 2.错误 - 这个作为容错处理。
      if (res.error) {
        return;
      }
      const permission = self.scatter.identity.accounts[0].authority;
      const publicKey = res.permissions.find(v => v.perm_name === permission).required_auth.keys[0].key;
      const data = text;
      const whatFor = '';
      const isHash = false;

      self.scatter.getArbitrarySignature(publicKey, data, whatFor, isHash).then((signature) => {
        callback(null, signature);
      }).catch((error) => {
        callback(error, null);
      });
    });
  },
  /* -------- 签名 start -------- */

  /* -------- 转账 start ------- */
  /*
  * 转账/交易 操作
  * @params code 智能合约
  * @params toAccount 收款者
  * @params quantity  转账额度 如：'7.0000 SYS'
  * @memo 转账备注
  */
  transfer(obj, callback) {
    const formName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
    const quantity = obj.quantity;
    const params = {
      actions: [
        {
          account: obj.code,
          name: 'transfer',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            from: formName,
            to: obj.toAccount,
            quantity,
            memo: obj.memo,
          },
        },
      ],
    };
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 转账 end ------- */

  //  catch 错误回调
  errorCall(e, callback) {
    let back = {
      error: {
        code: '0001',
      },
      message: 'Unknown anomaly',
    };
    if (typeof (e) === 'object') {
      if (e.code === 402) {
        back = {
          error: {
            code: '402',
          },
          message: 'User rejected the signature request',
        };
      }
    }
    if (typeof (e) === 'string') {
      if (e.indexOf('code') >= 0) {
        back = JSON.parse(e);
      } else {
        back = {
          error: {
            code: '0002',
          },
          message: 'Failed to get the balance',
        };
      }
    }
    callback(back, null);
  },
};

export default Scatter;


// WEBPACK FOOTER //
// ./src/utils/moreWallet/scatter.js
