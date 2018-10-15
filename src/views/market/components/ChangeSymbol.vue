<template>
  <div class="changeSymbol">
    <div class="area">
      <div class="color-999" :class="{'color-this': activeIndex === 1}" @click="activeIndex = 1">
        <span class="iconfont icon-huaban29 icon" :class="{'color-this':activeIndex === 1}"></span>
        <span>{{ $t('quotation.self') }}</span>
      </div>
      <div  class="color-999" :class="{'color-this': activeIndex === 2}" @click="activeIndex = 2">
        <span class="iconfont icon-huaban33 icon" :class="{'color-this': activeIndex === 2}"></span>
        <span :class="{'fs': $store.state.app.language !== 'en'}">EOS</span>
      </div>
    </div>

    <div class="showDiv" :class="{'iosVh': isIOS}">
      <div class="outTableDiv" v-if="activeIndex === 1">
        <table-list @listenClose="listenClose" :activeIndex="activeIndex" @listenActiveIndex="handleActiveIndex"/>
      </div>
      <div class="outTableDiv" v-if="activeIndex === 2">
        <table-list @listenClose="listenClose" :activeIndex="activeIndex" @listenActiveIndex="handleActiveIndex"/>
      </div>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/TableList';

export default {
  data() {
    return {
      activeIndex: 2,
      isIOS: false,
    };
  },
  components: {
    TableList,
  },
  watch: {
  },
  created() {
  },
  mounted() {
    // 判断是否为ios
    const u = navigator.userAgent;
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  },
  methods: {
    listenClose() {
      this.$emit('listenClose', false);
    },
    handleActiveIndex() {
      this.activeIndex = 2;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .changeSymbol{
    height: calc(100vh - .6rem) !important;
  }
}

.fs{
  font-size: .32rem !important;
}

.changeSymbol{
  height: 100vh;
  // overflow: auto;

  .showDiv{
    height: calc(100% - .9rem);
    overflow-y: auto;
  }

  .iosVh{
    height: calc(100% - 1.9rem);
  }

  .area{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/
    height: .9rem;
    font-size: .3rem;
    box-shadow: -5px 0px 5px #efefef;

    &>div{
      max-width: 2rem;
      margin-right: .3rem;
      height: .5rem;;
      display: flex;
      align-items: center;/*���直居中*/

      &:nth-child(1){
        margin-left: .3rem;
      }
    }

    .icon{
      font-size: .3rem;
      padding-right: .05rem;
    }
  }
}
</style>
