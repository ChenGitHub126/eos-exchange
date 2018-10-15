<template>
    <div class="morePage">
        <!-- topShow -->
        <div class="more">
            <div class="center">
                <div class="iconfont icon-huaban23 logoIcon"></div>
                <div class="bannerTitle">{{$t('index.bannerTitle')}}</div>
            </div>
        </div>

        <!-- list -->
        <div class="list">
            <!-- 委托账户 -->
            <div class="item" @click="showAccount = true">
                <div>
                    <span class="iconfont icon-huaban14 icon"></span>
                </div>
                <div class="name">
                    <span>{{ $t('more.toAccount') }}</span>
                </div>
                <div class="link">
                    <span class="iconfont icon-huaban11"></span>
                </div>
            </div>
            <!-- 语言 -->
            <div class="item">
                <div>
                    <span class="iconfont icon-huaban28 icon"></span>
                </div>
                <div class="name">
                    <select id="lang" v-model="language" class="langSelect" ref="lang">
                        <option v-for="(item, $index) in solts" :key="$index" :value="item.key">{{ item.name }}</option>
                    </select>
                    <span>{{ $t('more.language') }}</span>
                </div>
                <div class="link">
                    <span class="iconfont icon-huaban11"></span>
                </div>
            </div>
            <!-- 帮助中心 -->
            <div class="item" @click="handleToHelpCenter">
                <div>
                    <span class="iconfont icon-huaban13 icon"></span>
                </div>
                <div class="name">
                    <span>{{ $t('more.help') }}</span>
                    <span class="tip">{{ $t('more.helpTip') }}</span>
                </div>
                <div class="link">
                    <span class="iconfont icon-huaban11"></span>
                </div>
            </div>
            <!-- 提交工单 -->
            <div class="item" @click="handleToForm">
                <div>
                    <span class="iconfont icon-huaban34 icon"></span>
                </div>
                <div class="name">
                    <span>{{ $t('more.form') }}</span>
                    <span class="tip">{{ $t('more.formTip') }}</span>
                </div>
                <div class="link">
                    <span class="iconfont icon-huaban11"></span>
                </div>
            </div>
            <!-- 关于我们 -->
            <div class="item" @click="handleAboutUs">
                <div>
                    <span class="iconfont icon-huaban12 icon"></span>
                </div>
                <div class="name">
                    <span>{{ $t('more.aboutUs') }}</span>
                </div>
                <div class="link">
                    <span class="iconfont icon-huaban11"></span>
                </div>
            </div>
        </div>

        <!-- dialog account -->
        <mt-popup
                class="dialogAccount"
                popup-transition="popup-fade"
                v-model="showAccount">
            <ToAccount :showAccount = "showAccount" @listenCloseAccount = "handleCloseAccount"/>
        </mt-popup>

        <!-- language -->
        <!-- <Language ref="language" class="hidden"/> -->
    </div>
</template>

<script>
// import Language from '@/components/Language';
import ToAccount from './components/ToAccount';

