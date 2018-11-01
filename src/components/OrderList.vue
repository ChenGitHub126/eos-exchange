<template>
  <div class="list">
    <!-- 订单中心title -->
    <div class="title">
      <!--<div class="clearDiv" @click="handleRead()" v-if="$store.state.app.unReadCount">-->
        <!--<span class="iconfont icon-huaban45 clear"></span>-->
        <!--<span class="unReadCount" v-if="$store.state.app.unReadCount">-->
          <!--{{ $t('public.unReadCount') }}:{{ $store.state.app.unReadCount }}-->
        <!--</span>-->
      <!--</div>-->
      <!--<div class="iconfont icon-huaban15 search" :class="{'color-this': searchData}" @click="search = true"></div>-->
      <div class="name">{{ $t('public.orderCenter') }}</div>
    </div>
    <div style="clear: both;"></div>
    <div class="subTools">
      <div class="end" :class="{'color-this': active === 1}" @click="handleActive(1)">{{ $t('public.updateTime') }}</div>
      <div :class="{'color-this': active === 2}" @click="handleActive(2)">{{ $t('public.orderTime') }}</div>
    </div>

    <div class="scrollView">
      <!-- 主订单列表展示区 start -->
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
        <!--<div class="item" v-if="dataList.length" v-for="(item, $index) in dataList" :key="$index" @click="handleGoToDetail(item)">-->
        <div class="item" v-if="dataList.length" v-for="(item, $index) in dataList" :key="$index">
          <!-- title -->
          <div class="itemTitle">
            <!-- 交易对 -->
            <div class="symbol">
              <span class="color-red" v-if="item.type === 'ask'">{{ $t('public.sellShort') }}</span>
              <span class="color-green" v-if="item.type === 'bid'">{{ $t('public.buyShort') }}</span>
              <span class="coin" @click.stop="handleToTrade(item)">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
              <span class="time tip">{{ item.localTime }}</span>
            </div>

            <!-- status -->
            <div class="status">
              <span v-if="item.orderStatus === 0" class="color-333">
                <button class="btn" @click="handleCancelOrder(item)">{{ $t('public.revoke') }}</button>
              </span>
              <!--<span v-if="item.dealStatus === 0 && item.orderStatus === 2">{{ $t('order.status3') }}</span>-->
              <!--<span v-if="item.dealStatus === 1 && item.orderStatus === 2"-->
                <!--:class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">-->
                <!--{{ $t('order.status4') }}<span class="iconfont icon-huaban11" style="font-size: .25rem;"></span>-->
              <!--</span>-->
              <span v-if="item.orderStatus === 1"
                :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">
                {{ $t('order.status2') }}
                  <!--<span class="iconfont icon-huaban11" style="font-size: .25rem;"></span>-->
              </span>
            </div>
          </div>

          <!-- showContent -->
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
              <!--<div class="tip pointDiv">-->
                <!--&lt;!&ndash;<span class="point" v-if="!item.readStatus"></span>&ndash;&gt;-->
                <!--{{ $t('public.dealCount') }}-->
              <!--</div>-->
              <!--<div class="num">{{ item.dealCountStr || '—' }}</div>-->
            <!--</div>-->
          </div>
          <div class="showContent" style="margin-top: .2rem;" v-if="item.open">
            <div class="">
              <div class="tip">{{ $t('public.dealAveragePrice') }}</div>
              <div class="num">{{ item.filled_amount }}</div>
            </div>
            <div class="">
              <div class="tip">{{ $t('public.dealTotal') }}</div>
              <div class="num">{{ item.dealAmountStr || '—' }}</div>
            </div>
            <div class="">
              <div class="tip">{{ $t('public.charge') }}</div>
              <div class="num">{{ item.finish_time || '—' }}</div>
            </div>
          </div>
          <!-- 订单详情 -->
          <!--<div class="hiddenContent" v-if="item.open" @click="handleGoToDetail(item)">-->
            <!--<div class="detail">-->
              <!--<div class="detailTitle">-->
                <!--<div class="tip">{{ $t('public.dealPrice') }}</div>-->
                <!--<div class="tip">{{ $t('public.dealCount') }}</div>-->
                <!--<div class="tip">{{ $t('public.charge') }}</div>-->
              <!--</div>-->
              <!--<div class="datailList" v-if="item.orderDealRecords.length" v-for="(list, i) in item.orderDealRecords" :key="i">-->
                <!--<div class="num">{{ list.dealPriceStr }}</div>-->
                <!--<div class="num">{{ list.dealCountStr }}</div>-->
                <!--<div class="num" v-if="item.direction === 2">{{ list.askChargeStr }}</div>-->
                <!--<div class="num" v-if="item.direction === 1">{{ list.bidChargeStr }}</div>-->
              <!--</div>-->
              <!--<div v-if="item.orderDealRecords && !item.orderDealRecords.length" class="color-999" style="text-align:center;font-size: .25rem;">-->
                <!--{{ $t('public.noData') }}-->
              <!--</div>-->
            <!--</div>-->

            <!--<div class="go color-this" @click="handleGoToDetail(item)">-->
              <!--<span class="iconfont icon-huaban36-copy goRight"></span>-->
            <!--</div>-->
          <!--</div>-->

        </div>

        <!-- 没有数据 -->
        <div class="noData" v-if="!dataList.length && !loading">
          <img src="@/assets/img/order/search_keyword_ic.png" class="imgNodata" alt="">
          <div class="noTip">{{ $t('public.noList') }}</div>
        </div>

        <!-- 加载中 -->
        <div class="loading" v-if="loading">
          <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
        </div>

        <!-- 没有更多记录 -->
        <div class="noData" v-if="allLoaded && dataList.length">
          <div class="noTip color-999">{{ $t('public.noMore') }}</div>
        </div>

      </mt-loadmore>
      <!-- 主订单列表展示去 end -->
    </div>

    <!-- 暂停交易提示 -->
    <mt-popup
      class="popup"
      v-model="stop"
      popup-transition="popup-fade">
      <stop-tip :statusInfo="statusInfo" v-if="stop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="popup"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>

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
import StopTip from '@/views/market/components/StopTip';
import ServerStop from '@/components/ServerStop';
import OrderSearch from '@/components/OrderSearch';

