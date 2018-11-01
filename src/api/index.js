export const baseUrl = 'http://120.220.14.100:8581';
const onedexApi = 'http://120.220.14.100:8088';

export const api = {
    checkServer: '/exchangeApi/service/getserverhealthy',
    tradeSymbolList: '/exchangeApi/wallet/trade_symbol_new',
    eosAssetList: '/exchangeApi/wallet/geteoswalletasset',
    tradeQuatationsList: '/exchangeApi/wallet/trade_quotations',
    orderMap: `${onedexApi}/onedex/v1/order/book`,
    currentOrderList: `${onedexApi}/onedex/v1/order/current`,
    historyOrderList: `${onedexApi}/onedex/v1/order/history`,
    symbolScope: `${onedexApi}/onedex/v1/symbol/mapping`, // 222.180.164.141
};
