<template>
  <div class="market">
    <div class="tools">
      <div class="favorite">
        <span class="iconfont icon-huaban21 icon fl"
          :class="{'hidden': activeIndex !== 1}"
          @click="$router.push('/selfAreaSetting')"></span>
        <span class="color-999" :class="{'color-this': activeIndex === 1}" @click="handleChangeArea(1)">
          <span class="iconfont icon-huaban29 icon" :class="{'color-this':activeIndex === 1}"></span>
          {{ $t('quotation.self') }}
        </span>
      </div>
      <div class="area">
        <span class="color-999" :class="{'color-this': activeIndex === 2}" @click="handleChangeArea(2)">
          <span class="iconfont icon-huaban33 icon" :class="{'color-this': activeIndex === 2}"></span>
          EOS
        </span>
        <span class="iconfont icon-huaban20 icon fr" style="visibility: hidden;"></span>
      </div>
    </div>
    <div class="outTableDiv" v-if="activeIndex === 1">
      <table-list :activeIndex="activeIndex" @listenActiveIndex="handleActiveIndex"/>
    </div>
    <div class="outTableDiv" v-if="activeIndex === 2">
      <table-list :activeIndex="activeIndex"/>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/TableList';
// import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      activeIndex: 2, // 当前选中排行榜
    };
  },
  components: {
    TableList, // 列表
  },
  created() {
  },
  mounted() {
    if (this.$route.params.type) {
      this.activeIndex = 2;
    }
  },
  methods: {
    // 切换分区
    handleChangeArea(index) {
      this.activeIndex = index;
    },
    // 去添加交易对
    handleActiveIndex() {
      this.activeIndex = 2;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

.hidden{
  visibility: hidden;
}

.icon{
  font-size: .35rem;
}

.market{
  background: #fafafa;
  height: calc(100vh - 1rem);
  overflow: hidden;

  .tools{
    display: flex;
    align-items: center;/*垂直居中*/
    background: #ffffff;
    margin-bottom: .12rem;
    box-sizing: border-box;
    padding: 0px .36rem;

    &>div{
      flex: 1;
      font-size: .32rem;
      height: .9rem;
      line-height: .9rem;
      text-align: center;
      position: relative;
    }

    .favorite::after{
      content: '';
      border: 1px solid $color-e3e3e3;
      height: .25rem;
      line-height: 1.08rem;
      // float: right;
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translate(0px, -50%);
    }

    .icon{
      font-size: .32rem;
    }

  }

  .outTableDiv{
    // padding: 0rem .25rem;
    background: #ffffff;
  }
}
// footer 样式
.footer{
  font-size: .21rem;
  text-align: center;
  padding: .35rem 0rem;
}
</style>


// WEBPACK FOOTER //
// src/views/market/Index.vue
