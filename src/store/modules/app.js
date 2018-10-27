/*
* vuex 全站存储
* get: this.$store.state.模块.state
* 如： this.$store.state.app.language
* set: this.$store.dispatch(actions, value)
* 如： this.$store.dispatch('setLanguage', 'en');
*/


const app = {
  state: {
    language: 'zh-CN', // 多语言
    symbolInfo: localStorage.getItem('symbolInfo') ? JSON.parse(localStorage.getItem('symbolInfo')) : {

    },
    trad: localStorage.getItem('trad') ? JSON.parse(localStorage.getItem('trad')) : { // 交易对默认信息 - key
      id: 1,
      symbol1: 'IQ',
      symbol2: 'EOS',
      code: 'everipediaiq',
      symbol1_code: '',
      symbol2_code: '',
      coinDecimal: 3,
      priceDecimal: 4,
    },
    toAccount: localStorage.getItem('toAccount') ? localStorage.getItem('toAccount') : null, // 智能合约
    accountInfo: localStorage.getItem('accountInfo') ? JSON.parse(localStorage.getItem('accountInfo')) : null, // 账户信息
    permission: false, // 授权信息
    detail: localStorage.getItem('detail') ? JSON.parse(localStorage.getItem('detail')) : null, // 订单详情
    channel: localStorage.getItem('channel') ? localStorage.getItem('channel') : '', // app名称
    precision: localStorage.getItem('precision') ? JSON.parse(localStorage.getItem('precision')) : { // 精度
      coin: 4,
      price: 4,
    },
    coinList: localStorage.getItem('coinList') ? JSON.parse(localStorage.getItem('coinList')) : [], // 币种余额列表
    clickPrice: localStorage.getItem('clickPrice') ? localStorage.getItem('clickPrice') : 0, // 点击价格
    unReadCount: localStorage.getItem('unReadCount') ? Number(localStorage.getItem('unReadCount')) : 0, // 订单未读条数
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      localStorage.setItem('language', language);
    },
    // 默认交易对信息 - function
    SET_SYMBOLINFO: (state, info) => {
      state.symbolInfo = info;
      localStorage.setItem('symbolInfo', JSON.stringify(info));
    },
    // 默认交易对信息 - function
    SET_TRAD: (state, trad) => {
      state.trad = trad;
      localStorage.setItem('trad', JSON.stringify(trad));
    },
    // 委托账户
    SET_TOACCOUNT: (state, toAccount) => {
      state.toAccount = toAccount;
      localStorage.setItem('toAccount', toAccount);
    },
    // 账户信息
    SET_ACCOUNTINFO: (state, accountInfo) => {
      state.accountInfo = accountInfo;
      localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
    },
    // 授权信息
    SET_PERMISSION: (state, permission) => {
      state.permission = permission;
      // localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
    },
    // 订单详情
    SET_DETAIL: (state, detail) => {
      state.detail = detail;
      localStorage.setItem('detail', JSON.stringify(detail));
    },
    // channel
    SET_CHANNEL: (state, channel) => {
      state.channel = channel;
      localStorage.setItem('channel', channel);
    },
    // 精度
    SET_PRECISION: (state, precision) => {
      state.precision = precision;
      localStorage.setItem('precision', JSON.stringify(precision));
    },
    // 余额列表
    SET_COINLIST: (state, coinList) => {
      state.coinList = coinList;
      localStorage.setItem('coinList', JSON.stringify(coinList));
    },
    // 点击价格
    SET_CLICKPRICE: (state, clickPrice) => {
      state.clickPrice = clickPrice;
      localStorage.setItem('clickPrice', clickPrice);
    },
    // 订单未读条数
    SET_UNREADCOUNT: (state, unReadCount) => {
      state.unReadCount = unReadCount;
      localStorage.setItem('unReadCount', unReadCount);
    },
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    // 默认交易对信息 - set
    setSymbolInfo({ commit }, info) {
      commit('SET_SYMBOLINFO', info);
    },
    // 默认交易对信息 - set
    setTrad({ commit }, trad) {
      commit('SET_TRAD', trad);
    },
    // 委托账户
    setToAccount({ commit }, toAccount) {
      commit('SET_TOACCOUNT', toAccount);
    },
    // 账户信息
    setAccountInfo({ commit }, accountInfo) {
      commit('SET_ACCOUNTINFO', accountInfo);
    },
    // 授权信息
    setPermission({ commit }, perimission) {
      commit('SET_PERMISSION', perimission);
    },
    // 订单详情
    setDetail({ commit }, detail) {
      commit('SET_DETAIL', detail);
    },
    // channel
    setChannel({ commit }, channel) {
      commit('SET_CHANNEL', channel);
    },
    // 精度
    setPrecision({ commit }, precision) {
      commit('SET_PRECISION', precision);
    },
    // 余额列表
    setCoinList({ commit }, coinList) {
      commit('SET_COINLIST', coinList);
    },
    // 点击价格
    setClickPrice({ commit }, clickPrice) {
      commit('SET_CLICKPRICE', clickPrice);
    },
    // 订单未读条数
    setUnReadCount({ commit }, unReadCount) {
      commit('SET_UNREADCOUNT', unReadCount);
    },
  },
};

export default app;
