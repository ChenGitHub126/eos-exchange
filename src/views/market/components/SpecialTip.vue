<template>
  <div class="specialTip">
    <div class="title">{{ $t('quotation.iqTipTitle') }}</div>
    <div class="tip">{{ $t('quotation.iqTip1') }}</div>
    <div class="tip">{{ $t('quotation.iqTip2') }}</div>
    <div class="tip">{{ $t('quotation.iqTip3') }}</div>
    <div class="title">
      <button class="btn" @click="handleBack">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack() {
      this.$emit('listenBack', false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .5rem;
  width: 6rem;
  border-radius: .3rem;

  .title{
    text-align: center;
    color: $color-this;
  }

  .tip{
    font-size: .28rem;
    margin: .3rem;
  }

  .btn{
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: $color-this;
    border-radius: .1rem;
    font-size: .25rem;
  }
}
</style>
