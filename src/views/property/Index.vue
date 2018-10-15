<template>
  <div class="property">
    <mt-loadmore
    :topPullText="$t('public.loadingMoreTip1')"
    :topDropText="$t('public.loadingMoreTip2')"
    :topLoadingText="$t('public.loadingMoreTip3')"
    :bottomPullText="$t('public.loadingMoreTip1')"
    :bottomDropText="$t('public.loadingMoreTip2')"
    :bottomLoadingText="$t('public.loadingMoreTip3')"
    :top-method="loadTop"
    :auto-fill="false" ref="loadmore">
    <!-- topShow -->
    <Account ref="account" />

    <!-- detail -->
    <div class="detail">
      <div class="title">
        <span class="borderLeft"></span>
        <span>{{ $t('public.property') }}</span>
      </div>

      <!-- list -->
      <div class="list" v-for="(item, $index) in $store.state.app.coinList" :key="$index" @click="handleToTrad(item)">
        <div class="valuation tip">
          <div class="coin color-this">{{ item.code }}</div>
          <div class="about" :class="{'hidden': item.code === 'EOS'}">{{ $t('property.about') }}：{{ item.eosValuation }}EOS</div>
        </div>
        <div class="price">
          <div class="able">{{ $t('property.balance') }}：{{ item.usableCount }}</div>
          <div class="freeze tip">{{ $t('property.freeze') }}：{{ item.freezeCount }}</div>
        </div>
      </div>
    </div>
    </mt-loadmore>
  </div>
</template>

<script>
import Account from '@/components/Account';

export default {
  data() {
    return {
      list: [], // 资产列表
    };
  },
  props: [
  ],
  components: {
    Account,
  },
  watch: {
    '$store.state.app.coinList': function listen() {
      this.$refs.loadmore.onTopLoaded();
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 下拉刷新 - 账户资产刷新
    loadTop() {
      this.$refs.account.handleGetCoinBanlance();
    },
    handleToTrad(item) {
      if (item.code === 'EOS') {
        return;
      }
      this.$router.push({
        name: 'trade',
        params: {
          symbol: `${item.code}_EOS`,
        },
      });
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

.property{
  font-size: .3rem;
}

.detail{
  margin: .36rem .24rem;
  font-size: .32rem;
  background: #FFF;
  padding: .24rem .34rem 0 .34rem;
  border-radius: .12rem;
  box-shadow: 0px 0px .15rem #f0f0f0;

  .title{
    line-height: .5rem;
    display: flex;
    align-items: center;/*垂直居中*/

    .borderLeft{
      border-left: 2px solid $color-this;
      border-right: 2px solid $color-this;
      display: inline-block;
      height: .28rem;
      margin-right: .12rem;
    }
  }

  .list{
    display: flex;
    align-items: center;/*垂直居中*/
    height: 1.3rem;
    border-bottom: 1px solid $color-e3e3e3;
    font-size: .25rem;

    &:last-child{
      border-bottom: 1px solid transparent;
    }

    div{
      flex: 1;
      line-height: .45rem;

      .coin{
        font-size: .32rem;
      }
    }

    .hidden{
      visibility: hidden;
    }

    .tip{
      font-size: .25rem;
      color: $color-999;
    }
  }
}
</style>
