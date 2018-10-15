<template>
  <div class="selfArea">
    <div class="topTools">
      <div class="back fl color-999" @click="handleBack">{{ $t('public.back') }}</div>
      <div>{{ $t('quotation.setSelf') }}</div>
      <div class="ok fr color-this" @click="handleSure()">{{ $t('public.complete') }}</div>
    </div>

    <div class="data">
      <div class="head">
        <div>{{ $t('public.symbol') }}</div>
        <div style="max-width:.7rem;">{{ $t('public.top') }}</div>
        <div>{{ $t('public.delete') }}</div>
      </div>
      <div class="list">
        <div class="item" v-for="(item, $index) in showData" :key="$index">
          <div style="text-align: left">
            <span>{{ item.symbol1 }}</span><span class="color-999">/{{ item.symbol2 }}</span>
          </div>
          <div style="max-width:.7rem;">
            <span class="iconfont icon-huaban19 icon"
              @click="handleToTop($index)"
              :class="{'hidden': $index === 0}"></span>
          </div>
          <div>
            <span class="iconfont icon-huaban18 icon" @click="handleDelete($index)"></span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import DApp from '@/utils/moreWallet';

export default {
  data() {
    return {
      allFavoriteData: [],
      showData: [],
      sureFlag: false,
    };
  },
  props: [
  ],
  components: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.handleFavorite();
  },
  methods: {
    // 返回
    handleBack() {
      history.back();
    },
    // 置顶
    handleToTop(index) {
      const top = this.showData[index];
      this.showData.splice(index, 1);
      this.showData.unshift(top);
    },
    // 删除
    handleDelete(index) {
      this.showData.splice(index, 1);
    },
    // 完成
    handleSure(type) {
      // 限制只能点击一次
      if (this.sureFlag && !type) {
        return;
      }
      // 无响应后1秒才可以再次点击
      setTimeout(() => {
        this.sureFlag = false;
      }, 1000);

      this.sureFlag = true;
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson();
        return;
      }

      let arr = [];
      this.allFavoriteData.forEach((item) => {
        arr.push(item.symbol);
      });
      if (type) {
        arr = [];
        this.showData.forEach((item) => {
          arr.push(item.symbol);
        });
      }
      if (arr.length === 0) {
        // this.handleBack();
        return;
      }
      // 取消收藏
      const params = {
        accountNo: this.$store.state.app.accountInfo.account_name,
        symbols: arr.join(','),
        enable: type ? 1 : 0,
      };
      this.$http.post('/accountFavorite/setting', params).then((res) => {
        if (res.code === 401) {
          localStorage.removeItem('token');
          Toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            this.handleGetTimestampJson();
          }, 2000);
          return;
        }
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        if (!type) {
          this.handleSure(1);
          setTimeout(() => {
            this.handleBack();
          }, 100);
          // return;
        }
      });
    },
    // 获取收藏
    handleFavorite() {
      this.showData = [];
      // 异步获取自选交易对 - 进行匹配添加list
      const params = {
        accountNo: this.$store.state.app.accountInfo.account_name,
      };
      this.$http.get('/accountFavorite/list', { params }).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.allFavoriteData = res.favoriteList;
        this.allFavoriteData.forEach((item) => {
          const symbolArr = item.symbol.split('_');
          this.$set(item, 'symbol1', symbolArr[0]);
          this.$set(item, 'symbol2', symbolArr[1]);
        });
        const arr = JSON.stringify(this.allFavoriteData);
        this.showData = JSON.parse(arr);
      });
    },

    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson() {
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
            this.handleTokenPocket(data, timestamp);
            return;
          }
          const signature = data;
          this.handleAccountReg(signature, timestamp);
        });
      });
    },
    // 权限获取校验
    handleAccountReg(sign, time) {
      const params = {
        signature: sign, // 钱包签名
        account: this.$store.state.app.accountInfo.account_name, // 账户名
        timestamp: time, // 时间戳
        type: this.$store.state.app.channel, // channel
        // type: 4, // channel
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
        this.handleSure();
      });
    },
    // tokenpocket sdk签名自带时间戳 - 特殊处理
    handleTokenPocket(data, time) {
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
        this.handleSure();
      });
    },
    /* -------- 权限校验 end -------- */
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.hidden{
  visibility: hidden;
}

.selfArea{
  font-size: .36rem;

  .topTools{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/
    text-align: center;
    height: .9rem;
    padding: 0px .24rem;
    background: #FFF;
    margin-bottom: .12rem;

    &>div{
      flex: 7;
    }

    .ok,
    .back{
      flex: 1;
      font-size: .32rem;
    }
  }

  .data{
    background: #FFF;
    padding: 0rem .24rem;

    .head{
      display: flex;
      align-items: center;/*垂直居中*/
      // justify-content: center;/*水平居中*/
      text-align: center;
      font-size: .28rem;
      color: $color-999;
      height: .75rem;
      border-bottom: 1px solid $color-e3e3e3;

      &>div{
        flex: 1;
      }
      // &>div:first-child{
      //   flex: 2
      // }
    }

    .list{
      .item{
        display: flex;
        align-items: center;/*垂直居中*/
        // justify-content: center;/*水平居中*/
        text-align: center;
        height: 1.18rem;
        border-bottom: 1px solid $color-e3e3e3;

        &:last-child{
          border-bottom: 1px solid transparent;
        }

        &>div{
          flex: 1;
        }
        // &>div:first-child{
        //   flex: 2
        // }

        .icon{
          font-size: .36rem;
          color: $color-this;
        }
      }
    }
  }
}
</style>
