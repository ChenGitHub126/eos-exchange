<template>
  <div class="page-index">
    <!-- banner start -->
    <div class="banner">
      <div class="center">
        <!--<div class="iconfont icon-huaban23 logoIcon"></div>-->
         <div class="bannerTitle">全球首家EOS“完全”去中心化交易所</div>
        <!--<div class="bannerTitle">{{$t('index.bannerTitle')}}</div>-->
      </div>
      <div class="fr langu">
         <!--<language/>-->
      </div>
    </div>
    <!-- banner end -->

    <!-- notice start -->
    <!--<div class="noticeDiv">-->
      <!--<div class="notice" v-show="!specialNew || specialNew.isLooked">-->
        <!--<div class="noticeTool fl">-->
          <!--&lt;!&ndash; <span class="iconfont icon-homepage-notice-ic color-this noticeIcon"></span> &ndash;&gt;-->
          <!--<span class="color-this">{{ $t('index.news')}}：</span>-->
        <!--</div>-->
        <!--<div class="noticeItem fl" id="notice">-->
          <!--<div class="notices" v-for="(item, index) in noticeList" :key="index">-->
            <!--<div class="noti-item">-->
              <!--<a :href="item.html_url">{{ item.title }}</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="notices" v-for="(item, index) in noticeList" :key="index + '1'">-->
            <!--<div class="noti-item">-->
              <!--<a :href="item.html_url">{{ item.title }}</a>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash; special notice start &ndash;&gt;-->
      <!--<div class="notice" v-show="specialNew && !specialNew.isLooked">-->
        <!--<div class="noticeTool fl">-->
          <!--<span class="iconfont icon-huaban46 color-yellow noticeIcon"></span>-->
          <!--<span class="color-yellow">{{ $t('index.new')}}</span>-->
        <!--</div>-->
        <!--<div class="noticeItem fl">-->
          <!--<div class="notices">-->
            <!--<div class="noti-item">-->
              <!--<a href="javascript:;" @click="handleToSpecialNotice(specialNew.html_url)">{{ specialNew ? specialNew.title : '' }}</a>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash; special notice end &ndash;&gt;-->
    <!--</div>-->
    <!-- notice end -->

    <!-- accountInfo start -->
    <div class="accountInfo">
      <Account />
    </div>
    <!-- accountInfo end -->

    <!-- content table start -->
    <div class="content">
      <div class="contentTop" style="width:100%">
        <div class="item" :class="{'activeThis': activeIndex === 1}" @click="handleActiveChange(1)">
          {{ $t('index.riseList') }}
        </div>
        <div class="item" :class="{'activeThis': activeIndex === 2}" @click="handleActiveChange(2)">
          24H{{ $t('index.turnoverList') }}
        </div>
      </div>
      <div class="data">
        <table-list :activeIndex="activeIndex"/>
      </div>
      <div class="more">
        <a href="javascript:;" class="color-blue" @click="handleToMore">{{ $t('index.more') }}&gt;</a>
      </div>
    </div>
    <!-- content table end -->

    <!-- advantage 优势 start -->
    <!--<div class="advantage color-333">-->
      <!--<div class="topTitle color-this">{{ $t('index.special') }}</div>-->
      <!--<div class="item">-->
        <!--<img src="@/assets/img/index/homepage-user-ic.png" alt="" class="img">-->
        <!--<div class="itemTitle color-this">{{ $t('index.experience') }}</div>-->
        <!--<div class="tip">{{ $t('index.experienceTip1') }}</div>-->
        <!--<div v-if="$store.state.app.language === 'en'" class="tip">{{ $t('index.experienceTip3') }}</div>-->
        <!--<div class="tip">{{ $t('index.experienceTip2') }}</div>-->
      <!--</div>-->
      <!--<div class="item">-->
        <!--<img src="@/assets/img/index/homepage-security-ic.png" alt="" class="img">-->
        <!--<div class="itemTitle color-this">{{ $t('index.safe') }}</div>-->
        <!--<div class="tip">{{ $t('index.safeTip1') }}</div>-->
        <!--<div v-if="$store.state.app.language === 'en'" class="tip">{{ $t('index.safeTip3') }}</div>-->
        <!--<div class="tip">{{ $t('index.safeTip2') }}</div>-->
      <!--</div>-->
      <!--<div class="item">-->
        <!--<img src="@/assets/img/index/homepage-open-ic.png" alt="" class="img">-->
        <!--<div class="itemTitle color-this">{{ $t('index.data') }}</div>-->
        <!--<div class="tip">{{ $t('index.dataTip1') }}</div>-->
        <!--<div v-if="$store.state.app.language === 'en'" class="tip">{{ $t('index.dataTip3') }}</div>-->
        <!--<div class="tip">{{ $t('index.dataTip2') }}</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 优势 end -->

    <!-- footer start -->
     <div class="footer color-999">
      <div class="footerTip">{{ $t('footer.tip') }}</div>
      <div class="footerTip">&copy;2018 Onedex.io,All right reserved</div>
    </div>
    <!-- footer end -->
  </div>
</template>

