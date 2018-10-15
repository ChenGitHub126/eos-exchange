<template>
  <div>
    <!-- 资产页账户信息 -->
    <div class="info" v-if="$route.name === 'property'">
      <div class="account">
        <div class="iconBg">
          <span class="iconfont icon-huaban22 icon"></span>
        </div>
        <div>
          {{ $store.state.app.accountInfo ? $store.state.app.accountInfo.account_name : '' }}
        </div>
      </div>

      <div class="totol property-tool">
        <span :class="{'totolCount': totalEosValuation !== '-.----'}">{{ totalEosValuation }}</span>
        <span class="eos">EOS
          <a class="shuaxin act" v-if="refresh">
            <div class="iconfont icon-huaban44 refresh"></div>
          </a>
        </span>
        <div class="totolTitle">{{ $t('public.allTotal') }}</div>
        <!-- 切换按钮 -->
        <!-- <span class="change fr" @click="handleShowChange" v-if="$store.state.app.channel === 'tokenpocket'">
          {{ $t('property.shortChange') }}
        </span> -->
      </div>
    </div>

    <!-- 首页账户信息 -->
    <div class="info-index" v-if="$route.name === 'index'">
      <div class="account">
        <div class="iconBg">
          <span class="iconfont icon-huaban22 icon"></span>
        </div>
        <div>
          {{ $store.state.app.accountInfo ? $store.state.app.accountInfo.account_name : '' }}
        </div>
      </div>

      <div class="totol">
        <span class="totolTitle">{{ $t('public.allTotal') }}</span>
        <span :class="{'totolCount': totalEosValuation !== '-.----'}">{{ totalEosValuation }}</span>
        <span class="eos">EOS
          <a class="shuaxin act" v-if="refresh">
            <div class="iconfont icon-huaban44 refresh refresh-index color-333"></div>
          </a>
        </span>
        <!-- <span class="change fr color-this" @click="handleShowChange"
          v-if="$store.state.app.channel === 'tokenpocket'">{{ $t('property.shortChange') }}</span> -->
      </div>
    </div>

    <!-- dialog account change -->
    <mt-popup
      class="accountChange"
      v-model="accountChange"
      popup-transition="popup-fade">
      <div class="changeList">
        <div class="title">{{ $t('property.change') }}</div>
        <div>
          <div class="item" v-for="(item, $index) in walletList" :key="$index" @click="handleChangeAccount(item)">
            {{ item.name }}
          </div>
        </div>
        <button class="btn" @click="handleCencel">{{ $t('public.cancel') }}</button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import DApp from '@/utils/moreWallet';
import { Toast } from 'mint-ui';
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
      accountChange: false,
      coinList: [],
      // coinDetail 资产详情
      coinDetail: {
        account: '',
        list: [],
      },

      totalEosValuation: '-.----', // 总估值
      refresh: true,

      // 账户列表
      walletList: [],
    };
  },
  props: [
  ],
  components: {
  },
  watch: {
    '$store.state.app.accountInfo': function listen() {
      // Toast(`获取到account：${this.$store.state.app.accountInfo.account_name}`)
      this.handleGetCoinBanlance();
    },
  },
  created() {
    this.handleGetCoinBanlance();
  },
  mounted() {
  },
  methods: {
    // 切换账户
    handleChangeAccount(item) {
      const data = {
        account_name: item.name,
        address: item.address,
      };
      // 判断是否切换账号
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.account_name !== data.account_name) {
        localStorage.removeItem('token');
      }
      this.$store.dispatch('setAccountInfo', data);
      this.accountChange = false;
    },
    handleShowChange() {
      this.accountChange = true;
      DApp.getWalletList((err, data) => {
        // this.accountChange = true;
        if (err) {
          return;
        }
        this.walletList = data;
        // alert(JSON.stringify(data))
      });
    },
    handleCencel() {
      this.accountChange = false;
    },
    // 获取币种余额
    handleGetCoinBanlance() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account_name,
        };
        this.$http.post('/accountCoin/getBalance', params).then((res) => {
          this.refresh = false;
          if (res.code !== 0) {
            Toast({
              message: res.msg,
              position: 'center',
              duration: 2000,
            });
            return;
          }
          this.totalEosValuation = toFixed(res.totalEosValuation, 4);
          this.coinList = res.accountCoinList;
          this.$store.dispatch('setCoinList', this.coinList);
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetCoinBanlance();
        }, 1000);
      }
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

@-webkit-keyframes rotating {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg); }
  100% {
    -webkit-transform: rotateZ(360deg);
    transform: rotateZ(360deg); } }

@keyframes rotating {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg); }
  100% {
    -webkit-transform: rotateZ(360deg);
    transform: rotateZ(360deg); } }

.shuaxin {
  color: #999;
  margin: 0;
  font-size: .32rem;
  z-index: 200;
  margin-left: .2rem;

  .refresh{
    display: inline-block;
    font-size: .25rem;
    color: white;
    animation: rotating .8s linear infinite;
  }
}

.info-index{
  background: #FFF;
  // height: 1.7rem;
  font-size: .32rem;
  padding: .3rem .36rem;
  box-sizing: border-box;

  .account{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    .iconBg{
      background: rgba(74,144,226,0.24);
      border-radius: 50%;
      width: .55rem;
      height: .55rem;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: center;/*水平居中*/
      margin-right: .15rem;

      .icon{
        font-size: .32rem;
        color: $color-this;
      }
    }
  }

  .totol{
    font-size: .42rem;
    height: .6rem;;
    margin-top: .1rem;
    line-height: .6rem;

    .totolTitle{
      font-size: .21rem;
      margin-top: .08rem;
    }

    .totolCount{
      font-weight: bold;
    }

    .eos,{
      font-size: .32rem;
    }

    .change{
      font-size: .25rem;
    }
  }

}

.info{
  background: linear-gradient(to right, rgba(68,92,241,0.96) , rgba(57,82,193,1));
  height: 3.1rem;
  max-width: 100%;
  // text-align: center;
  color: white;
  position: relative;
  box-shadow: 0px 0px .15rem $color-333;
  font-size: .32rem;
  padding: .7rem .36rem .8rem .36rem;
  box-sizing: border-box;

  .account{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    .iconBg{
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: .55rem;
      height: .55rem;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: center;/*水平居中*/
      margin-right: .15rem;

      .icon{
        font-size: .32rem;
      }
    }
  }

  .totolTitle{
    font-size: .25rem;
  }

  .totol{
    font-size: .42rem;
    height: .5rem;;
    margin-top: .2rem;
    line-height: .5rem;

    &.property-tool{
      padding-left: .7rem;
    }

    .totolCount{
      font-weight: bold;
    }

    .eos,{
      font-size: .32rem;
    }

    .change{
      font-size: .25rem;
    }
  }

}

.accountChange{
  border-radius: .15rem;

  .changeList{
    text-align: center;
    font-size: .42rem;
    width: 5.47rem;
    padding: .5rem .36rem;
    box-sizing: border-box;

    .title{
      height: .5rem;
      line-height: .5rem;
      font-size: .32rem;
      color: $color-this;
      margin-bottom: .2rem;
    }

    .item{
      height: 1.07rem;
      line-height: 1.07rem;
      border-bottom: 1px solid $color-e3e3e3;

      &:last-child{
        border-bottom: 1px solid transparent;
      }
    }

    .btn{
      font-size: .25rem;
      height: .68rem;
      line-height: .68rem;
      margin-top: .20rem;
      width: 2.34rem;
      color: white;
      background: $color-blue;
      border-radius: .12rem;
    }
  }
}
</style>
