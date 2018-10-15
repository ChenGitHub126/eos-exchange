<template>
  <div class="list">
    <!-- 历史委托title -->
    <div v-if="$route.name === 'coinHistoryList'">
      <div class="title">
        <div class="back fl color-999" @click="handleBack">{{ $t('public.back') }}</div>
        <div class="name">{{ symbolName }}{{ $t('quotation.oldList') }}</div>
        <div class="iconfont icon-huaban15 search" :class="{'color-this': searchData}" @click="search = true"></div>
      </div>
      <div class="subTools">
        <div class="end" :class="{'color-this': active === 1}" @click="handleActive(1)">{{ $t('public.updateTime') }}</div>
        <div :class="{'color-this': active === 2}" @click="handleActive(2)">{{ $t('public.orderTime') }}</div>
      </div>
    </div>

    <div class="scrollView">
      <mt-loadmore
        :topPullText="$t('public.loadingMoreTip1')"
        :topDropText="$t('public.loadingMoreTip2')"
        :topLoadingText="$t('public.loadingMoreTip3')"
        :bottomPullText="$t('public.loadingMoreTip1')"
        :bottomDropText="$t('public.loadingMoreTip2')"
        :bottomLoadingText="$t('public.loadingMoreTip3')"
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false" ref="loadmore">
        <div class="item" v-if="dataList.length" v-for="(item, $index) in dataList" :key="$index">
          <!-- title -->
          <div class="itemTitle">
            <!-- 交易对 -->
            <div class="symbol">
              <span class="color-red" v-if="item.direction === 2">{{ $t('public.sellShort') }}</span>
              <span class="color-green" v-if="item.direction === 1">{{ $t('public.buyShort') }}</span>
              <span class="coin">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
              <span class="time tip">{{ item.localTime }}</span>
            </div>

            <!-- status -->
            <div class="status">
              <span v-if="item.orderStatus === 0"
                :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">
                <button class="btn" @click="handleCancelOrder(item)">{{ $t('order.status') }}</button>
              </span>
              <span v-if="item.dealStatus === 0 && item.orderStatus === 2" class="color-333">{{ $t('order.status3') }}</span>
              <span v-if="item.dealStatus === 1 && item.orderStatus === 2" class="color-333">{{ $t('order.status4') }}</span>
              <span v-if="item.dealStatus === 2"
                :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">{{ $t('order.status2') }}</span>
            </div>
          </div>

          <!-- showContent -->
          <div class="showContent" @click="handleRowDetail(item)">
            <div class="">
              <div class="tip">{{ $t('public.myPrice') }}</div>
              <div class="num">{{ Number(item.orderPriceStr) !== 0 ? item.orderPriceStr : $t('quotation.market') }}</div>
            </div>
            <div class="">
              <div class="tip">{{ $t('public.count') }}</div>
              <div class="num">{{ item.orderCountStr }}</div>
            </div>
            <div class="">
              <div class="tip">{{ $t('public.dealCount') }}</div>
              <div class="num">{{ item.dealCountStr || '—'  }}</div>
            </div>
            <div class="tools color-this">
              <span :class="{'hidden': item.dealStatus === 0}">
                <span v-if="!item.open" class="iconfont icon-huaban37 toDetail"></span>
                <span v-if="item.open" class="iconfont icon-huaban35 toDetail"></span>
              </span>
            </div>
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

        <!-- 没有数据 -->
        <div class="noData" v-if="!dataList.length && !loading">
          <img src="@/assets/img/order/search_keyword_ic.png" class="imgNodata" alt="">
          <div class="noTip color-999">{{ $t('public.noList') }}</div>
        </div>

        <!-- 加载中 -->
        <div class="loading" v-if="loading && first">
          <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
        </div>

        <!-- 没有更多记录 -->
        <div class="noData" v-if="allLoaded && dataList.length">
          <div class="noTip color-999">{{ $t('public.noMore') }}</div>
        </div>

      </mt-loadmore>
    </div>

    <!-- 筛选 -->
    <mt-popup
      v-model="search"
      position="right"
      popup-transition="popup-fade">
      <order-search v-if="search" @listenSure="handleSearch" :searchData="isSearchStarus" />
    </mt-popup>
  </div>
</template>

<script>
import OrderSearch from '@/components/OrderSearch';

