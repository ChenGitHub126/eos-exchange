/* eslint-disable */
import CFClient from './cfws';
import moment from 'moment';

const host = /*window.location.host*/'newdex.340wan.com';
let env = '';
switch (host) {
    // case 'dapp.340wan.com':
    case '192.168.8.11:8890':
    case '0.0.0.0:8890':
    case '192.168.8.253:8890':
        env = 'development';
        break;
    case 'dapp.340wan.com':
    // case '192.168.8.253:8890':
    // case '0.0.0.0:8890':
    case 'newdex.340wan.com':
    case 'www.newdex.io':
    case 'test.newdex.io':
    case 'dapp.newdex.io':
    case 'm.newdex.io':
    case 'newdex.io':
        env = 'production';
        break;
    default:
        env = 'local';
        break;
}
const client = new CFClient({env, debug: false});

const Io = {
    lastSubscribe: null,
    subscribeCallback: null,
    // k线图部分
    cfwsKline: function (params) {
        var me = this;
        client.ready(function() {
            var type = 'minute'
            if (params.resolution == '5') {
                type = 'minute5'
            } else if (params.resolution == '15') {
                type = 'minute15'
            } else if (params.resolution == '30') {
                type = 'minute30'
            } else if (params.resolution == '60') {
                type = 'hour'
            } else if (params.resolution == '1D') {
                type = 'day'
            } else if (params.resolution == '1W') {
                type = 'week'
            } else if (params.resolution == '1M') {
                type = 'month'
            }
            var wsCallback = function(data) {
                const res = {
                    resolution: params.resolution,
                    symbol: params.symbol,
                    kline: []
                };
                if (!data) {
                    me.subscribeCallback(res)
                    return;
                };
                data.forEach(e => {
                    res.kline.push({
                        close: e.close,
                        date: me.dataFormat(e.id),
                        high: e.high,
                        low: e.low,
                        open: e.open,
                        time: e.id * 1000,
                        volume: e.volume
                    })
                });
                //   const kitems = me.dataTest();
                //   kitems.forEach(e => {
                //     res.kline.push({
                //       close: e.close,
                //       date: me.dataFormat(e.id),
                //       high: e.high,
                //       low: e.low,
                //       open: e.open,
                //       time: e.id * 1000,
                //       volume: e.vol
                //     })
                //   });
                //   console.log(res)
                me.subscribeCallback(res)
            }
            //请求k线数据
            client.request('kline.' + type, params, function(err, data) {
                // console.log('kline.'+type+' response');
                wsCallback(data)
            })
            if (this.lastSubscribe != null) {
                client.unsubscribe(this.lastSubscribe)
            }
            this.lastSubscribe = 'kline.' + type
            /*
            * 服务推送
            * 需 unsubscribe
            */
            client.subscribe('kline.' + type, function(data) {
                // console.log('kline.'+type+' push');
                wsCallback(data)
            })
        })
    },

    // 交易中心 头部信息
    cfwsHeard: function(params, callback) {
        const symbol = params.symbol;
        client.ready(function() {
            client.subscribe(`ticker.${symbol}`, function(data) {
                callback(data);
            });
        });
    },


    // 交易中心 深度数据
    cfwsDepth: function(params, callback) {
        const symbol = params.symbol;
        client.ready(function() {
            //订阅价格深度
            client.subscribe(`depth.${symbol}`, function(data) {
                if (!data) return;
                callback(data);
            });
        });
    },
//   // 交易中心 订阅价格
//   cfwsPrice: function(params, callback) {
//     const symbol = params.symbol;
//     client.ready(function() {
//       // 订阅价格
//       client.subscribe(`price.${symbol}`, function(data) {
//         if (!data) return;
//         callback(data);
//       });
//     });
//   },

    // 获取交易对的实时数据
//   cfwsPricesSymbol: function(params, callback) {
//     // 订阅所有价格
//     const symbol = params.symbol;
//     client.subscribe(`prices.${symbol}`, function(data) {
//         if (!data) return;
//         callback(data);
//     });
//   },

    // 获取交易对的实时数据
    cfwsPricesSymbol: function(params, callback) {
        // 订阅所有价格
        const symbol = params.symbol;
        client.ready(function() {
            let data = params
            delete data.params
            client.subscribe(`markets.${symbol}`, data, function(data) {
                if (!data) return;
                callback(data);
            });
        });
    },

    // 取消交易对所有推送
    cfwsUnsubscribe: function(params) {
        let unscribe = '*'
        client.ready(function() {
            if (params) {
                unscribe = params;
            }
            client.unsubscribe(unscribe);
        });
    },
    // 账号退出
    accountOut: function(account) {
        client.ready(function() {
            client.request('account.unbind', { accounts: [ account ] });
        });
    },

    //绑定账号
    accountBind: function(account) {
        client.ready(function() {
            client.request('account.bind', { accounts: [ account ] }, function(error) {
                if (error) {
                    console.log('账号绑定失败', error); // eslint-disable-line
                }
            })
        });
    },

    /*
    * 监听订单变动
    * @param way start 开始监听 stop 停掉监听
    */
    addListenerOrder: function(way, callback) {
        client.ready(function() {
            const listener = client.addListener('account.message', function(res){
                callback(res)
            });
            if (way === 'stop') {
                client.removeListener(listener);
            }
        })
    },

    // 时间戳转换
    dataFormat(fdata) {
        return moment.unix(fdata).format('YYYY-MM-DD HH:mm:ss');
    },

    // 搜索功能
    searchWs(params, callback) {
        client.ready(function() {
            client.request('market.markets', { coin: params.coin, key: params.key }, function(err, data) {
                callback(err, data)
            });
        })
    }

};
export default Io
