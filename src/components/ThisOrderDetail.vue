<template>
  <div class="detailDiv item">
    <div class="itemTitle">
      <!-- 交易对 -->
      <div class="symbol">
        <!-- <span class="color-red" v-if="order.direction === 2">{{ $t('public.sellShort') }}</span>
        <span class="color-green" v-if="order.direction === 1">{{ $t('public.buyShort') }}</span>
        <span class="coin" @click="handleToTrade(order)">{{ order.symbol1 }}/{{ order.symbol2 }}</span> -->
        <span class="orderTime">{{ $t('public.orderTime') }}</span>
        <span class="time tip">{{ toLocalTime(order.orderTime) }}</span>
      </div>

      <!-- status -->
      <div class="status">
        <span v-if="order.dealStatus === 0 && order.orderStatus === 0"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status') }}</span>
        <span v-if="order.dealStatus === 0 && order.orderStatus === 2" class="color-333">{{ $t('order.status3') }}</span>
        <span v-if="order.dealStatus === 1 && order.orderStatus === 0"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status1') }}</span>
        <span v-if="order.dealStatus === 1 && order.orderStatus === 2" class="color-333">{{ $t('order.status4') }}</span>
        <span v-if="order.dealStatus === 2"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status2') }}</span>
      </div>
    </div>

    <!-- showContent -->
    <div class="showContent">
      <div class="">
        <div class="tip">{{ $t('public.myPrice') }}</div>
        <div class="num">{{ Number(order.orderPriceStr) !== 0 ? order.orderPriceStr : $t('quotation.market') }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.count') }}</div>
        <div class="num">{{ order.orderCountStr || '—' }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.dealCount') }}</div>
        <div class="num">{{ order.dealCountStr || '—' }}</div>
      </div>
    </div>
    <div class="showContent" style="margin-top: .2rem;">
      <div class="">
        <div class="tip">{{ $t('public.dealAveragePrice') }}</div>
        <div class="num">{{ order.dealPriceStr }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.dealTotal') }}</div>
        <div class="num">{{ order.dealAmountStr || '—' }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.charge') }}</div>
        <div class="num">{{ order.totalChargeStr || '—'}}</div>
      </div>
    </div>
    <!-- 交易详情列表 -->
    <div class="hiddenContent">
      <div class="subList" v-for="(list, i) in order.orderDealRecords" :key="i">
        <!-- TxID start -->
        <div>
          <div class="txid" v-if="order.direction === 2">
            <span class="subName">TxID</span>
            <span class="subTxid overflow color-this" v-if="list.askTrxId"
              @click="handleToTx(list.askTrxId)">{{ list.askTrxId }}</span>
            <span v-if="!list.askTrxId">—</span>
          </div>
          <div class="txid" v-if="order.direction === 1">
            <span class="subName">TxID</span>
            <span class="subTxid overflow color-this" v-if="list.bidTrxId"
              @click="handleToTx(list.bidTrxId)">{{ list.bidTrxId }}</span>
            <span v-if="!list.bidTrxId">—</span>
          </div>
        </div>
        <!-- TxID end -->

        <div class="showContent">
          <div class="">
            <div class="tip subTool">{{ $t('public.dealPrice') }}</div>
            <div class="subNum">{{ list.dealPriceStr }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.dealCount') }}</div>
            <div class="subNum">{{ list.dealCountStr }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.dealAmount') }}</div>
            <div class="subNum">{{ list.dealAmountStr }}</div>
          </div>
        </div>

        <div class="showContent mt10">
          <div class="">
            <div class="tip subTool">{{ $t('public.dealAccount') }}</div>
            <div class="subNum color-this"
              v-if="order.direction === 1"
              @click="handleToTx(list.askTrxId)">{{ list.askAccountNo }}</div>
            <div class="subNum color-this"
              v-if="order.direction === 2"
              @click="handleToTx(list.bidTrxId)">{{ list.bidAccountNo }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.dealTime') }}</div>
            <div class="subNum">{{ toLocalTime(list.updateTs).substr(5, 11) }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.charge') }}</div>
            <div class="subNum" v-if="order.direction === 2">{{ list.askChargeStr }}</div>
            <div class="subNum" v-if="order.direction === 1">{{ list.bidChargeStr }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      order: {},
    };
  },
  props: [
  ],
  components: {
  },
  watch: {
  },
  created() {
    this.order = this.$store.state.app.detail;
    // this.handleRowDetail();
  },
  mounted() {
  },
  methods: {
    // 跳转到交易对
    handleToTrade(item) {
      const params = {
        symbol: item.symbol,
      };
      this.$router.push({
        name: 'trade',
        params,
      });
    },
    // 时间转化
    toLocalTime(time) {
      return toLocalTime(time);
    },
    // 查询账户
    handleToAccount(account) {
      location.href = `https://eosflare.io/account/${account}`;
    },
    // 查询Tx
    handleToTx(id) {
      // console.log(id)
      location.href = `https://eosflare.io/tx/${id}`;
    },
    // 订单详情
    handleRowDetail() {
      const params = this.$route.params;
      this.$http.post('/order/getOrderDealRecords', params).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$set(this.order, 'detailList', res.orderDealRecords);
      });
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.tip{
  font-size: .25rem;
  color: $color-999;
}

.mt10{
  margin-top: .1rem;
}

.item{
  font-size: .3rem;
  background: #fff;
  padding: .24rem .36rem;

  .itemTitle{
    margin-bottom: .3rem;
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    &>div{
      flex: 2;
    }

    .symbol{
      .coin{
        margin-left: .28rem;
        margin-right: .5rem;
      }

      .orderTime{
        font-size: .25rem;
        // margin-right: .1rem;
      }

      .time{
        font-size: .25rem;
        color: $color-333;
      }
    }

    .status{
      flex: 2;
      max-width: 2.3rem;
      text-align: right;
      font-size: .25rem;
      color: $color-999;
    }
  }

  .showContent{
    display: flex;
    align-items: center;/*垂直居中*/

    &>div{
      flex: 3;
      text-align: right;
      margin-right: .4rem;

      &:last-child{
        margin-right: 0rem;
      }
    }

    .num{
      height: .45rem;
      line-height: .45rem;
    }

    .tools{
      margin-right: 0rem;
      font-size: .25rem;
      flex: 1;
    }
  }

  .hiddenContent{
    margin-top: .12rem;

    .subList{
      background-color: #fafafa;
      border-radius: .08rem;
      padding: 0px .33rem;
      margin-bottom: .12rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      .subTool{
        line-height: .5rem;
      }

      .subNum{
        font-size: .25rem;
        line-height: .5rem;

        &.overflow{
          max-width: 1.64rem;
          overflow: hidden;
          word-break: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .txid{
      display: flex;
      align-items: center;/*垂直居中*/
      height: .84rem;
      border-bottom: 1px solid $color-e3e3e3;

      .subName{
        color: $color-999;
        margin-right: .1rem;
      }

      .subTxid{
        display: inline-block;
        overflow: hidden;
        word-break: normal;
        text-overflow: ellipsis;
      }
    }

  }
}
</style>


// WEBPACK FOOTER //
// src/components/ThisOrderDetail.vue
