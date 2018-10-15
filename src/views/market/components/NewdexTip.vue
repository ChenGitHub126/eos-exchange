<template>
  <div class="specialTip">
    <div class="title">{{ $t('quotation.tipNewdexTitle') }}</div>
    <div class="tip">{{ $t('quotation.tipNewdex') }}</div>
    <div class="title">
      <button class="btn" @click="handleBack">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack() {
      this.$emit('listenClose', false);
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
    margin: .3rem 0px;
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


// WEBPACK FOOTER //
// src/views/market/components/NewdexTip.vue
