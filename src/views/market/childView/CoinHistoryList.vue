<template>
  <div class="order">
    <!-- <div class="topTools">
      <div class="back fl color-999" @click="handleBack">{{ $t('public.back') }}</div>
      <div>{{symbol}}{{ $t('quotation.oldList') }}</div>
      <div class="ok fr color-this"></div>
    </div> -->
    <history-list/>
  </div>
</template>

<script>
import HistoryList from '../components/HistoryList';

export default {
  data() {
    return {
      symbol: '',
    };
  },
  props: [
  ],
  components: {
    HistoryList,
  },
  watch: {
  },
  created() {
    const coin = this.$route.params.symbol.toUpperCase().split('_');
    this.symbol = `${coin[0]}/${coin[1]}`;
  },
  mounted() {
  },
  methods: {
    // 返回
    handleBack() {
      history.back();
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.order{
  background: #fafafa;
  height: 100%;
  font-size: .36rem;

  .topTools{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/
    text-align: center;
    height: 1.08rem;
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
}
</style>


// WEBPACK FOOTER //
// src/views/market/childView/CoinHistoryList.vue
