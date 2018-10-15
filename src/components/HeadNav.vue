<template>
  <div class="topNav" >
    <span class="iconfont icon-huaban25 back" @click="handleBack"></span>
    <span class="pageName">{{ $t('public.navNewdex') }}</span>
    <!-- <span class="pageName">{{ routeTitle }}</span> -->
    <span class="language">
      <!-- <language/> -->
    </span>
  </div>
</template>

<script>
import Language from '@/components/Language';

export default {
  data() {
    return {
      routeTitle: '',
    };
  },
  props: [
  ],
  created() {
    // 改变标题
    // this.routeTitle = this.$t(`rout.${this.$route.meta.title}`);
    // document.title = this.$t(`rout.${this.$route.meta.title}`);
  },
  mounted() {
  },
  components: {
    Language, // 语言
  },
  methods: {
    handleBack() {
      history.back();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.topNav{
  background: $color-nav;
  color: $color-navWhite;
  display: flex;
  font-size: .36rem;
  height: .9rem;
  line-height: .9rem;
  text-align: center;

  &>span{
    flex: 1;
    font-size: .36rem;

    &:nth-child(2){
      flex: 10;
    }
  }

  .language{
    display:flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    width:100%;
    height:100%;
    margin-right: .25rem;

    /deep/ .btnDiv{
      border: 0px;

      .languageIcon{
        font-size: .5rem;
      }
    }
  }
}
</style>
