<template>
  <div class="tradeRight">
    <!-- 卖盘列表 -->
    <div class="listHead color-999">
      <span>{{ $t('public.price') }}</span>
      <span class="fr mr5">{{ $t('public.count') }}</span>
    </div>
    <div class="list">
      <div class="listContent"  v-for="(item, $index) in data.asks" :key="$index" @click="handleClickPrice(item.price)">
        <span class="color-red" style="padding-left: .1rem">{{ item.price }}</span>
        <span class="fr mr5 color-999 numWidth" v-if="item.num <= 100000">{{ item.num }}</span>
        <span class="fr mr5 color-999 numWidth" v-if="item.num > 100000">{{ toFixed(item.num / 1000, 1) }}K</span>
        <div class="bgColor" :style="`width: ${handleBgWidth(item.num, sellCount)}%`"></div>
      </div>
    </div>

    <!-- 最新价 -->
    <div class="newPrice" :class="{'color-green': symbolData.change > 0,'color-red': symbolData.change < 0}">
      {{ toFixed(symbolData.price, symbolData.precision.price) }}
      <span class="iconfont icon-huaban39 icon" v-if="symbolData.change > 0"></span>
      <span class="iconfont icon-huaban40 icon" v-if="symbolData.change < 0"></span>
    </div>

    <!-- 买盘列表 -->
    <div class="list">
      <div class="listContent" v-for="(item, $index) in data.bids" :key="$index" @click="handleClickPrice(item.price)">
        <span class="color-green" style="padding-left: .1rem">{{ item.price }}</span>
        <span class="fr mr5 color-999 numWidth" v-if="item.num < 100000">{{ item.num }}</span>
        <span class="fr mr5 color-999 numWidth" v-if="item.num >= 100000">{{ toFixed(item.num / 1000, 1) }}K</span>
        <div class="bgColor bgColorBuy" :style="`width: ${handleBgWidth(item.num, buyCount)}%`"></div>
      </div>
    </div>
  </div>
</template>

<script>
// JS
// import { Decimal } from 'decimal.js';
import Io from '@/utils/socket/index';
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
      symbol: 'iq_eos',
      wsData: { // ws 原数据
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      data: { // 交易深度
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      buyCount: 0,
      sellCount: 0,
      first: true,
      symbolData: this.$store.state.app.symbolInfo
    };
  },
  props: [
    'symbolInfo',
    'newPrice',
  ],
  components: {
  },
  watch: {
    '$store.state.app.trad': function listen(newVal) {
      this.symbolInfo = newVal;
        this.handlePriceDepthWs();
      // this.handleDepthData(this.wsData);
    },
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
    // vue挂载时调用
    handleMouted() {
      this.symbol = this.$route.params.symbol.toUpperCase();
      this.handlePriceDepthWs();
    },

    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },

    // 获取深度数据
    handlePriceDepthWs() {
      const params = {
        symbol: this.symbol.toLowerCase(),
      };

        this.$http.get('http://120.220.14.100:8088/onedex/v1/order/book', {
            params: {
                base: this.symbol.toUpperCase().split('_')[1],
                quote: this.symbol.toUpperCase().split('_')[0],
                limit: '50'
            }
        }).then(res => {
            const data = res.data;
            const map = data.map;
            this.handleDepthData(map);
            // 卖盘列表显示到最后
            if (this.first) {
                this.first = false;
                setTimeout(() => {
                    document.getElementsByClassName('list')[0].scrollTop = 10000;
                }, 100);
            }
        });
    },

    // 处理数据 - 精度
    handleDepthData(data) {
          const asks = [];
          this.sellCount = 0;
          data.asks.forEach((v) => {
              asks.push({
                  price: toFixed(Number(v.price), this.symbolData.precision.price),
                  num: toFixed(Number(v.amount), this.symbolData.precision.coin),
              });
              if (this.sellCount < Number(v.amount)) {
                  this.sellCount = Number(v.amount);
              }
              // this.sellCount += Number(vv[1]);
          });
          // 卖盘需要进行倒序 (这也没倒啊???)
          const asksArr = asks;
          this.data.asks = asksArr;
          if (asksArr.length > 50) {
              this.data.asks = asksArr.slice(0, 50);
          }

          const bids = [];
          this.buyCount = 0;
          data.bids.forEach((v) => {
              bids.push({
                  price: toFixed(Number(v.price), this.symbolData.precision.price),
                  num: toFixed(Number(v.amount), this.symbolData.precision.coin),
              });
              if (this.buyCount < Number(v.amount)) {
                  this.buyCount = Number(v.amount);
              }
              // this.buyCount += Number(vv[1]);
          });
          this.data.bids = bids;
          if (bids.length > 50) {
              this.data.bids = bids.slice(0, 50);
          }
      },

    // 交易量背景色
    handleBgWidth(num, count) {
      // console.log(count, (num / count) * 100)
      return (num / Number(count)) * 100;
    },
    // 价格点击
    handleClickPrice(data) {
      this.$store.dispatch('setClickPrice', data);
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.mr5{
  margin-right: .09rem;
}

.tradeRight{
  font-size: .25rem;
  padding-bottom: .2rem;

  .listHead{
    // font-weight: 300;
    line-height: .8rem;
    height: .8rem;;
  }

  .list{
    max-height: 3.2rem;
    overflow: auto;

    .listContent{
      position: relative;
      height: .44rem;
      line-height: .44rem;
      margin: .1rem 0;

      .numWidth{
        max-width: 1.5rem;
        overflow: hidden;
      }

      .bgColor{
        position: absolute;
        height: .4rem;
        width: 50%;
        background: $color-sell;
        top: 0px;
        right: 0px;
        border-radius: .03rem;
      }

      .bgColorBuy{
        background: $color-buy;
      }
    }
  }

  .newPrice{
    text-align: center;
    height: .65rem;
    line-height: .67rem;
    border-top: 1px solid $color-e3e3e3;
    border-bottom: 1px solid $color-e3e3e3;
    margin: .24rem 0;
    font-size: .3rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/

    .icon{
      font-size: .24rem;
    }
  }
}
</style>