import { toLocalTime } from '@/utils/public';
import DApp from '@/utils/moreWallet';
import { Toast, MessageBox, Indicator } from 'mint-ui';

export default {
  data() {
    return {
      /* ---- 订单中心tools参数设置 start ---- */
      active: 1, // 排序
      search: false, // 筛选
      searchData: null, // 筛选的数据
      isSearchStarus: null, // 是否处于筛选状态
      /* ---- 订单中心tools参数设置 end ---- */

      page: 1,
      pageSize: 20,
      totalPage: 1,

      dataList: [],
      allLoaded: false,

      // loading
      loading: true,
      first: true,
      stop: false,

      statusInfo: { // 交易对上架状态
        status: 0,
      },
      serverStop: false,
    };
  },
  props: [
  ],
  components: {
    StopTip,
    ServerStop,
    OrderSearch,
  },
  watch: {
  },
  created() {
  },
  mounted() {
    // this.handleGetOrderList();
    this.handleGetOrderListNow();
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
    // 未读订单标志为已读
    handleRead(id) {
      if (!id && !this.$store.state.app.unReadCount) {
        return;
      }
      const params = {
        accountNo: this.$store.state.app.accountInfo.account_name,
        orderId: id || '',
      };
      // console.log(params);
      this.$http.post('/order/updateOrderIsReaded', params).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        // 判断是否还存在未读
        if (!id) { // 全部清除
          this.$store.dispatch('setUnReadCount', 0);
          this.dataList.forEach((item) => {
            if (!item.readStatus) {
              this.$set(item, 'readStatus', 1);
            }
          });
          return;
        }
        let n = this.$store.state.app.unReadCount;
        n -= 1;
        this.$store.dispatch('setUnReadCount', n);
      });
    },
    // 切换排序
    handleActive(index) {
      this.active = index;
      this.dataList = [];
      this.searchData = null; // 清空查询条件
      this.isSearchStarus = null; // 取消查询状态
      this.handleGetOrderList();
    },
    // 关闭暂停提示框
    handleClose() {
      this.stop = false;
      this.serverStop = false;
    },
    // 下拉刷新
    loadTop() {
      this.searchData = null; // 清空查询条件
      this.isSearchStarus = null; // 取消查询状态
      this.handleGetOrderList();
    },
    // 上啦加载更多
    loadBottom() {
      this.page += 1;
      if (this.isSearchStarus) {
        this.handleGetOrderList(this.page, this.searchData);
        return;
      }
      this.handleGetOrderList(this.page);
    },
    // 首次加载 / 下拉刷新 - 请求结束end
    handleRefresh(list) {
      this.$refs.loadmore.onTopLoaded();
      this.page = 1;

      this.dataList = list;
    },
    // 上拉加载更多 - 请求结束end
    handleTopage(list) {
      this.$refs.loadmore.onBottomLoaded();

      this.dataList.push(...list);
    },
    // goto 交易明细
    handleGoToDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      // 未读订单展开详情 - 请求接口标志为已读
      if (!item.readStatus) {
        this.handleRead(item.id);
      }
      this.$store.dispatch('setDetail', item);
      this.$router.push('/orderDetail');
      // this.$emit('listenToDetail', item);
    },
    // 筛选
    handleSearch(data) {
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

    handleGetOrderListNow(page, data) {
      this.loading = true;
      this.$http.get('http://120.220.14.100:8088/onedex/v1/order/current', {
        params: {
          account_name: this.$store.state.app.accountInfo.account_name,
        },
      }).then((res) => {
        this.loading = false;
        this.first = false;

        const data = res.data;
        const list = data.list;
        list.forEach((item) => {
          this.$set(item, 'symbol1', item.quote_symbol.toUpperCase());
          this.$set(item, 'symbol2', item.base_symbol.toUpperCase());
          const localTime = toLocalTime(item.order_time);
          this.$set(item, 'localTime', localTime.substr(5));
          this.$set(item, 'orderStatus', 0);
          this.$set(item, 'open', false);
        });

        // if (res.page.totalPage <= this.page) {
        this.allLoaded = true;
        // } else {
        //     this.allLoaded = false;
        // }

        // 判断刷新 / 更多
        if (!page) {
          this.handleRefresh(list);
          return;
        }
        this.handleTopage(list);
      });
    },
    handleGetOrderListHistory(page, data) {
      this.loading = true;
      this.$http.get('http://120.220.14.100:8088/onedex/v1/order/history', {
        params: {
          account_name: this.$store.state.app.accountInfo.account_name,
        },
      }).then((res) => {
        this.loading = false;
        this.first = false;

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

        // if (res.page.totalPage <= this.page) {
        this.allLoaded = true;
        // } else {
        //     this.allLoaded = false;
        // }

        // 判断刷新 / 更多
        if (!page) {
          this.handleRefresh(list);
          return;
        }
        this.handleTopage(list);
      });
    },

    handleGetOrderList(page, data) { // 查询订单记录列表信息
      if (this.active === 1) {
        this.handleGetOrderListNow();
      } else {
        this.handleGetOrderListHistory();
      }
    },
    // 撤销订单
    handleCancelOrder(row) {
      const permission = this.$store.state.app.permission;
      if (!permission) {
        Toast('未授权，请先进行授权');
        this.$store.dispatch('updateauth', this.$store.state.app.key);
        return;
      }
      MessageBox({
        title: this.$t('public.tip'),
        showConfirmButton: true,
        showCancelButton: true,
        message: `${this.$t('order.revokeTip')}?`,
        confirmButtonText: this.$t('public.sure'),
        cancelButtonText: this.$t('public.cancel'),
      }).then((data) => {
        if (data === 'confirm') {
          Indicator.open();
          this.$http.get('http://120.220.14.100:8088/onedex/v1/symbol/mapping', {
            params: {
              symbol: row.quote_symbol,
              contract: row.publish_account,
            },
          }).then((res) => {
            const param = {
              scope: row.type === 'bid' ? res.data.map.bidscope : res.data.map.askscope,
              maker: row.maker,
              uuid: row.order_id,
              authorization: {
                authorization: `${this.$store.state.app.accountInfo.account_name}@active`,
              },
            };
            DApp.cancel(param, (err, res) => {
              Indicator.close();
              if (!err) {
                Toast(this.$t('order.revokeSuccess'));
                setTimeout(this.handleGetOrderList, 1000);
              }
            });
          });
        }
      }).catch(() => {});
    },
    handleRevoke(row) {
      const params = {
        uuid: row.uuid, // 订单uuid
        symbol: row.symbol, // 交易对
      };
      this.$http.post('/order/cancel', params).then((res) => {
        if (res.code === 401) {
          localStorage.removeItem('token');
          this.handleGetTimestampJson();
          return;
        }
        if (res.code === 500) {
          this.stop = true;
          return;
        }
        if (res.code !== 0) {
          this.messageclose = this.$message.error(res.msg);
          return;
        }
        const index = this.dataList.findIndex(item => item.uuid === row.uuid);
        this.dataList[index].orderStatus = 2;
        Toast(this.$t('order.revokeSuccess'));
      });
    },
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson(row) {
      this.$http.get('/common/getTimestampJson').then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        const timestamp = res.timestamp;
        DApp.signText(`${this.$store.state.app.accountInfo.account_name} ${timestamp}`, (err, data) => {
          if (err) {
            Toast(this.$t('error.tokenError'));
            return;
          }
          // 针对tokenpocket特殊处理对签名
          if (this.$store.state.app.channel === 'tokenpocket') {
            this.handleTokenPocket(data, timestamp, row);
            return;
          }
          const signature = data;
          this.handleAccountReg(signature, timestamp, row);
        });
      });
    },
    // 权限获取校验
    handleAccountReg(sign, time, row) {
      const params = {
        signature: sign, // 钱包签名
        account: this.$store.state.app.accountInfo.account_name, // 账户名
        timestamp: time, // 时间戳
        type: this.$store.state.app.channel, // channel
      };
      this.$http.post('/account/verify', params).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        localStorage.setItem('token', res.token);
        this.handleCancelOrder(row);
      });
    },
    // tokenpocket sdk签名自带时间戳 - 特殊处理
    handleTokenPocket(data, time, row) {
      const params = {
        signature: data.signature, // 钱包签名
        account: this.$store.state.app.accountInfo.account_name, // 账户名
        timestamp: time, // 服务器时间戳
        mTimeStamp: data.timestamp, // tokenpocket返回的时间戳
        type: this.$store.state.app.channel, // channel
      };
      this.$http.post('/account/tokenPocketVerify', params).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        localStorage.setItem('token', res.token);
        this.handleCancelOrder(row);
      });
    },
    /* -------- 权限校验 end -------- */
  },
  beforeDestroy() {
  },
};
</script>


