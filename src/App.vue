<template>
    <div id="app">
        <!-- 主内容 -->
        <div class="mainContent" :class="{'noTabbar': !showTabbar}">
            <transition name="fade" mode="out-in" v-if="!$route.meta.keepAlive">
                <router-view></router-view>
            </transition>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </div>

        <!-- tabbar -->
        <div class="tabDiv" v-show="showTabbar">
            <Tabbar />
        </div>

        <!-- 低版本提示 -->
        <mt-popup
                class="popup"
                v-model="versionTip"
                popup-transition="popup-fade">
            <div class="versionTip">
                <div class="title">{{ $t('public.tip') }}</div>
                <div class="content">{{ $t('index.versionUnavailableTip') }}</div>
                <div class="btnDiv">
                    <button class="btn" @click="versionTip = false">{{ $t('public.sure') }}</button>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
// import HeadNav from '@/components/HeadNav';
// import Footer from '@/components/Footer';
import Io from '@/utils/socket/index';
import Tabbar from '@/components/Tabbar';
import DApp from '@/utils/moreWallet';
import { GetUrlPara } from '@/utils/public';
import { Toast } from 'mint-ui';

export default {
  name: 'App',
  data() {
    return {
      showTabbar: true, // 显示tabbar
      language: null,

      get: false, // 用户信息获取状态
      versionTip: false, // 版本更新提示
    };
  },
  watch: {
    $route(newVal) {
      // 根据路由判断tabBar是否显示
      if (newVal.name === 'orderDetail'
                    || newVal.name === 'selfAreaSetting'
                    || newVal.name === 'coinHistoryList') {
        this.showTabbar = false;
        return;
      }
      this.showTabbar = true;
      document.getElementsByClassName('mainContent')[0].scrollTop = 0;
    },
    '$store.state.app.accountInfo': function listen() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.account_name) {
        console.log('App.vue', '执行IO');
        this.handleGetAccountAgree();
        this.handleNotReadCount();
        Io.accountOut(this.$store.state.app.accountInfo.account_name); // 退出账号
        Io.accountBind(this.$store.state.app.accountInfo.account_name); // 绑定账号
        this.handleOrderUpdata();
      }
    },
  },
  mounted() {
    // alert(JSON.stringify(GetUrlPara()));
    if (!this.$store.state.app.language) {
      this.handleGetPhoneLanguage();
    }
    this.handleCheckServerStop();
    // this.handleGetChainFlyAccount();
    this.handleGetChannel();

    // localStorage.removeItem('accountInfo') // 测试第一次打开页面
    // localStorage.removeItem('reLoad')
  },
  components: {
    // HeadNav,
    // Footer,
    Tabbar,
  },
  methods: {
    // 获取dapp名称
    handleGetChannel() {
      // const oldChannel = localStorage.getItem('channel');
      // const newChannel = GetUrlPara().channel;
      // let channel = newChannel && oldChannel !== newChannel ? newChannel : oldChannel;
      // if (!channel) {
      //   channel = 'scatter';
      // }

      // 暂时设置为仅支持scatter
      const channel = 'scatter';

      this.$store.dispatch('setChannel', channel);
      DApp.setChannel(channel);

      // 只有获得channel后，才能继续
      // this.handleCheckAvailable(); // 暂时不检测版本

      setTimeout(() => {
        this.handleGetAccount();
      }, 1000);
      // 判断是否是scatter
      // if (channel !== 'scatter' && channel !== 'mathwallet') {
      //   this.handleGetAccount();
      // }
    },
    // 获取用户信息
    handleGetAccount() {
      if (!this.get) {
        DApp.getAccount((e, data) => {
          if (e) {
            this.handleGetAccount();
            return;
          }
          this.get = true;
          // 判断是否切换账号
          if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.account_name !== data.account_name) {
            localStorage.removeItem('token');
          }
          this.$store.dispatch('setAccountInfo', data);
        });
      }
    },
    // 第一次使用dapp时，获取手机语言
    handleGetPhoneLanguage() {
      if (navigator.language) {
        this.language = navigator.language;
      } else {
        this.language = navigator.browserLanguage;
      }
      if (this.language !== 'zh-CN' && this.language !== 'zh-TW' && this.language !== 'ko') {
        this.language = 'en';
      }
      this.$i18n.locale = this.language;
      this.$store.dispatch('setLanguage', this.language);
    },
    // 判断版本是否支持
    handleCheckAvailable() {
      DApp.checkAvailable((e, available) => {
        if (e == null && !available) {
          // MessageBox({
          //   title: this.$t('public.tip'),
          //   message: this.$t('index.versionUnavailableTip'),
          // });
          this.versionTip = true;
        }
      });
    },
    // 获取委托账户(已无用，改为在查询服务器状态时一起返回)
    handleGetChainFlyAccount() {
      this.$http.post('/account/exchangeEosAccount').then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$store.dispatch('setToAccount', res.exchangeEosAccount);
      });
    },
    // 查询服务器状态 - 0：暂停 | 1：正常，(并设置委托账户)
    handleCheckServerStop() {
      console.log('App.vue', '检查服务器状态并设置委托账户');
      // this.$http.get('common/getCommonParam').then((res) => {
      //   if (res.code !== 0) {
      //     setTimeout(() => {
      //       this.handleCheckServerStop();
      //     }, 500);
      //     return;
      //   }
      this.$store.dispatch('setToAccount', 'newdexpocket');
      // if (Number(res.exchangeStatus) === 0) {
      //   sessionStorage.setItem('serverStatus', false); // 服务暂停
      //   return;
      // }
      sessionStorage.setItem('serverStatus', true); // 服务正常
      // });
    },
    // 获取用户是否同意使用协议
    handleGetAccountAgree() {
      // const params = {
      //   account: this.$store.state.app.accountInfo.account_name,
      //   type: 1, // 1 - eos | 2 - 其他
      // };
      // this.$http.post('/account/getAccountAgreement', params).then((res) => {
      //   if (res.code !== 0) {
      //     Toast({
      //       message: res.msg,
      //       position: 'center',
      //       duration: 2000,
      //     });
      //     return;
      //   }
      //   if (res.status === 1) {
      sessionStorage.setItem('accountAgree', true);
      //     return;
      //   }
      //   sessionStorage.setItem('accountAgree', false);
      // });
    },
    // 获取账户未读消息总数
    handleNotReadCount() {
      console.log('App.vue', '获取账户未读消息总数');
      // const params = {
      //   accountNo: this.$store.state.app.accountInfo.account_name,
      // };
      // this.$http.post('/order/getUnReadCount', params).then((res) => {
      //   if (res.code !== 0) {
      //     Toast({
      //       message: res.msg,
      //       position: 'center',
      //       duration: 2000,
      //     });
      //     return;
      //   }
      //   this.$store.dispatch('setUnReadCount', res.unReadCount);
      // });
    },
    // 监听账户订单状态
    handleOrderUpdata() {
      Io.addListenerOrder('stop');
      Io.addListenerOrder('start', (res) => {
        console.log('App.vue', res);
        if (res.type === 'orderupdate') { // 订单更新 - 查询未读订单条数
          this.handleNotReadCount();
        }
      });
    },
  },
  beforeDestroy() {
    Io.accountOut(this.$store.state.app.accountInfo.account_name); // 退出账号
  },
};
</script>

