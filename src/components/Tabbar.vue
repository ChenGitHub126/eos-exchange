<template>
  <div class="tabbar">
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 0}" @click="handleChangeTabbar(0)">
        <div class="iconfont icon-huaban43 img"></div>
        <div class="name">{{ $t('public.home') }}</div>
      </div>
    </div>
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 1}" @click="handleChangeTabbar(1)">
        <div class="iconfont icon-huaban5 img"></div>
        <div class="name">{{ $t('public.market') }}</div>
      </div>
    </div>
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 2}" @click="handleChangeTabbar(2)">
        <span class="point tabPoint" v-if="$store.state.app.unReadCount > 0"></span>
        <div class="iconfont icon-huaban6 img"></div>
        <div class="name">{{ $t('public.order') }}</div>
      </div>
    </div>
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 3}" @click="handleChangeTabbar(3)">
        <div class="iconfont icon-huaban7 img"></div>
        <div class="name">{{ $t('public.property') }}</div>
      </div>
    </div>
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 4}" @click="handleChangeTabbar(4)">
        <div class="iconfont icon-huaban8 img"></div>
        <div class="name">{{ $t('public.more') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0, // 选择 tabbar
      url: [ // 页面路由
        '/',
        '/market/',
        '/order/',
        '/property',
        '/more',
      ],
    };
  },
  props: [
  ],
  components: {
  },
  watch: {
    // 根据路由判断当前选中tabbar
    $route: function listen(newVal) {
      const path = newVal.path;
      this.active = this.url.findIndex(item => item === path);
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // tabbar 切换
    handleChangeTabbar(num) {
      this.active = num;
      this.$router.push(this.url[num]);
      // this.$router.push({
      //   name: this.url[num],
      // });
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.tabbar{
  height: 1rem;
  font-size: .21rem;
  display: flex;
  color: $color-999;

  .tabar-item{
    flex: 1;
    display: flex;
    align-items: center;/*垂���居中*/
    justify-content: center;/*水平居中*/
    position: relative;

    .content{
      // width: 1rem;
      text-align: center;
    }

    .tabPoint{
      position: absolute;
      right: .4rem;
    }
  }

  .img{
    width: .45rem;
    height: .45rem;
    font-size: .35rem;
    line-height: .45rem;
    display: inline-block;
  }
}
</style>