<style scoped lang="scss">
@import "../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .scrollView{
    height: calc(100vh - 3.5rem) !important;
    overflow: auto;;
  }
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

.popup{
  border-radius: .2rem;
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

.scrollView{
  height: calc(100vh - 2.8rem);
  overflow: auto;;
}

.list{
  font-size: .3rem;

  /* -------- 订单中心tools样式 start -------- */
  // 标题头部
  .title{
    background: #FFF;
    font-size: .36rem;
    height: .9rem;
    line-height: .9rem;
    padding: 0px .24rem;
    position: relative;
    // display: flex;
    // align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    .unReadCount{
      font-size: .28rem;
      line-height: .4rem;
      margin-left: .08rem;
    }

    .search,
    .clearDiv{
      position: absolute;
      font-size: .4rem;
      display: flex;
      align-items: center;/*垂直居中*/
    }

    .clear{
      font-size: .4rem;
    }

    .search{
      right: 0px;
      right: .24rem;
    }

    .name{
      flex: 10;
      text-align: center;
      width: 100%;
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

    &.pointDiv{
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: flex-end;
    }
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
        flex: 3;
      }

      .symbol{
        .coin{
          margin-left: .28rem;
          margin-right: .3rem;
        }

        .time{
          font-size: .25rem;
          color: $color-999;
        }
      }

      .status{
        flex: 2;
        text-align: right;
        // max-width: 2.6rem;
        font-size: .25rem;
        color: $color-999;

        &>span{
          display: flex;
          align-items: center;/*垂直居中*/
          justify-content: flex-end;/*水平居中*/
        }

        .btn{
          font-size: .25rem;
          height: .42rem;
          line-height: .42rem;
          min-width: .72rem;
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
        text-align: center;
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
        text-align: center;
        flex: 1;

        .toDetail{
          font-size: .16rem;
        }
      }
    }

    .hiddenContent{
      display: flex;
      align-items: center;/*垂直居中*/
      background-color: #fafafa;
      padding: .2rem 0rem;
      margin-top: .12rem;
      position: relative;

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
        width: .5rem;
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

