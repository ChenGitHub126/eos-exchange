<template>
  <div class="list">
    <!-- <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"> -->
      <div class="item" v-if="dataList.length" v-for="(item, $index) in dataList" :key="$index">
        <!-- title -->
        <div class="itemTitle">
          <!-- 交易对 -->
          <div class="symbol">
            <span class="color-red" v-if="item.type === 'ask'">{{ $t('public.sellShort') }}</span>
            <span class="color-green" v-if="item.type === 'bid'">{{ $t('public.buyShort') }}</span>
            <span class="coin">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
            <span class="time tip">{{ item.localTime }}</span>
          </div>

          <!-- status -->
          <div class="status">
            <!--<span v-if="item.dealStatus === 0 && item.orderStatus === 0"-->
              <!--:class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">{{ $t('order.status') }}</span>-->
            <!--<span v-if="item.dealStatus === 0 && item.orderStatus === 2" class="color-333">{{ $t('order.status3') }}</span>-->
            <!--<span v-if="item.dealStatus === 1 && item.orderStatus === 0"-->
              <!--:class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">{{ $t('order.status1') }}</span>-->
            <!--<span v-if="item.dealStatus === 1 && item.orderStatus === 2" class="color-333">{{ $t('order.status4') }}</span>-->
            <!--<span v-if="item.dealStatus === 2" :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">{{ $t('order.status2') }}</span>-->
            <span v-if="item.orderStatus === 1" :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">{{ $t('order.status2') }}</span>
          </div>
        </div>

        <!-- showContent -->
        <!--<div class="showContent" @click="handleRowDetail(item)">-->
        <div class="showContent">
          <div class="">
            <div class="tip">{{ $t('public.myPrice') }}</div>
            <div class="num">{{ Number(item.price) !== 0 ? item.price : $t('quotation.market') }}</div>
          </div>
          <div class="">
            <div class="tip">{{ $t('public.count') }}</div>
            <div class="num">{{ item.amount || '—' }}</div>
          </div>
          <!--<div class="">-->
            <!--<div class="tip">{{ $t('public.dealCount') }}</div>-->
            <!--<div class="num">{{ item.dealCountStr || '—' }}</div>-->
          <!--</div>-->
          <!--<div class="tools color-this">-->
            <!--<span :class="{'hidden': item.dealStatus === 0}">-->
              <!--<span v-if="!item.open" class="iconfont icon-huaban37 toDetail"></span>-->
              <!--<span v-if="item.open" class="iconfont icon-huaban35 toDetail"></span>-->
               <!--<span v-if="!item.open">{{ $t('public.open') }}</span>-->
              <!--<span v-if="item.open">{{ $t('public.close1') }}</span> -->
            <!--</span>-->
          <!--</div>-->
        </div>
        <div class="hiddenContent" v-if="item.open" @click="handleGoToDetail(item)">
          <div class="detail">
            <div class="detailTitle">
              <div class="tip">{{ $t('public.dealPrice') }}</div>
              <div class="tip">{{ $t('public.dealCount') }}</div>
              <div class="tip">{{ $t('public.charge') }}</div>
            </div>
            <div class="datailList" v-if="item.orderDealRecords.length" v-for="(list, i) in item.orderDealRecords" :key="i">
              <div class="num">{{ list.dealPriceStr }}</div>
              <div class="num">{{ list.dealCountStr }}</div>
              <div class="num" v-if="item.direction === 2">{{ list.askChargeStr }}</div>
              <div class="num" v-if="item.direction === 1">{{ list.bidChargeStr }}</div>
            </div>
            <div v-if="item.orderDealRecords && !item.orderDealRecords.length" class="color-999" style="text-align:center;font-size: .25rem;">
              {{ $t('public.noData') }}
            </div>
          </div>

          <div class="go color-this" @click="handleGoToDetail(item)">
            <span class="iconfont icon-huaban36-copy goRight"></span>
          </div>
        </div>
      </div>

      <!-- 加载中 -->
      <div class="loading" v-if="loading">
        <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
      </div>

      <!-- 查看更多 -->
      <div class="noData" v-if="dataList.length === 3">
        <div class="noTip color-this" @click="handleTomore()">{{ $t('index.more') }}</div>
      </div>

      <!-- 没有数据 -->
      <div class="noData" v-if="!dataList.length && !loading">
        <img src="@/assets/img/order/search_keyword_ic.png" class="imgNodata" alt="">
        <div class="noTip color-999">{{ $t('public.noList') }}</div>
      </div>

    <!-- </mt-loadmore> -->
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';
// import { Toast } from 'mint-ui';
import axios from 'axios';
import { api } from '@/api';

