<template>
  <div class="trade">
    <!-- coin & 收藏 -->
    <div class="tools">
      <div>
        <span class="symbol" @click="changeSymbol = true">
          <span>
              <!--{{symbol1}}/{{symbol2}}-->
              {{$store.state.app.symbolInfo.name}}
          </span>
          <span class="iconfont icon-huaban37 changeSymbol"></span>
        </span>
        <span class="iconfont icon-huaban29 icon fr" v-if="!isFavorite" @click="handleSelfAdd"></span>
        <span class="iconfont icon-huaban30 icon fr color-this" v-if="isFavorite" @click="handleSelfCancel"></span>
      </div>
       <!--<div class="iconfont " @click="handleSelfAdd(symbol)"></div>-->
      <!--<div class="iconfont" @click="handleSelfCancel(symbol)"></div>-->
    </div>

    <!-- mainContent -->
    <div class="tradeContent">
      <TradeLeft :symbolInfo="symbolInfo"
        :precision="precision"
        :priceDefault="priceDefault"
        :statusInfo="statusInfo"
        :newPrice="toFixed(newPrice, precision.price)" class="item"/>
      <TradeRight :symbolInfo="symbolInfo"
        :newPrice="toFixed(newPrice, precision.price)" class="item"/>
    </div>

    <!-- order -->
    <div class="orderContent">
      <div class="chooseType">
        <span class="type" @click="type = 1" :class="{'active': type === 1}">{{ $t('quotation.nowList') }}</span>
        <span class="type" @click="type = 2" :class="{'active': type === 2}">{{ $t('quotation.oldList') }}</span>
        <span class="fr color-yellow" @click="tipShow = true">
          <span class="iconfont icon-huaban32" style="font-size: .25rem;"></span>
          <span>{{ $t('public.tip') }}</span>
        </span>
      </div>
      <div class="typeList">
        <order-list-now v-if="type === 1" :symbol="symbol" :statusInfo="statusInfo"/>
        <order-list-history v-if="type === 2" :symbol="symbol"/>
      </div>
    </div>

    <!-- 切换交易对 -->
    <mt-popup
      v-model="changeSymbol"
      position="left">
        <change-symbol v-if="changeSymbol" @listenClose="handleClose" />
    </mt-popup>

    <!-- tip -->
    <mt-popup
      class="popup"
      v-model="tipShow">
        <newdex-tip v-if="tipShow" @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import DApp from '@/utils/moreWallet';
import { toFixed } from '@/utils/public';
import OrderListHistory from '@/components/OrderListHistory';
import OrderListNow from '@/components/OrderListNow';
import TradeLeft from '../components/TradeLeft';
import TradeRight from '../components/TradeRight';
import ChangeSymbol from '../components/ChangeSymbol';
import NewdexTip from '../components/NewdexTip';
import { api } from '@/api';

