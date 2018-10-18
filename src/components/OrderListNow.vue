<template>
  <div class="list">
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
            <button class="btn" v-if="statusInfo.status != 1" @click="handleCancelOrder(item)">{{ $t('public.revoke') }}</button>
            <button class="btn stop" v-if="statusInfo.status === 1" @click="handleStop">{{ $t('public.revoke') }}</button>
            <button class="btn stop" v-if="statusInfo.status === 3" @click="oldDown = true">{{ $t('public.revoke') }}</button>
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
            <div class="num">{{ item.orderCountStr || '—' }}</div>
          </div>
          <div class="">
            <div class="tip">{{ $t('public.dealCount') }}</div>
            <div class="num">{{ item.dealCountStr || '—' }}</div>
          </div>
          <div class="tools color-this">
            <span v-if="(item.dealStatus !== 0)">
              <span v-if="!item.open" class="iconfont icon-huaban37 toDetail"></span>
              <span v-if="item.open" class="iconfont icon-huaban35 toDetail"></span>
              <!-- <span v-if="!item.open">{{ $t('public.open') }}</span>
              <span v-if="item.open">{{ $t('public.close1') }}</span> -->
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
      <div class="loading" v-if="loading">
        <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
      </div>

      <!-- 没有更多记录 -->
      <div class="noData" v-if="allLoaded && dataList.length">
        <div class="noTip color-999">{{ $t('public.noMore') }}</div>
      </div>
    </mt-loadmore>

    <!-- 暂停交易提示 -->
    <mt-popup
      class="popup"
      v-model="stop"
      popup-transition="popup-fade">
      <stop-tip :statusInfo="statusInfo" v-if="stop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 已下架 -->
    <mt-popup
      v-model="oldDown"
      class="specialTip"
      popup-transition="popup-fade">
      <old-down-tip :statusInfo="statusInfo" v-if="oldDown" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="popup"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import StopTip from '@/views/market/components/StopTip';
import OldDownTip from '@/views/market/components/OldDownTip';
import ServerStop from '@/components/ServerStop';

import { toLocalTime } from '@/utils/public';
import DApp from '@/utils/moreWallet';
import Io from '@/utils/socket/index';
import { Toast, MessageBox } from 'mint-ui';

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

      // status
      stop: false, // 交易对暂停
      down: false, // 交易对下架
      oldDown: false, // 已下架
      serverStop: false,
      symbol: '',
    };
  },
  props: [
    // 'symbol',
    'statusInfo',
  ],
  components: {
    StopTip,
    OldDownTip,
    ServerStop,
  },
  watch: {
    // symbol() {
    //   this.handleGetOrderList();
    // },
    '$route.params.symbol': function listen() {
      this.handleGetOrderList();
    },
  },
  created() {
  },
  mounted() {
    // Toast(this.$route.params.symbol)
    this.handleGetOrderList();
    /*
    * ORDER_UPDATE(1, "orderupdate", "订单更新"),
    * ORDER_SUCCESS(2, "ordersuccess", "下单成功"),
    * CANCEL_SUCCESS(3, "cancelsuccess", "撤单成功"),
    * ORDER_FAIL(4, "orderfail", "下单失败"),
    * CANCEL_FAIL(5, "cancelfail", "撤单失败");
    */
    console.log('OrderListNow.vue', 'IO开始监听订单状态的改变');
    Io.addListenerOrder('start', (res) => {
      // console.log('-------------当前订单-------------'); // eslint-disable-line
      if (res.type === 'orderupdate' || res.type === 'ordersuccess') { // 下单成功 - 接口获取新的列表
        this.handleGetOrderList();
        // this.$store.dispatch('setBadge', true); // 标记
      }
      if (res.type === 'cancelsuccess') { // 撤单成功
        this.handleGetOrderList();
      }
      if (res.type === 'cancelfail') { // 撤单失败
        Toast(this.$t('error.revokeError'));
        this.handleGetOrderList();
      }
    });
  },
  methods: {
    // 展示暂停交易
    handleStop() {
      this.stop = true;
    },
    // 关闭暂停提示框
    handleClose() {
      this.stop = false;
      this.oldDown = false;
      this.serverStop = false;
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
        this.symbol = this.$route.params.symbol.toUpperCase();
        this.loading = true;
        const params = {
          currPage: page || 1, // 当前页码
          pageSize: 10, // 每页数量
          orderByName: '', // 排序字段
          orderByType: '', // 排序方式(asc, desc)
          accountNo: this.$store.state.app.accountInfo.account_name, // 账户名
          // accountNo: 'eosxhbeosxhb', // 账户名 - 测试
          symbol: this.symbol, // 交易对
        };
        console.log('OrderListNow.vue', '获取指定交易对的当前订单记录');
        this.$http.post('/order/queryCurrentOrderPage', params).then((res) => {
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
    // 首次加载 / 下拉刷新
    handleRefresh(list) {
      this.$refs.loadmore.onTopLoaded();
      this.page = 1;

      this.dataList = list;
    },
    // 上拉加载更多
    handleTopage(list) {
      this.$refs.loadmore.onBottomLoaded();

      this.dataList.push(...list);
    },
    // 订单详情
    handleRowDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      this.$set(item, 'open', !item.open);
    },
    // 撤销订单
    handleCancelOrder(row) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson(row);
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
          // 判断服务器状态
          // const serverStatus = JSON.parse(sessionStorage.getItem('serverStatus'));
          // if (!serverStatus) {
          //   this.serverStop = true;
          //   return;
          // }
          this.$http.get('common/getCommonParam').then((res) => {
            if (res.code !== 0) {
              return;
            }
            if (!Number(res.exchangeStatus)) {
              this.serverStop = true;
              return;
            }
            this.handleGetSymbolStatus(row);
          });
        }
      }).catch((() => {}));
    },
    handleGetSymbolStatus(row) {
      // 撤单接口请求
      console.log('OrderListNow.vue', '撤销当前订单');
      const params = {
        uuid: row.uuid, // 订单uuid
        symbol: row.symbol, // 交易对
      };
      this.$http.post('/order/cancel', params).then((res) => {
        if (res.code === 401 || res.code === 500) {
          localStorage.removeItem('token');
          this.handleGetTimestampJson();
          return;
        }
        if (res.code !== 0) {
          this.messageclose = this.$message.error(res.msg);
          return;
        }
        const index = this.dataList.findIndex(item => item.uuid === row.uuid);
        this.dataList.splice(index, 1);
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
    // 权限获取校验 - 正常签名校验
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
        mTimeStamp: data.timestamp, // tokenpocket返回的���间戳
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
    Io.addListenerOrder('stop');
  },
};
</script>


<style scoped lang="scss">
@import "../assets/css/public.scss";

.stop{
  border-color: $color-999 !important;
  color: $color-999 !important;
}

.popup{
  border-radius: .2rem;
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
  // background: #fafafa;

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
