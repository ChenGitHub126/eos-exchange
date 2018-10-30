/* eslint-disable */
/**
 * 支持的钱包：
 *    morewallet  meetone   tokenpocket   mathwallet
 * default：
 *    支持scatter的所有钱包
 */

// 封装的js
import Scatter from './scatter';
import MoreWallet from './morewallet';
import TokenPocket from './tokenpocket';
import MeetOne from './meetone';

// 来源于哪个APP
let channel = '';

const DApp = {
    obj: null,

    // 设置channel
    setChannel(c) {
        channel = c
        switch (channel) {
            // morewallet
            case 'morewallet':
                this.obj = MoreWallet;
                break;
            // meetone
            case 'meetone':
                this.obj = MeetOne;
                break;
            // tokenpocket
            case 'tokenpocket':
                this.obj = TokenPocket;
                break;
            // scatter & mathwallet
            case 'mathwallet':
            case 'scatter':
                this.obj = Scatter;
                break;
            // 其他钱包支持scatter
            default:
                this.obj = Scatter;
                break;
        }
        this.obj.init();
    },

    // 当前账号信息
    getAccount(callback, permissionCb) {
        this.obj.getAccount(callback, permissionCb);
    },

    // 查询授权
    getPermission(accountName, callback) {
        this.obj.getPermission(accountName, callback);
    },

    // 获取授权
    updateauth(key, callback) {
        this.obj.updateauth(key, callback);
    },

    // 获取app版本，提示更新
    checkAvailable(callback) {
        this.obj.checkAvailable(callback);
    },

    // 获取余额
    getCurrencyBalance(params, callback) {
        this.obj.getCurrencyBalance(params, callback);
    },
    // 买单
    bids(param, callback) {
        this.obj.bids(param, callback);
    },
    // 卖单
    ask(param, callback) {
        this.obj.ask(param, callback);
    },
    // 撤单
    cancel(param, callback) {
        this.obj.cancel(param, callback);
    },
    // 转账
    transfer(params, callback) {
        this.obj.transfer(params, callback);
    },

    // 私钥加密文本
    signText(text, callback) {
        this.obj.signText(text, callback);
    },

    // 获取账户列表
    getWalletList(callback) {
        this.obj.getWalletList(callback);
    },
}

export default DApp;