<style lang="scss" scope>
    @import './assets/css/public.scss';

    html,body{
        height: 100%;
        overflow: hidden;
    }

    #app{
        height: 100%;
        overflow: hidden;
        background: #fafafa;
    }

    .navDivNone{
        height: .9rem;
    }

    .mainContent{
        height: calc(100% - 1rem);
        overflow: auto;
        background: #fafafa;

        &.noTabbar{
            height: 100%;
        }
    }

    .footerFlxed{
        bottom: 0px;
        position: absolute;
        width: 100%;
        max-width: 750px;
    }

    .tabDiv{
        position: fixed;
        width: 100%;
        max-width: 750px;
        bottom: 0px;
        background: #ffffff;
        box-shadow: 0px -0.01rem .05rem rgba(75, 75, 75, 0.10);
    }

    .popup{
        border-radius: .12rem;
        font-size: .3rem;

        .versionTip{
            padding: .3rem .5rem .2rem .5rem;
            width: 6.5rem;
            box-sizing: border-box;

            .title{
                text-align: center;
                margin-bottom: .3rem;
                font-weight: bold;
            }

            .content{
                margin-bottom: .4rem;
                line-height: .5rem;
            }

            .btnDiv{
                text-align: center;
                border-top: 1px solid #efefef;
                padding-top: .2rem;

                .btn{
                    font-size: .3rem;
                    width: 100%;
                    color: $color-this;
                    height: .5rem;
                    line-height: .5rem;
                    background: transparent;
                }
            }
        }
    }
</style>
