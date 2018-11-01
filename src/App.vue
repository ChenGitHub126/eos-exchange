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
import Tabbar from '@/components/Tabbar';
import DApp from '@/utils/moreWallet';
import { GetUrlPara } from '@/utils/public';
import cfg from '@/config';
import { api } from '@/api';
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
        this.handleGetAccountAgree();
        this.handleNotReadCount();
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
      const oldSource = localStorage.getItem('source');
      const newSource = GetUrlPara().source;
      let source = newSource && oldSource !== newSource ? newSource : oldSource;
      if (!source) {
        source = cfg.publicCfg.defaultSource;
      }
      this.$store.dispatch('setSource', source);
      DApp.setSource(source);

      // 只有获得source后，才能继续
      // this.handleCheckAvailable(); // 暂时不检测版本

      setTimeout(() => {
        this.handleGetAccount();
      }, 1000);
      // 判断是否是source
      // if (source !== 'scatter' && source !== 'mathwallet') {
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
          this.getPermission(data.account_name);
        });
      }
    },
    getPermission(accountName) {
      try {
        DApp.getPermission(accountName, (res, key) => {
          this.$store.dispatch('setKey', key);
          if (!res) {
            this.$store.dispatch('updateauth', key);
            return;
          }
          this.$store.dispatch('setPermission', res);
        });
      } catch (e) {
        setTimeout(() => {
          this.getPermission();
        }, 1000);
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
    // 判断版本是否支持(不检测)
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
    // 查询服务器状态 - 0：暂停 | 1：正常，(并设置委托账户)
    handleCheckServerStop() {
      console.log('App.vue', '检查服务器状态并设置委托账户');
      this.$http.get(api.checkServer).then((res) => {
        if (res.code !== '100200') {
          sessionStorage.setItem('serverStatus', false); // 服务暂停
          setTimeout(() => {
            this.handleCheckServerStop();
          }, 500);
          return;
        }
        sessionStorage.setItem('serverStatus', true); // 服务正常
      // this.$store.dispatch('setToAccount', 'onedexchange');
      });
    },
    // 获取用户是否同意使用协议
    handleGetAccountAgree() {
      sessionStorage.setItem('accountAgree', true);
    },
    // 获取账户未读消息总数
    handleNotReadCount() {
      console.log('App.vue', '获取账户未读消息总数');
      //   this.$store.dispatch('setUnReadCount', res.unReadCount);
    },
  },
  beforeDestroy() {
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