export default {
  data() {
    return {
      test: false,

      page: 1,
      pageSize: 20,
      totalPage: 1,

      dataList: [],
      allLoaded: false,

      loading: true,
    };
  },
  props: [
    'symbol',
  ],
  components: {
  },
  watch: {
    symbol() {
      this.handleGetOrderList();
    },
  },
  created() {
    // alert(this.$store.state.app.accountInfo.account_name)
  },
  mounted() {
    this.handleGetOrderList();
  },
  methods: {
    handleTomore() {
      this.$router.push({
        name: 'coinHistoryList',
        params: {
          symbol: this.symbol,
        },
      });
    },
    // 下拉刷新
    loadTop() {
      this.handleGetOrderList();
    },
    loadBottom() {
      this.page += 1;
      this.handleGetOrderList(this.page);
    },
    // goto 交易明细
    handleGoToDetail(item) {
      this.$store.dispatch('setDetail', item);
      this.$router.push('/orderDetail');
      // this.$emit('listenToDetail', item);
    },
    /* 数据请求操作 start */
    handleGetOrderList(page) { // 查询订单记录列表信息
      try {
        this.loading = true;
        this.$http.get(api.historyOrderList, {
          params: {
            account_name: this.$store.state.app.accountInfo.account_name,
            symbol: this.$store.state.app.symbolInfo.name2,
            position: 0,
            offset: 5,
          },
        }).then((res) => {
          this.loading = false;
          const data = res.data;
          const list = data.list;
          list.forEach((item) => {
            this.$set(item, 'symbol1', item.quote_symbol.toUpperCase());
            this.$set(item, 'symbol2', item.base_symbol.toUpperCase());
            const localTime = toLocalTime(item.order_time);
            this.$set(item, 'localTime', localTime.substr(5));
            this.$set(item, 'orderStatus', 1);
            this.$set(item, 'open', false);
          });

          // if (list.length > 5) {
          //   this.allLoaded = false;
          // } else {
          //   this.allLoaded = true;
          // }

          // 判断刷新 / 更多
          if (!page) {
            this.handleRefresh(list);
            return;
          }
          this.handleTopage(list);
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetOrderList();
        }, 500);
      }
    },
    // 首次加载 / 下拉刷新
    handleRefresh(list) {
      // this.$refs.loadmore.onTopLoaded();
      this.page = 1;

      this.dataList = list;
    },
    // 上拉加载更多
    handleTopage(list) {
      // this.$refs.loadmore.onBottomLoaded();

      this.dataList.push(...list);
    },
    // 订单详情
    handleRowDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      this.$set(item, 'open', !item.open);
      // if (!item.open) {
      //   return;
      // }
      // const params = {
      //   orderId: item.id, // 订单id
      //   symbol: item.symbol,
      // };
      // this.$http.post('/order/getOrderDealRecords', params).then((res) => {
      //   if (res.code !== 0) {
      //     Toast({
      //       message: res.msg,
      //       position: 'center',
      //       duration: 2000,
      //     });
      //     return;
      //   }

      //   this.$set(item, 'detailList', res.orderDealRecords);
      // });
    },
  },
  beforeDestroy() {
  },
};
</script>


<style scoped lang="scss">
@import "../assets/css/public.scss";

.hidden{
  visibility: hidden;
}

.loading{
  display: block;
  width: 30px;
  margin: auto;
  padding: .3rem 0rem;
}

.noData{
  text-align: center;
  padding: .3rem 0px;

  .noTip{
    font-size: .25rem;
    color: $color-666;
  }
  .imgNodata{
    height: 1.8rem;
    padding-top: .30rem;
    padding-bottom: .1rem;
  }
}

.list{
  font-size: .3rem;
  // height: 100%;
  // overflow: auto;
  // padding: .24rem .36rem;
  background: #fafafa;

  .tip{
    font-size: .25rem;
    color: $color-999;
  }

  .item{
    background: #fff;
    padding: .24rem .36rem;
    margin-bottom: .12rem;

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

        .time{
          font-size: .25rem;
          color: $color-999;
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
        text-align: center;
        margin-right: .4rem;
      }

      .num{
        height: .45rem;
        line-height: .45rem;
      }

      .tools{
        margin-right: 0rem;
        font-size: .25rem;
        text-align: center;
        flex: 1;

        .toDetail{
          font-size: .16rem;
        }
      }
    }

    .hiddenContent{
      position: relative;
      display: flex;
      align-items: center;/*垂直居中*/
      background-color: #fafafa;
      padding: .2rem 0rem;
      margin-top: .12rem;

      .detail{
        flex: 9;
        // margin-right: .4rem;
        // display: flex;
        // align-items: center;/*垂直居中*/
        .detailTitle{
          display: flex;
          align-items: center;/*垂直居中*/
          height: .5rem;
          line-height: .5rem;

          &>div{
            flex: 3;
            text-align: right;
            margin-right: .4rem;
          }
        }

        .datailList{
          text-align: right;
          font-size: .25rem;
          display: flex;
          align-items: center;/*垂直居中*/
          // margin-right: .4rem;

          &>div{
            flex: 1;
            height: .4rem;
            line-height: .4rem;
            margin-right: .4rem;
            height: .5rem;
            line-height: .5rem;
          }
        }
      }

      .go{
        // flex: 1;
        width: .55rem;
        text-align: left;

        .goRight{
          position: absolute;
          font-size: .2rem;
          transform: translate(-30%, 0)
        }
      }
    }
  }
}
</style>
