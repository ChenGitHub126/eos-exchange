<template>
  <div class="specialTip">
    <div class="title">{{ $t('quotation.tipNewdexTitle') }}</div>
    <div class="tip">{{ $t('footer.tip') }}</div>
    <div class="tip">{{ $t('quotation.agreeTip') }}</div>
    <div class="checkDiv">
      <mt-checklist
        class="checkbox"
        v-model="flag"
        :options="[ $t('quotation.agree') ]">
      </mt-checklist>
      <a class="color-this agreement" :href="hrefgo">{{ $t('quotation.agreement') }}</a>
    </div>
    <div class="title">
      <button class="btn disabled" v-if="flag.length === 0" disabled>{{ $t('public.sure') }}</button>
      <button class="btn" v-if="flag.length !== 0" @click="handleBack">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: [],
      hrefgo: 'https://support.newdex.io/hc/en-us/articles/360012588791-User-Agreement',
    };
  },
  watch: {
    '$store.state.app.language': function change(val) {
      this.handleFormatLang(val);
    },
  },
  mounted() {
    this.handleFormatLang(this.$store.state.app.language);
  },
  methods: {
    handleBack() {
      sessionStorage.setItem('accountAgree', true);
      this.$emit('listenClose', false);
      const params = {
        account: this.$store.state.app.accountInfo.account_name,
        status: 1,
      };
      this.$http.post('/account/saveAgreementStatus', params).then((res) => {
        if (res.code !== 0) {
          this.$message.error(res.msg);
        }
      });
    },
    handleFormatLang(val) {
      this.hrefgo = 'https://support.newdex.io/hc/en-us/articles/360012588791-User-Agreement';
      if (val === 'zh-TW') {
        this.hrefgo = 'https://support.newdex.io/hc/zh-tw/articles/360012588791-%E4%BD%BF%E7%94%A8%E5%8D%94%E8%AD%B0-';
      }
      if (val === 'zh-CN') {
        this.hrefgo = 'https://support.newdex.io/hc/zh-cn/articles/360012588791-%E4%BD%BF%E7%94%A8%E5%8D%8F%E8%AE%AE';
      }
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

  .checkDiv{
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    font-size: .25rem;
    margin-bottom: .2rem;

    .agreement{
      height: .48rem;
      display: flex;
      align-items: center;/*垂直居中*/
    }
  }

  .checkbox{
    text-align: right;

    /deep/ .mint-checklist{
      border-top: 0px;
      background-image: none;
    }

    /deep/ .mint-checklist-title{
      margin: 0px;
    }

    /deep/ .mint-cell{
      background-image: none;

      .mint-checkbox-core{
        width: 16px;
        height: 16px;
      }
      .mint-checkbox-core::after{
        display: flex;
        align-items: center;/*垂直居中*/
        // justify-content: center;/*水平居中*/
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg) scale(1)
      }

      .mint-cell-wrapper{
        background-image: none;
        display: flex;
        align-items: center;/*垂直居中*/
        height: .48rem;
        margin-right: 0px;
        padding-right: 0px;

        .mint-checklist-label{
          display: flex;
          align-items: center;/*垂直居中*/
          height: .48rem;
          padding-right: 0px;

          .mint-checkbox-label{
            font-size: .25rem;
          }
        }
      }
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
  }

  .disabled{
    background: #ccc;
  }
}
</style>
