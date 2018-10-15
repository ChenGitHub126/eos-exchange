<template>
  <div class="orderDetail">
    <div class="title">
      <span class="back color-999" @click="handleBack">{{ $t('public.back') }}</span>
      <span v-if="$store.state.app.detail.direction === 1">
        {{$store.state.app.detail.symbol1}}/{{$store.state.app.detail.symbol2}}{{ $t('order.buyDetail') }}</span>
      <span v-if="$store.state.app.detail.direction === 2">
        {{$store.state.app.detail.symbol1}}/{{$store.state.app.detail.symbol2}}{{ $t('order.sellDetail') }}</span>
    </div>

    <div>
      <ThisOrderDetail/>
    </div>
  </div>
</template>

<script>
import ThisOrderDetail from '@/components/ThisOrderDetail';

export default {
  data() {
    return {
    };
  },
  props: [
  ],
  components: {
    ThisOrderDetail,
  },
  watch: {
  },
  created() {
  },
  mounted() {
    // console.log(this.$store.state.app.detail);
  },
  methods: {
    // goto 交易明细
    handleGoToDetail() {
      this.$router.push('/orderDetail');
    },
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

.orderDetail{
  background: #fafafa;

  .title{
    position: relative;
    font-size: .36rem;
    background: #fff;
    line-height: .9rem;
    height: .9rem;
    box-sizing: border-box;
    padding: 0px .3rem;
    text-align: center;
    margin-bottom: .12rem;

    .back{
      position: absolute;
      left: .3rem;
      font-size: .32rem;
      font-weight: normal;
    }
  }
}

</style>
