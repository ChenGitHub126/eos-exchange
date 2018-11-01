
/**
 * scatter 所有接口
 */
import Eos from 'eosjs';
import Ecc from 'eosjs-ecc';
import config from '../../config';

// store
import store from '../../store';

// 配置
const EosJs = Eos(config.scatterConfig.eosConfig);
// 网络
const network = config.scatterConfig.network;
const eosOptions = config.scatterConfig.eosOptions;

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
      this.scatterEosJs = this.scatter.eos(network, Eos, eosOptions, config.scatterConfig.network.protocol);
      this.hasScatter = true;
      // 登出
      // if (self.scatter.identity) {
      //   window.scatter.forgetIdentity(); // 登出
      // }
      window.scatter = null;
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

    this.EosJs.getCurrencyBalance(newParams).then((res) => {
      if (!res.length) {
        callback(null, `0.0000 ${params.coin}`);
        return;
      }
      const returnData = res[0];
      callback(null, returnData);
    }).catch((e) => {
        console.log(`e: ${e}`); // eslint-disable-line
    });
    //     const param = {
    //         scope: store.state.app.accountInfo.account_name,
    //     };
    //   this.EosJs.getTableRows(param).then(res => {
    //       console.log(res);
    //   })
  },
  /* -------- 获取余额 end -------- */

  bids(param, callback) {
    try {
      this.scatterEosJs.contract(config.scatterConfig.contract).then((res) => {
        res.bid(param.maker, param.quantity, param.price, param.bid_contract, 1, param.uuid, param.authorization)
          .then((res) => {
            callback(false, res);
          }).catch((err) => {
            callback(true, err);
          });
      });
    } catch (e) {
      console.log(e);
    }
  },

  ask(param, callback) {
    try {
      this.scatterEosJs.contract(config.scatterConfig.contract).then((res) => {
        res.ask(param.maker, param.quantity, param.price, param.ask_contract, 1, param.uuid, param.authorization)
          .then((res) => {
            callback(false, res);
          }).catch((err) => {
            callback(true, err);
          });
      });
    } catch (e) {
      console.log(e);
    }
  },

  cancel(param, callback) {
    try {
      this.scatterEosJs.contract(config.scatterConfig.contract).then((res) => {
        res.cancelorder(param.scope, param.maker, param.uuid, param.authorization)
          .then((res) => {
            callback(false, res);
          }).catch((err) => {
            callback(true, err);
          });
      });
    } catch (e) {
      console.log(e);
    }
  },

  /* -------- 获取账户信息 start ------- */
  /*
  * 获取钱包身份
  * get scatter identityInfo => publicKey
  */
  getAccount(callback, permissionCb) {
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

  getPermission(accountName, callback) {
    this.scatterEosJs.getAccount(accountName).then((res) => {
      let flag = false;
      let key = '';
      if (res.permissions) {
        const permissions = res.permissions;
        permissions.forEach((v, i, arr) => {
          if (v.required_auth.keys[0].key) {
            key = v.required_auth.keys[0].key;
          }
          if (v.required_auth.accounts.length > 0) {
            const auth = v.required_auth;
            const accounts = auth.accounts;
            accounts.forEach((v, i, arr) => {
              if (v.permission.actor === config.scatterConfig.contract && v.permission.permission === 'eosio.code') {
                flag = true;
              }
            });
          }
        });
      }
      callback(flag, key);
    }).catch((err) => {
      console.log(err);
    });
  },

  updateauth(key, callback) {
    const auth = {
      threshold: 1,
      keys: [
        {
          key,
          weight: 1,
        },
      ],
      accounts: [
        {
          permission: {
            actor: config.scatterConfig.contract,
            permission: 'eosio.code',
          },
          weight: 1,
        },
      ],
      waits: [],
    };
    this.scatterEosJs.updateauth(store.state.app.accountInfo.account_name, 'active', 'owner', auth, {
      authorization: `${store.state.app.accountInfo.account_name}@active`,
    }).then((res) => {
      callback(true);
    }).catch((err) => {
      callback(false);
    });
  },

  /*
  * 获取eos账号信息
  * @params eosAccount
  * @return 账户信息
  */
  // getAccountMain(callback) {
  //   const params = {
  //     account_name: this.scatter.identity.accounts[0].name,
  //   };
  //   this.EosJs.getAccount(params).then(callback).catch(e => this.errorCall(e, callback));
  // },

  /* -------- 签名 start -------- */
  /*
  * 给定的公钥的私钥对任意数据进行签名
  * @params publicKey EOS账户的公钥
  * @params data EOS账户名+时间戳
  * @params whatFor 标题
  * @params isHash data是否为hash
  */
  // signText(text, callback) {
  //   const self = this;
  //   self.getAccountMain((res) => {
  //     // onechain getAccountMain方法连续返回两次 - 1.正常 / 2.错误 - 这个作为容错处理。
  //     if (res.error) {
  //       return;
  //     }
  //     const permission = self.scatter.identity.accounts[0].authority;
  //     const publicKey = res.permissions.find(v => v.perm_name === permission).required_auth.keys[0].key;
  //     const data = text;
  //     const whatFor = '';
  //     const isHash = false;
  //
  //     self.scatter.getArbitrarySignature(publicKey, data, whatFor, isHash).then((signature) => {
  //       callback(null, signature);
  //     }).catch((error) => {
  //       callback(error, null);
  //     });
  //   });
  // },
  /* -------- 签名 end -------- */

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
