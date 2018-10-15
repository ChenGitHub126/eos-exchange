<template>
  <div class="serverStop">
    <div class="title">{{ $t('serverStop.title') }}</div>
    <div class="tipDiv">
      <div>{{ $t('serverStop.msg1') }}</div>
      <div>{{ $t('serverStop.msg2') }}</div>
      <div>{{ $t('serverStop.msg3') }}</div>
    </div>
    <div>
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
@import "../assets/css/public.scss";

.serverStop{
  font-size: .3rem;
  width: 6.5rem;
  box-sizing: border-box;
  padding: .2rem .3rem;

  .title{
    text-align: center;
    line-height: .5rem;
  }

  .tipDiv{
    font-size: .25rem;

    &>div{
      margin-top: .2rem;
    }

    &>div:last-child{
      margin-bottom: .25rem;
    }
  }

  .btn{
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: $color-this;
    border-radius: .1rem;
    font-size: .25rem;
    // margin-bottom: .5rem;
  }
}
</style>


// WEBPACK FOOTER //
// src/components/ServerStop.vue
