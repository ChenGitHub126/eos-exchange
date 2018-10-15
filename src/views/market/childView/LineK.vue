<template>
  <div class="linek">
    <div class="tools">
      <div @click="changeSymbol = true;">
        <span class="iconfont"></span>
        <span class="symbol">
          {{ symbol1 }}/{{ symbol2 }}
        </span>
      </div>
      <div class="iconfont"></div>
    </div>
    <div class="coinInfo" style="overflow:hidden">
      <div class="fl" :class="{'color-green': symbolData.change > 0,'color-red': symbolData.change < 0}">
        <div class="price">{{ toFixed(symbolData.close, precision.price) }}</div>
        <div>{{ toFixed(symbolData.change * 100, 2) }}%</div>
      </div>
      <div class="fr">
        <div>
          <span class="tip">{{ $t('public.high') }}</span>
          <span>{{ toFixed(symbolData.high, precision.price) }}</span>
        </div>
        <div>
          <span class="tip">{{ $t('public.low') }}</span>
          <span>{{ toFixed(symbolData.low, precision.price) }}</span>
        </div>
        <div>
          <span class="tip">24H{{ $t('public.vol') }}</span>
          <span>{{ toFixed(symbolData.amount, precision.coin) }}</span>
        </div>
      </div>
    </div>
    <div class="tipTop">
      <div class="buy">
        <span>{{ $t('public.buyShort') }}</span>
        <span>{{ $t('public.count') }}({{ symbol1 }})</span>
      </div>
      <div class="price">
        {{ $t('public.price') }}({{ symbol2 }})
      </div>
      <div class="sell">
        <span>{{ $t('public.count') }}({{ symbol1 }})</span>
        <span>{{ $t('public.sellShort') }}</span>
      </div>
    </div>
    <!-- 交易深度 -->
    <List :type="type[0]" class="item"/>

    <!-- btn -->
    <!-- 空div占位 -->
    <div style="height: 1.27rem"></div>
    <div class="btnDiv" @click="handleToCompute">
      <button class="btn fl bgcolor-green">{{ $t('public.buy') }}</button>
      <button class="btn fr bgcolor-red">{{ $t('public.sell') }}</button>
    </div>

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      v-model="showDialog"
      popup-transition="popup-fade">
      <div class="dialog">
        <div class="tip">{{ $t('public.dialogTip1') }}</div>
        <div class="tip">
          {{ $t('public.dialogTip2') }}
          <span class="color-this">https://newdex.io</span>
          {{ $t('public.dialogTip3') }}
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
// JS
import Io from '@/utils/socket/index';
import { Toast } from 'mint-ui';
import { toFixed } from '@/utils/public';
// Components
import List from '../components/List';

export default {
  data() {
    return {
      type: [
        'buy',
        'sell',
      ],
      showDialog: false,
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
    };
  },
  components: {
    List,
  },
  props: [

  ],
  created() {

  },
  mounted() {
    this.symbol = this.$route.params.symbol.toLowerCase();
    const symbolArr = this.symbol.toUpperCase().split('_');
    this.symbol1 = symbolArr[0];
    this.symbol2 = symbolArr[1];

    this.handleLoadHeardWs();
    this.handlaGetSymbolInfo();
  },
  methods: {
    handleToCompute() {
      this.showDialog = true;
    },
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },
    // 获取头部信息
    handleLoadHeardWs() {
      const params = {
        symbol: this.symbol,
      };
      Io.cfwsHeard(params, (data) => {
        this.symbolData = data;
        if (data.precision) {
          this.precision = data.precision;
        }
        // this.$store.dispatch('setMarketPrice', data);
      });
    },
    // 获取交易对信息
    handlaGetSymbolInfo() {
      const param = {
        symbol: this.symbol,
      };
      this.$http.post('/order/getSymbolInfo', param).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        const info = res.symbolInfo;
        const sym = info.symbol.split('_');
        this.symbolInfo = {
          symbol1: sym[0],
          symbol2: sym[1],
          symbol1_code: info.bidContract,
          symbol2_code: info.askContract,
          coinDecimal: info.coinInfo.coinDecimal,
          priceDecimal: info.coinInfo.priceDecimal,
        };
        this.$store.dispatch('setTrad', this.symbolInfo);
      });
    },
  },
  beforeDestroy() {
    Io.cfwsUnsubscribe(`ticker.${this.symbol}`);
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}

.dialog{
  padding: .61rem 0rem;

  .tip{
    line-height: .45rem;
  }
}


.linek{
  padding: .1rem 0rem;

  .tools{
    height: .8rem;
    line-height: .8rem;
    font-size: .36rem;
    padding: 0px .24rem;
  }

  .coinInfo{
    padding: 0px .24rem;
    overflow: hidden;
    font-size: .25rem;
    padding-bottom: .2rem;

    .price{
      font-size: .56rem;
    }

    .tip{
      display: inline-block;
      width: 1.5rem;
      text-align: right;
      color: $color-999;
      // font-weight: 300;
      padding-right: .08rem;
    }
  }

  .tipTop{
    padding: 0px .24rem;
    background: #fafafa;
    height: .5rem;
    line-height: .5rem;
    display: flex;
    font-size: .2rem;
    color: $color-999;

    div{
      flex: 1;
    }

    .sell{
      text-align: right;
    }

    .price{
      text-align: center;
    }
  }

  .lineDeep{
    display: flex;
    padding: 0px .24rem;

    .item{
      flex: 1;
    }
  }

  .btnDiv{
    font-size: .32rem;
    text-align: center;
    position: fixed;
    box-sizing: border-box;
    padding: .24rem .24rem;
    bottom: 0px;
    left: 50%;
    width: 100%;
    max-width: 750px;
    transform: translate(-50%);
    background: #FFF;
    z-index: 10;
    box-shadow: 0px -0.01rem .05rem rgba(75, 75, 75, 0.10);

    .btn{
      width: 48%;
      line-height: .8rem;
      height: .8rem;
      border-radius: .12rem;
      font-size: .32rem;
      color: white;
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/views/market/childView/LineK.vue