export default {
  data() {
    return {
      showAccount: false, // 显示委托账户
      solts: [
        {
          key: 'en',
          name: 'English',
        },
        {
          key: 'zh-CN',
          name: '简体中文',
        },
        {
          key: 'zh-TW',
          name: '繁體中文',
        },
        {
          key: 'ko',
          name: '한국어',
        },
      ],
      language: '',
    };
  },
  props: [
  ],
  components: {
    ToAccount,
    // Language,
  },
  watch: {
    language(newVal) {
      this.handleCheckLang(newVal);
    },
  },
  created() {
  },
  mounted() {
    this.language = this.$store.state.app.language;
    this.handleCheckLang(this.language);
  },
  methods: {
    /*
            * 语言切换
            * 返回 lang
            */
    handleCheckLang(lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch('setLanguage', lang);
    },
    // 关闭dialog
    handleCloseAccount() {
      this.showAccount = false;
    },
    // 语言
    handleShowLanguage() {
      this.$refs.language.handleShow();
    },
    // 帮助中心
    handleToHelpCenter() {
      const lang = this.$store.state.app.language;
      if (lang !== 'en') {
        window.location.href = `https://support.newdex.io/hc/${lang.toLowerCase()}`;
        return;
      }
      window.location.href = 'https://support.newdex.io/hc/en-us';
    },
    // 关于我们
    handleAboutUs() {
      const lang = this.$store.state.app.language;
      if (lang === 'ko') {
        window.location.href = 'https://support.newdex.io/hc/ko/articles/360012388492-%EA%B1%B0%EB%9E%98%EC%86%8C-%EC%86%8C%EA%B0%9C';
        return;
      }
      if (lang === 'zh-CN') {
        window.location.href = 'https://support.newdex.io/hc/zh-cn/articles/360012388492-%E5%B9%B3%E5%8F%B0%E4%BB%8B%E7%BB%8D';
        return;
      }
      if (lang === 'zh-TW') {
        window.location.href = 'https://support.newdex.io/hc/zh-tw/articles/360012388492-%E5%B9%B3%E8%87%BA%E4%BB%8B%E7%B4%B9';
        return;
      }
      window.location.href = 'https://support.newdex.io/hc/en-us/articles/360012388492-About-us';
    },
    // 提交工单
    handleToForm() {
      const lang = this.$store.state.app.language;
      if (lang === 'ko') {
        window.location.href = 'https://support.newdex.io/hc/ko/requests/new';
        return;
      }
      if (lang === 'zh-CN') {
        window.location.href = 'https://support.newdex.io/hc/zh-cn/requests/new';
        return;
      }
      if (lang === 'zh-TW') {
        window.location.href = 'https://support.newdex.io/hc/zh-tw/requests/new';
        return;
      }
      window.location.href = 'https://support.newdex.io/hc/en-us/requests/new';
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
    @import "../../assets/css/public.scss";

    .morePage{
        background: #fafafa;
    }

    .langSelect{
        width: 100%;
        font-size: .3rem;
        position: absolute;
        height: 100%;
        background: transparent;
        top: 0;
        left: 0px;
        opacity: 0;
        border: 1px solid black;
    }

    .more{
        // background: url('../../assets/img/more/Group.png') ;
        background: linear-gradient(to right, rgba(68,92,241,0.96) , rgba(57,82,193,1));
        height: 4.1rem;
        max-width: 100%;
        text-align: center;
        color: white;
        position: relative;
        box-shadow: 0px 0px .15rem $color-333;

        .center{
            width: 6rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .logoIcon{
                font-size: .6rem;
                margin-bottom: .2rem;
            }

            .bannerTitle{
                color: rgba(255, 255, 255, .7);
                font-size: 0.32rem;
                font-weight: 300;
            }
        }
    }

    .list{
        margin: .36rem .24rem;
        font-size: .3rem;
        background: #FFF;
        padding: 0px .16rem;
        border-radius: .2rem;
        box-shadow: 0px 0px .15rem #f0f0f0;

        .item{
            display: flex;
            width: 100%;
            align-items: center;/*垂直居中*/
            justify-content: center;/*水平居中*/
            height: 1.2rem;
            border-bottom: 1px solid $color-e3e3e3;
            background: #fff;
            position: relative;

            &:last-child{
                border-bottom: 1px solid transparent;
            }

            // &:active{
            //   background: #cdcdcd;
            //   opacity: .8;
            //   color: rgba($color: #333, $alpha: 0.8)
            // }

            &>div{
                flex: 1;
                padding: 0px .1rem 0px .24rem;

                &.name{
                    flex: 10;
                    padding: 0px;

                    .tip{
                        color: $color-999;
                        font-size: .25rem;
                        margin-left: .3rem;
                    }
                }

                &.link{
                    text-align: right;
                    color: $color-999;
                }

                span{
                    font-size: .3rem;
                }

                .icon{
                    font-size: .46rem;
                    color: $color-this;
                }
            }
        }
    }

    // dialog
    .dialogAccount{
        border-radius: .12rem;
    }

    .hidden{
        position: absolute;
        top: -100px;
    }
</style>
