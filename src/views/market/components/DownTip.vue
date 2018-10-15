<template>
  <div class="main">
    <div class="title">{{ $t('symbolStatus.tipDownTitle') }}</div>
    <div class="tip">{{ $t('symbolStatus.tipDown1') }}</div>
    <div class="tip">{{ $t('symbolStatus.tipDown2') }}{{ toLocalTime(statusInfo.closeTime) }}{{ $t('symbolStatus.tipDown3') }}</div>
    <div class="link">
      <a :href="statusInfo.noticeUrl" class="color-this">{{ $t('symbolStatus.tip') }}</a>
    </div>
    <div class="btnDiv">
      <button class="btn" @click="handleBack">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
    };
  },
  props: [
    'statusInfo',
  ],
  created() {
  },
  methods: {
    handleBack() {
      this.$emit('listenClose', false);
    },
    toLocalTime(time) {
      return toLocalTime(time);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.main{
  padding: .4rem .58rem;
  width: 6.2rem;
  font-size: .28rem;
  box-sizing: border-box;
  // text-align: center;

  .title{
    font-size: .36rem;
    text-align: center;
    color: $color-this;
    padding-bottom: .3rem;
  }

  .tip{
    padding-bottom: .3rem;
  }

  .link{
    font-size: .25rem;
    text-align: center;
    color: $color-this;
    margin-bottom: .3rem;
  }

  .btn{
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    font-size: .25rem;
    background: $color-this;
    color: #fff;
    border-radius: .12rem;
  }
}
</style>