<script>
import TableList from '@/components/TableList';
import Language from '@/components/Language';
import Account from '@/components/Account';
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      activeIndex: 1, // 当前选中排行榜
      noticeList: [], // 公告
      specialNew: null, // 重要的公告
      lang: {
        active: 'zh-CN',
        list: [
          {
            name: '简体中文',
            value: 'zh-CN',
          },
          {
            name: 'English',
            value: 'en',
          },
          {
            name: '繁體中文',
            value: 'zh-TW',
          },
        ],
      },

      timer: null, // 定时器
      timerout: null,
    };
  },
  components: {
    TableList, // 列表
    Language, // 语言
    Account, // 账户信息
  },
  watch: {
    '$store.state.app.language': function listen() {
      // this.handleGetZendeskNote();
    },
  },
  created() {
    // this.handleCheckLang('en');
    this.specialNew = localStorage.getItem('specialNew') ? JSON.parse(localStorage.getItem('specialNew')) : null;
  },
  mounted() {
    // this.handleGetZendeskNote();
  },
  methods: {
    // 跳转重要公告
    handleToSpecialNotice(url) {
      this.specialNew.isLooked = true;
      localStorage.setItem('specialNew', JSON.stringify(this.specialNew));
      location.href = url;
    },
    // 查看更多
    handleToMore() {
      this.$router.push({
        name: 'market',
        params: {
          type: this.activeIndex,
        },
      });
    },
    handleActiveChange(index) {
      this.activeIndex = index;
    },

    // 公告滚动
    handleScroll() {
      const mainTop = document.getElementById('notice');
      if (!mainTop) {
        return;
      }
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.timerout) {
        clearTimeout(this.timerout);
      }
      this.timerout = setTimeout(() => {
        this.timer = setInterval(() => {
          mainTop.scrollTop += 4;
          const height = mainTop.getElementsByClassName('notices')[0].scrollHeight;
          if (mainTop.scrollTop > height) {
            mainTop.appendChild(mainTop.getElementsByClassName('notices')[0]);
            mainTop.scrollTop -= height;
            this.handleScroll();
          }
        }, 100);
      }, 5000);
    },
    // zendesk 获取公告
    handleGetZendeskNote() {
      let lang = 'en-us';
      if (this.$store.state.app.language !== 'en') {
        lang = this.$store.state.app.language.toLowerCase();
      }
      axios.get(`https://newdex.zendesk.com/api/v2/help_center/${lang}/categories/360000802432/articles.json?per_page=3`).then((response) => {
        // 特殊公告处理
        const specialList = response.data.articles.filter(v => v.promoted) || [];
        let specialNew = null;
        if (specialList.length) {
          specialNew = specialList[0];
          const localNews = localStorage.getItem('specialNew') ? JSON.parse(localStorage.getItem('specialNew')) : '';
          if (!localNews || localNews.id !== specialNew.id) {
            const nowTime = moment().format('YYYY-MM-DD HH:mm:ss'); // 当前时间
            const createdAt = moment(specialNew.created_at).format('YYYY-MM-DD HH:mm:ss'); // 文章发表时间
            // 发布时间距离现在不超过24小时 - 展示
            if ((moment(nowTime) - moment(createdAt)) / 3600000 < 24) {
              this.specialNew = specialNew;
            }
          }
        }

        // 公告正常滚动
        this.noticeList = [];
        this.noticeList = response.data.articles;
        this.handleScroll();
      }).catch((error) => {
        if (error) {
          setTimeout(() => {
            this.handleGetZendeskNote();
          }, 500);
        }
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.timerout);
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

// bannner 样式
.banner{
  background: #FF6000;
  background-size: cover;
  height: 3.34rem;
  max-width: 100%;
  text-align: center;
  color: white;
  position: relative;

  .center{
    width: 4rem;
    height: 1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url("../../assets/img/index/logo.png") no-repeat center;
    background-size: 100% 100%;

    .logoIcon{
      font-size: .6rem;
      margin-bottom: .2rem;
    }

    .bannerTitle{
      position: absolute;
      left: -10%;
      bottom: -.45rem;
      width: 120%;
      color: rgba(255, 255, 255, .7);
      font-size: 0.28rem;
      font-weight: 300;
    }
  }

  .langu{
    margin: .17rem .25rem 0rem 0rem;
    z-index: 888;
  }
}

// notice 样式
.notice{
  background: #ffffff;
  height: 1.02rem;
  font-size: 0.25rem;
  line-height: 1.02rem;
  padding: 0rem .36rem;
  position: relative;
  margin-bottom: .12rem;
  display: flex;
  align-items: center;/*垂直居中*/
  // justify-content: center;/*水���居中*/

  .noticeIcon{
    font-size: 0.35rem;
    margin-right: .1rem;
  }

  .noticeTool{
    display: flex;
    align-items: center;/*垂直居中*/
    // height: .42rem;
  }

  .noticeItem{
    height: .42rem;
    width: 80%;
    // border: 1px solid black;
    line-height: .46rem;
    overflow: hidden;

    div{
      line-height: .46rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}


// content table 样式
.content{
  text-align: center;
  margin: .12rem 0rem;
  background: #fff;
  padding: .3rem 0rem;

  .data{
    padding: .3rem .1rem;
  }

  .contentTop{
    display: flex;
    font-size: .3rem;
    width: 50%;
    color: $color-999;

    .item{
      flex: 1;

      &:nth-child(1):after{
        content: '';
        border: 1px solid $color-e3e3e3;
        float: right;
        height: .27rem;
        margin-top: .05rem;
      }

       &.activeThis{
        color: $color-this;
      }
    }
  }

  .more{
    font-size: .24rem;
  }
}

// advantage优势 样式
.advantage{
  text-align: center;
  padding: .6rem .36rem .82rem .36rem;
  background: #fff;

  .topTitle{
    font-size: 0.42rem;
  }

  .item{
    font-size: .28rem;

    .itemTitle{
      font-size: .32rem;
      margin: .09rem 0rem;
    }

    .img{
      padding: 1.2rem 0rem .3rem 0rem;
      max-width: 100%;
    }

    &:nth-child(1) img{
      padding-top: .71rem;
    }
  }
}

// footer 样式
.footer{
  font-size: .21rem;
  text-align: center;
  padding: .35rem 0rem;
}

.page-index {
  // font-size: .42rem;
  background: #fafafa;
}
</style>
