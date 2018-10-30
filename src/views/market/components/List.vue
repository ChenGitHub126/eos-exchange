<template>
  <div class="lineDeep">
    <div class="list item">

      <!-- 买入 start -->
      <div class="listContent buy" v-for="(item, $index) in data.bids" :key="$index" v-if="data.bids.length">
        <span class="count">
          <label class="num color-999">{{ ($index + 1) }}</label>
          <label class="">{{ item.num }}</label>
        </span>
        <span class="price color-green">{{ item.price }}</span>
        <div class="bgColor bgColorBuy"
          :style="`width: ${handleBgWidth(item.num, buyCount)}%`"></div>
      </div>
      <div class="listContent buy" v-if="!data.bids.length">
        <div class="noData">{{ $t('public.noData') }}</div>
      </div>
      <!-- 买入 end -->

    </div>

    <div class="list item">

      <!-- 卖出 start -->
      <div class="listContent sell" v-for="(item, $index) in data.asks" :key="$index" v-if="data.asks.length">
        <span class="color-red price">{{ item.price }}</span>
        <span class="count">
          <label class="">{{ item.num }}</label>
          <label class="num color-999">{{ ($index + 1) }}</label>
        </span>
        <div class="bgColor"
          :style="`width: ${handleBgWidth(item.num, sellCount)}%`"></div>
      </div>
      <div class="listContent sell" v-if="!data.asks.length">
        <div class="noData">{{ $t('public.noData') }}</div>
      </div>
      <!-- 卖出 end -->

    </div>
  </div>
</template>

<script>
// JS
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
      symbol: 'iq_eos',
      data: { // 交易深度
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      symbolInfo: { // 交易对信息
      },
      wsData: { // ws 原数据
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      buyCount: 0,
      sellCount: 0,
    };
  },
  components: {
  },
  props: [
    'type',
  ],
  watch: {
    '$store.state.app.trad': function listen(newVal) {
      this.symbolInfo = newVal;
      this.handleWsData(this.wsData);
    },
  },
  created() {
    this.symbol = this.$route.params.symbol;
    this.symbolInfo = this.$store.state.app.trad;
  },
  mounted() {
    this.handlePriceDepthWs();
  },
  methods: {
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },

    // 获取深度数据
    handlePriceDepthWs() {
      // const params = {
      //   symbol: this.symbol,
      // };
      // Io.cfwsDepth(params, (data) => {
      //   // this.data = data;
      //   this.wsData = data;
      //   this.handleWsData(this.wsData);
      // });
    },

    // 处理数据 - 精度
    handleWsData(data) {
      const asks = [];
      this.sellCount = 0;
      data.asks.forEach((v) => {
        const vv = v.split(':');
        // const thisCount = Number(vv[0]) * Number(vv[1])
        asks.push({
          price: toFixed(Number(vv[0]), this.symbolInfo.priceDecimal),
          num: toFixed(Number(vv[1]), this.symbolInfo.coinDecimal),
          // count: toFixed(thisCount, 4),
        });
        if (this.sellCount < Number(vv[1])) {
          this.sellCount = Number(vv[1]);
        }
        // this.sellCount += Number(vv[1]);
      });
      // 卖盘需要进行倒序
      const asksArr = asks.sort((a, b) => (a.price - b.price));
      this.data.asks = asksArr;
      if (asksArr.length > 50) {
        this.data.asks = asksArr.slice(0, 50);
      }

      const bids = [];
      this.buyCount = 0;
      data.bids.forEach((v) => {
        const vv = v.split(':');
        // const thisCount = Number(vv[0]) * Number(vv[1])
        bids.push({
          price: toFixed(Number(vv[0]), this.symbolInfo.priceDecimal),
          num: toFixed(Number(vv[1]), this.symbolInfo.coinDecimal),
          // count: toFixed(thisCount, 4),
        });
        if (this.buyCount < Number(vv[1])) {
          this.buyCount = Number(vv[1]);
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
      return (num / count) * 100;
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.mr5{
  margin-right: .05rem;
}

.lineDeep{
  display: flex;
  padding: 0px .24rem;

  .item{
    flex: 1;
  }
}

.list{
  .listContent{
    display: flex;
    position: relative;
    height: .43rem;
    line-height: .43rem;
    font-size: .2rem;
    margin: .1rem 0;

    .noData{
      text-align: center;
      color: $color-999;
      width: 100%;
    }

    .num{
      width: .2rem;
      display: inline-block;
    }

    .bgColor{
      position: absolute;
      height: .43rem;
      width: 50%;
      background: $color-sell;
      top: 0px;
      right: 0px;
      z-index: 0;
    }

    .bgColorBuy{
      background: $color-buy;
    }

    // 买入
    &.buy{
      &>span{
        flex: 2;
        z-index: 1;

        &.price{
          text-align: right;
          padding-right: .1rem;
          flex: 1;
        }
      }
    }

    // 卖出
    &.sell{
      &>span{
        flex: 1;
        z-index: 1;

        &.price{
          text-align: left;
          padding-left: .1rem;
        }

        &.count{
          text-align: right;
          flex: 2;
        }
      }

      .bgColor{
        left: 0px;
      }
    }
  }
}
</style>
