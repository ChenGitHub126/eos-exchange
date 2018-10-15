<template>
  <div class="searchDiv">
    <!-- 筛选条件 -->
    <div class="content" :class="{'iosVh': isIOS}">
      <!-- 订单状态 -->
      <div class="orderStatus">
        <div class="label">{{ $t('public.orderStatus') }}</div>
        <div class="chooses">
          <div class="item" :class="{'active': data.status === 1}" @click="handleStatus(1)">{{ $t('order.status2') }}</div>
          <div class="item" :class="{'active': data.status === 2}" @click="handleStatus(2)">{{ $t('order.status3') }}</div>
          <div class="item" :class="{'active': data.status === 3}" @click="handleStatus(3)">{{ $t('order.status4') }}</div>
        </div>
      </div>

      <!-- 交易方向 -->
      <div class="orderStatus orderDoirection">
        <div class="label">{{ $t('public.orderDirection') }}</div>
        <div class="chooses">
          <div class="item" :class="{'active': data.direction === 1}" @click="handleDirection(1)">{{ $t('public.buy') }}</div>
          <div class="item" :class="{'active': data.direction === 2}" @click="handleDirection(2)">{{ $t('public.sell') }}</div>
        </div>
      </div>

      <!-- 交易时间 -->
      <!-- <div class="orderStatus orderDate">
        <div class="label">{{ $t('public.orderDate') }}</div>
        <div class="chooses">
          <div class="item" :class="{'active': data.date === 1}" @click="handleDate(1)">{{ $t('public.nearThree') }}</div>
          <div class="item" :class="{'active': data.date === 2}" @click="handleDate(2)">{{ $t('public.nearSeven') }}</div>
          <div class="item" :class="{'active': data.date === 3}" @click="handleDate(3)">{{ $t('public.nearThirty') }}</div>
        </div>
      </div> -->
    </div>

    <!-- btn按钮 -->
    <div class="btn" :class="{'isIOSBtn': isIOS}">
      <button class="color-this" @click="handleReset">{{ $t('public.reset') }}</button>
      <button class="sureBtn" @click="handleSure">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      data: {
        status: -1,
        direction: -1,
        date: -1,
      },
      isIOS: false,
    };
  },
  props: [
    'searchData',
  ],
  mounted() {
    this.data = this.searchData ? JSON.parse(this.searchData) : this.data;
    // 判断是否为ios
    const u = navigator.userAgent;
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  },
  methods: {
    // 订单状态点击事件
    handleStatus(i) {
      if (i === this.data.status) {
        this.data.status = -1;
        return;
      }
      this.data.status = i;
    },
    // 交易方向点击事件
    handleDirection(i) {
      if (i === this.data.direction) {
        this.data.direction = -1;
        return;
      }
      this.data.direction = i;
    },
    // 交易时间点击事件
    handleDate(i) {
      if (i === this.data.date) {
        this.data.date = -1;
        return;
      }
      this.data.date = i;
    },
    // 重置
    handleReset() {
      this.data = {
        status: -1,
        direction: -1,
        date: -1,
        beginTime: '',
        endTime: '',
      };
    },
    // 确定
    handleSure() {
      if (this.data.date !== -1) {
        if (this.data.date === 1) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - (3600 * 1000 * 24 * 3));
          this.data.beginTime = toLocalTime(start).substr(0, 10);
          this.data.endTime = toLocalTime(end).substr(0, 10);
        } else if (this.data.date === 2) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - (3600 * 1000 * 24 * 7));
          this.data.beginTime = toLocalTime(start).substr(0, 10);
          this.data.endTime = toLocalTime(end).substr(0, 10);
        } else {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - (3600 * 1000 * 24 * 30));
          this.data.beginTime = toLocalTime(start).substr(0, 10);
          this.data.endTime = toLocalTime(end).substr(0, 10);
        }
      } else {
        this.data.beginTime = '';
        this.data.endTime = '';
      }
      this.$emit('listenSure', this.data);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .searchDiv{
    height: calc(100vh - .6rem) !important;
  }
}

.searchDiv{
  width: 5.6rem;
  height: 100vh;
  box-sizing: border-box;
  // padding: .36rem;

  .content{
    padding: .36rem;

    &.iosVh{
      height: calc(100% - 1.9rem);
    }

    .orderStatus{
      margin-bottom: 1rem;

      .label{
        font-size: .3rem;
      }

      .chooses{
        font-size: .25rem;
        display: flex;
        align-items: center;/*垂直居中*/
        // justify-content: center;/*水平居中*/
        flex-wrap: wrap;

        .item{
          text-align: center;
          min-width: 2.3rem;
          max-width: 2.3rem;
          flex: 4;
          height: .6rem;
          line-height: .6rem;
          background: $active-white;
          border-radius: .12rem;
          border: 1px solid transparent;
          margin-top: .2rem;
        }

        .active{
          border: 1px solid $color-this;
          color: $color-this;
        }

        .item:nth-child(2n-1){
          margin-right: .12rem;
        }
      }
    }
  }

  .btn{
    position: absolute;
    bottom: 0px;
    width: 100%;
    display: flex;
    align-items: center;/*垂直居中*/
    border-top: 1px solid $color-e3e3e3;

    &.isIOSBtn{
      bottom: .9rem !important;
    }

    &>button{
      background: #FFF;
      font-size: .32rem;
      height: 1rem;
      flex: 1;
    }

    &>button:active{
      background: $active-white;
    }

    .sureBtn{
      background: $color-this;
      color: #FFF;
    }
  }
}

</style>