export default {
  data() {
    return {
      changeSymbol: false, // 切换交易对
      tipShow: false, // 提示
      type: 1, // 订单类型  1:当前委托  2:历史委托

      symbol: 'iq_eos',
      symbol1: 'IQ',
      symbol2: 'EOS',
      symbolData: { // 交易对数据
        amount: 0,
        change: 0,
        close: 0,
        count: 0,
        high: 0,
        low: 0,
        open: 0,
        price: 0,
        volume: null,
        precision: {
          coin: 4,
          price: 4,
        },
      },
      symbolInfo: { // 交易对信息
      },
      precision: {
        coin: 4,
        price: 4,
      },
      newPrice: 0,

      priceDefault: { // 挂单价
        buy: '0.0000',
        sell: '0.0000',
      },
      isFavorite: false, // 是否收藏
      statusInfo: { // 交易对上架状态
        status: 0,
      },
    };
  },
  props: [
  ],
  components: {
    OrderListHistory,
    OrderListNow,
    TradeLeft,
    TradeRight,
    ChangeSymbol,
    NewdexTip,
  },
  watch: {
    '$route.params.symbol': function listen() {
      this.handleMouted();
    },
  },
  created() {
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      this.symbolInfo = this.$store.state.app.trad; // ????
      this.precision = this.$store.state.app.precision;
      this.symbol = this.$route.params.symbol.toLowerCase();
      const symbolArr = this.symbol.toUpperCase().split('_');
      this.symbol1 = symbolArr[0];
      this.symbol2 = symbolArr[1];

      this.handlaGetSymbolInfo();
    },
    // 关闭切换币种
    handleClose() {
      this.changeSymbol = false;
      this.tipShow = false;
    },
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },
    // 获取交易对信息
    handlaGetSymbolInfo() {
      console.log('Trade.vue', '获取指定交易对信息');
      this.symbolInfo = {
        symbol1: this.$store.state.app.symbolInfo.name2,
        symbol2: this.$store.state.app.symbolInfo.name1,
        symbol1_code: this.$store.state.app.symbolInfo.code1,
        symbol2_code: this.$store.state.app.symbolInfo.code2,
        coinDecimal: this.$store.state.app.symbolInfo.precision.coin,
        priceDecimal: this.$store.state.app.symbolInfo.precision.price,
      };
      this.$store.dispatch('setTrad', this.symbolInfo);

      this.precision = this.$store.state.app.symbolInfo.precision;

      const params = {
        params: {
          base: this.symbol.toUpperCase().split('_')[1],
          quote: this.symbol.toUpperCase().split('_')[0],
          limit: '1',
        },
      };
      this.$http.get(api.orderMap, params)
        .then((res) => {
          const data = res.data;
          const map = data.map;
          this.priceDefault = {
            buy: map.bids[0] ? map.bids[0].price : '0',
            sell: map.asks[0] ? map.asks[0].price : '0',
          };
        });

      // 查询收藏列表
      this.handleGetSelf();
    },
    /* -------- 交易对收藏 start -------- */
    // 添加收藏
    handleSelfAdd() {
      this.isFavorite = true;
      const list = this.$store.state.app.selfList;
      list.push(this.symbolInfo.symbol1);
      this.$store.dispatch('setSelfList', list);
    },
    // 取消收藏
    handleSelfCancel() {
      const list = this.$store.state.app.selfList;
      list.forEach((v, i, arr) => {
        if (v === this.symbolInfo.symbol1) {
          list.splice(i, 1);
        }
      });
      this.$store.dispatch('setSelfList', list);
      this.isFavorite = false;
    },
    // 获取收藏列表 (判断当前交易对是否在收藏列表)
    handleGetSelf() {
      console.log('TableList.vue', '查询自选列表，判断当前交易对是否在收藏列表');
      const list = this.$store.state.app.selfList;
      list.forEach((v, i, arr) => {
        if (v === this.symbolInfo.symbol1) {
          this.isFavorite = true;
        }
      });
    },
    /* -------- 交易对收藏 end -------- */
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    // handleGetTimestampJson() {
    //   console.log('Trade.vue', '获取服务器时间戳');
    //   this.$http.get('/common/getTimestampJson').then((res) => {
    //     if (res.code !== 0) {
    //       Toast({
    //         message: res.msg,
    //         position: 'center',
    //         duration: 2000,
    //       });
    //       return;
    //     }
    //     const timestamp = res.timestamp;
    //     // 把EOS账户名+时间戳作为字符串交给scatter用publicKey进行签名处理
    //     DApp.signText(`${this.$store.state.app.accountInfo.account_name} ${timestamp}`, (err, data) => {
    //       if (err) {
    //         Toast(this.$t('error.tokenError'));
    //         return;
    //       }
    //       // 针对tp特殊处理对签名
    //       if (this.$store.state.app.channel === 'tokenpocket') {
    //         this.handleTokenPocket(data, timestamp);
    //         return;
    //       }
    //       const signature = data;
    //       this.handleAccountReg(signature, timestamp);
    //     });
    //   });
    // },
    // 权限获取校验
    // handleAccountReg(sign, time) {
    //   const params = {
    //     signature: sign, // 钱包签名
    //     account: this.$store.state.app.accountInfo.account_name, // 账户名
    //     timestamp: time, // 时间戳
    //     type: this.$store.state.app.channel, // channel
    //     // type: 4, // channel
    //   };
    //   console.log('Trade.vue', '向服务器验证签名，返回token');
    //   this.$http.post('/account/verify', params).then((res) => {
    //     if (res.code !== 0) {
    //       Toast({
    //         message: res.msg,
    //         position: 'center',
    //         duration: 2000,
    //       });
    //       return;
    //     }
    //     localStorage.setItem('token', res.token);
    //     if (this.isFavorite) {
    //       this.handleSelfCancel();
    //       return;
    //     }
    //     this.handleSelfAdd();
    //   });
    // },
    // tokenpocket sdk签名自带时间戳 - 特殊处理
    // handleTokenPocket(data, time) {
    //   const params = {
    //     signature: data.signature, // 钱包签名
    //     account: this.$store.state.app.accountInfo.account_name, // 账户名
    //     timestamp: time, // 服务器时间戳
    //     mTimeStamp: data.timestamp, // tokenpocket返回的时间戳
    //     type: this.$store.state.app.channel, // channel
    //   };
    //   this.$http.post('/account/tokenPocketVerify', params).then((res) => {
    //     if (res.code !== 0) {
    //       Toast({
    //         message: res.msg,
    //         position: 'center',
    //         duration: 2000,
    //       });
    //       return;
    //     }
    //     localStorage.setItem('token', res.token);
    //     if (this.isFavorite) {
    //       this.handleSelfCancel();
    //       return;
    //     }
    //     this.handleSelfAdd();
    //   });
    // },
    /* -------- 权限校验 end -------- */
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.popup{
  border-radius: .3rem;
}

.trade{
  font-size: .36rem;
  // padding: 0rem .25rem;
  background: #fafafa;
  color: $color-333;

  .tools{
    padding: 0rem .25rem;
    background: #FFF;
    height: .8rem;
    line-height: .8rem;

    .symbol{
      position: relative;

      .changeSymbol{
        position: absolute;
        font-size: .16rem;
        margin-left: .1rem;
      }
    }

    .icon{
      font-size: .38rem;
    }
  }

  .tradeContent{
    display: flex;
    padding: 0.1rem .25rem;
    background: #FFF;

    .item{
      flex: 1;

      &:nth-child(1){
        margin-right: .4rem;
        min-width: 3.4rem;
      }
      &:nth-child(2){
        min-width: 3rem;
      }
    }
  }

  .orderContent{
    margin-top: .1rem;
    font-size: .25rem;

    .chooseType{
      padding: 0.15rem .25rem;
      color: $color-999;

      .active{
        color: $color-333;
        font-weight: bold;
      }
    }

    .type{
      margin-right: .5rem;
    }

    .typeList{
      // padding: .24rem .25rem;
      background: #FFF;
    }
  }

}
</style>
