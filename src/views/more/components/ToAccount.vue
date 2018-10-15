<template>
  <div class="account">
    <div class="title">Newdex.io{{ $t('more.toAccount') }}</div>
    <div class="input">
      <span class="accountName fl">{{ $store.state.app.toAccount }}</span>
      <span class="tip">EOS{{ $t('more.main') }}</span>
    </div>
    <div class="what color-999">
      <div class="whatTitle" @click="show = !show">
        <span class="color-this">{{ $t('more.what') }}</span>
      </div>
      <div class="content color-333" v-if="show">
        {{ $t('more.content1') }}
        {{ $t('more.content2') }}
        {{ $t('more.content3') }}
        {{ $t('more.content4') }}
        <p><a class="color-this" href="https://eosflare.io/account/newdexiocold">newdexiocold</a></p>
      </div>
    </div>
    <div class="btnDiv">
      <button class="btn" @click="handleSearchAction">{{ $t('public.detail') }}</button>
      <button class="btn close" @click="handleClose">{{ $t('public.close') }}</button>
    </div>
    <a href="https://eosflare.io/account/newdexpocket" ref="lotion"></a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exchangeEosAccount: '', // 账户
      show: false,
    };
  },
  props: [
    'showAccount',
  ],
  created() {
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('listenCloseAccount', false);
    },
    // 查看详情
    handleSearchAction() {
      window.location.href = 'https://eosflare.io/account/newdexpocket';
      // this.$refs.lotion.click();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.account{
  font-size: .32rem;
  width: 6.42rem;
  // height: 3.03rem;
  border-radius: .12rem;
  text-align: center;
  padding: .32rem;
  box-sizing: border-box;

  .title{
    color: $color-this;
    margin-bottom: .32rem;
  }

  .input{
    border: 1px solid $color-e3e3e3;
    height: .73rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    padding: 0px .17rem;
    border-radius: .05rem;

    .accountName{
      flex: 1;
      text-align: left;
    }

    .tip{
      font-size: .3rem;
      flex: 1;
      text-align: right;
      color: $color-999;
    }
  }

  .what{
    text-align: left;
    font-size: .28rem;
    padding: 0px .17rem;

    .whatTitle{
      display: flex;
      align-items: center;/*垂直居中*/
      height: .8rem;

      .icon{
        margin-left: .1rem;
        font-size: .14rem;
      }
    }

    .content{
      margin-bottom: .3rem;
    }
  }

  .btnDiv{
    margin-top: .2rem;
    display: flex;

    .btn{
      flex: 1;
      height: .68rem;
      line-height: .68rem;
      border-radius: .12rem;
      font-size: .25rem;
      color: white;
      background: $color-blue;
    }

    .close{
      margin-left: .1rem;
      background: $color-999;
    }
  }
}
</style>