import { toLocalTime } from '@/utils/public';
// import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      /* ---- 订单中心tools参数设置 start ---- */
      active: 1, // 排序
      search: false, // 筛选
      searchData: null, // 筛选的数据
      isSearchStarus: null, // 是否处于筛选状态
      /* ---- 订单中心tools参数设置 end ---- */

      symbol: null,
      symbolName: null,

      page: 1,
      pageSize: 20,
      totalPage: 1,

      dataList: [],
      allLoaded: false,

      // loading
      loading: true,
      first: true,
    };
  },
  props: [
  ],
  components: {
    OrderSearch,
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.symbol = this.$route.params.symbol.toUpperCase();
    const coin = this.symbol.toUpperCase().split('_');
    this.symbolName = `${coin[0]}/${coin[1]}`;
    this.handleGetOrderList();
  },
  methods: {
    // 切换排序
    handleActive(index) {
      this.active = index;
      this.dataList = [];
      this.searchData = null; // 清空查询条件
      this.isSearchStarus = null; // 取消查询状态
      this.handleGetOrderList();
    },
    // 返回
    handleBack() {
      history.back();
    },
    // 下拉刷新 - start
    loadTop() {
      this.searchData = null; // ���空查询条件
      this.isSearchStarus = null; // 取消查询状态
      this.handleGetOrderList();
    },
    // 首次加载 / 下拉刷新 - end
    handleRefresh(list) {
      this.$refs.loadmore.onTopLoaded();
      this.page = 1;

      this.dataList = list;
    },
    // 上拉加载更多 - start
    loadBottom() {
      this.page += 1;
      if (this.isSearchStarus) {
        this.handleGetOrderList(this.page, this.searchData);
        return;
      }
      this.handleGetOrderList(this.page);
    },
    // 上拉加载更多 - end
    handleTopage(list) {
      this.$refs.loadmore.onBottomLoaded();

      this.dataList.push(...list);
    },
    // goto 交易明细
    handleGoToDetail(item) {
      this.$store.dispatch('setDetail', item);
      this.$router.push('/orderDetail');
    },
    // 筛选
    handleSearch(data) {
      // console.log(data)
      this.search = false;
      /**
       * data 参数
       *    status: 订单状态
       *      0 - null | 1 - 已成交 | 2 - 已撤销 | 3 - 部分成交[已撤销]
       *    direction: 交易方向
       *      0 - null | 1 - 买入 | 2 - 卖出
       *    date: 交易时间
       *      0 - null | 1 - 最近三天 | 2 - 最近7天 | 3 - 最近30天
       *    beginTime: 开始时间
       *    endTime: 结束时间
       */
      // 筛选条件为空时 - 退出筛选状态
      if (data.status === -1 && data.direction === -1 && data.date === -1) {
        this.searchData = null; // 清空查询条件
        this.isSearchStarus = null; // 取消查询状态
        this.handleGetOrderList();
        return;
      }
      const params = {
        currPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        orderByName: '', // 排序字段
        orderByType: '', // 排序方式(asc, desc)
        accountNo: this.$store.state.app.accountInfo.account_name, // 账户名
        coinCode: this.$route.params.symbol || '', // 币种
        direction: '', // 方向
        orderStatus: '', // 订单状态
        dealStatus: '', // 成交状态
        beginDate: data.beginTime, // 开始时间
        endDate: data.endTime, // 结束时间
      };
      // 处理订单状态
      if (data.status !== -1) {
        params.orderStatus = data.status;
      }
      // 未成交 & 已撤销
      if (data.status === 2) {
        params.orderStatus = 2;
        params.dealStatus = 0;
      }
      // 部分成交[已撤销]
      if (data.status === 3) {
        params.orderStatus = 2;
        params.dealStatus = 1;
      }
      // 处理交易方向
      if (data.direction !== -1) {
        params.direction = data.direction;
      }
      this.searchData = params; // 保存查询条件
      this.isSearchStarus = JSON.stringify(data); // 进入查询状态
      this.handleGetOrderList(null, this.searchData);
    },
    /* 数据请求操作 start */
    handleGetOrderList(page, data) { // 查询订单记录列表信息
      try {
        this.loading = true;
        let params = null;
        if (data) {
          params = data;
          if (page) {
            params.currPage = page;
          }
        } else {
          params = {
            currPage: page || 1, // 当前页码
            pageSize: 20, // 每页数量
            orderByName: '', // 排序字段
            orderByType: '', // 排序方式(asc, desc)
            accountNo: this.$store.state.app.accountInfo.account_name, // 账户名
            symbol: this.symbol, // 交易对
            direction: '', // 方向
            orderStatus: '', // 订单状态
            beginDate: '', // 开始时间
            endDate: '', // 结束时间
          };
        }
        // 添加请求排序处理参数
        if (this.active === 1) {
          params.orderByName = 'update_ts';
          params.orderByType = 'desc';
        }

        this.$http.post('/order/queryHistoryOrderPage', params).then((res) => {
          this.loading = false;
          const list = res.page.list;
          list.forEach((item) => {
            const symbolArr = item.symbol.split('_');
            this.$set(item, 'symbol1', symbolArr[0]);
            this.$set(item, 'symbol2', symbolArr[1]);
            const localTime = toLocalTime(item.orderTime);
            this.$set(item, 'localTime', localTime.substr(5, 5));
            this.$set(item, 'open', false);
          });

          if (res.page.totalPage <= this.page) {
            this.allLoaded = true;
          } else {
            this.allLoaded = false;
          }

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
    // 订单详情
    handleRowDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      this.$set(item, 'open', !item.open);
    },
  },
  beforeDestroy() {
  },
};
</script>


<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .scrollView{
    height: calc(100vh - 2.4rem) !important;
    overflow: auto;;
  }
}

.scrollView{
  height: calc(100vh - 1.8rem);
  overflow: auto;;
}

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

  /* -------- 订单中心tools样式 start -------- */
  // 标题头部
  .title{
    background: #FFF;
    font-size: .36rem;
    height: .9rem;
    padding: 0px .24rem;
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    .search,
    .clear{
      flex: 1;
      font-size: .4rem;
    }

    .name{
      flex: 10;
      text-align: center;
    }
  }

  // 选项卡切换
  .subTools{
    background: #FFF;
    font-size: .32rem;
    height: .9rem;
    margin-bottom: .12rem;
    color: $color-999;
    display: flex;
    align-items: center; /*垂直居中*/
    // justify-content: center;/*水平居中*/

    &>div{
      flex: 1;
      text-align: center;
    }

    .end::after{
      content: '';
      border: 1px solid #f3f3f3;
      float: right;
      height: .27rem;
      margin-top: .05rem;
    }
  }
  /* -------- 订单中心tools样式 end -------- */

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

        .btn{
          font-size: .25rem;
          height: .5rem;
          line-height: .5rem;
          min-width: .82rem;
          color: $color-this;
          background: transparent;
          border: 1px solid $color-this;
          border-radius: .08rem;
        }
      }
    }

    .showContent{
      display: flex;
      align-items: center;/*垂直居中*/

      &>div{
        flex: 3;
        text-align: right;
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
