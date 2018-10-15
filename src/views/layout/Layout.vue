<template>
  <div class="layout" :class="{'layout-market': $route.name === 'market'}">
    <!-- nav -->
    <div class="nav"
      v-if="$route.name !== 'index' && $route.name !== 'coinHistoryList' &&
        (($store.state.app.channel==='meetone' && isAndroid))">
      <head-nav />
    </div>
    <!-- 空div 占位 -->
    <div style="height: .9rem;"
      v-if="$route.name !== 'index' && $route.name !== 'coinHistoryList' &&
        (($store.state.app.channel==='meetone' && isAndroid))"></div>

    <!-- 主视图 -->
    <div class="layoutMainView">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <!-- <Tabbar/> -->
    <!--<Footer-->
      <!--:class="{'footerFlxed': $route.name === 'trade'}"-->
      <!--v-if="$route.name === 'index'"/>-->
  </div>
</template>

<script>
import Tabbar from '@/components/Tabbar';
// import Footer from '@/components/Footer';
import HeadNav from '@/components/HeadNav';
import { GetUrlPara } from '@/utils/public';

export default {
  name: 'layout',
  data() {
    return {
      isAndroid: false,
    };
  },
  created() {
    // alert(GetUrlPara().system_name === 'Android')
    this.isAndroid = GetUrlPara().system_name === 'Android';
  },
  components: {
    Tabbar,
    // Footer,
    HeadNav,
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .layout-market{
    height: calc(100vh - .6rem);
    overflow: hidden;
  }
}

.nav{
  position: fixed;
  width: 100%;
  max-width: 750px;
  z-index: 1000;
}

.layout{
  height: 100%;
  // border: 1px solid black;

  // .layoutMainView{
  //   height: 100%;
  // }
}

</style>
