<template>
  <div :class="{'isIOS': isIOS,'symbolList': $route.name !== 'index'}">
    <div v-if="$route.name !== 'trade'">
      <!-- 排序条件 -->
      <div class="tools" v-if="$route.name !== 'index'">
        <div>{{ $t('public.symbol') }}</div>
        <div :class="{'color-this': dealCount !== 0}">
          <span @click="handleDealCount">
            24H{{ $t('public.dealCount') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': dealCount === 1}"></i>
                <i class="bottom" :class="{'bottomActive': dealCount === 2}"></i>
              </label>
            </span>
          </span>
        </div>
        <div :class="{'color-this': newPrice !== 0}">
          <span @click="handleNewPrice">
            24H{{ $t('public.newPrice') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': newPrice === 1}"></i>
                <i class="bottom" :class="{'bottomActive': newPrice === 2}"></i>
              </label>
            </span>
          </span>
        </div>
        <div :class="{'color-this': quoteChange !== 0}">
          <span @click="handleQuoteChange">
            24H{{ $t('public.quoteChange') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': quoteChange === 1}"></i>
                <i class="bottom" :class="{'bottomActive': quoteChange === 2}"></i>
              </label>
            </span>
          </span>
        </div>
      </div>
      <!-- 交易对列表数据 -->
      <div class="listData" :class="{'scroll': $route.name !== 'index'}">
        <div class="itemData" v-for="(item, index) in showData" :key="index" @click="handleToTrade(item)">
          <!-- 交易对信息 -->
          <div class="info">
            <div>
              <div class="coin">
                  {{ item.name.toUpperCase() }}
                <!--{{ item.symbol.split('_')[0].toUpperCase() }}/{{ item.symbol.split('_')[1].toUpperCase() }}-->
              </div>
              <div class="tip">
                24H{{ $t('public.dealCount') }}
                <span class="num">{{ item.amount > 1000000 ? parseInt(item.amount) : handleToFixed(item.amount, item.precision.coin) }}</span>
              </div>
            </div>
          </div>
          <!-- 价格 -->
          <div class="price">{{ handleToFixed(item.price, item.precision.price) }}</div>
          <!-- 涨跌幅 -->
          <div class="increase">
            <span class="riseAndFallSpan"
              :class="{'bgcolor-red': item.change < 0,'bgcolor-999':item.change === 0,'bgcolor-green':item.change > 0}">
              <span v-if="item.change > 0">+</span>{{ handleToFixed(item.change, 2) }}%
            </span>
          </div>
        </div>
        <div class="">
          <div class="loading" v-if="loading">
            <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
          </div>
          <div class="color-999 noData" v-if="showData.length === 0 && !loading && activeIndex !== 1">
            {{ $t('public.noData') }}
          </div>
          <div v-if="showData.length === 0 && !loading && activeIndex === 1">
            <!-- 自选为空时显示 -->
            <div class="noData selfNodata market" v-if="showData.length === 0 && !loading && activeIndex === 1">
              <div class="center">
                <img src="@/assets/img/order/search_keyword_ic.png" class="imgNodata">
                <div class="color-999">{{ $t('quotation.toAddFavoriteSymbol') }}</div>
                <button class="btn" @click="handleToAddSymbol">{{ $t('quotation.add') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易页面切换币种使用 -->
    <div v-if="$route.name === 'trade'" class="tradeTable">
      <div class="item"
        :class="{'active':symbol === item.symbol}"
        v-for="(item, index) in showData" :key="index" @click="handleToTrade(item)">
        <div class="symbolName">
          <!--{{ item.symbol.split('_')[0].toUpperCase() }}/{{ item.symbol.split('_')[1].toUpperCase() }}-->
          {{ item.name.toUpperCase() }}
        </div>
        <div class="symbolPrice">{{ handleToFixed(item.price, item.precision.price) }}</div>
        <div class="symbolChange"
          :class="{'color-red': item.change < 0,'color-999':item.change === 0,'color-green':item.change > 0}">
          <span v-if="item.change > 0">+</span>{{ handleToFixed(item.change, 2) }}%
        </div>
      </div>

      <!-- loading -->
      <div class="loading" v-if="loading">
        <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
      </div>

      <!-- noData -->
      <div class="noData" v-if="showData.length === 0 && !loading && activeIndex !== 1">
        {{ $t('public.noData') }}
      </div>

      <!-- 没有更多记录 -->
      <div class="noData" v-if="showData && showData.length">
        <div class="noTip color-999">{{ $t('public.noMore') }}</div>
      </div>

      <!-- 自选为空时显示 -->
      <div class="noData selfNodata" v-if="showData.length === 0 && !loading && activeIndex === 1">
        <div class="center">
          <img src="@/assets/img/order/search_keyword_ic.png" class="imgNodata">
          <div class="color-999">{{ $t('quotation.toAddFavoriteSymbol') }}</div>
          <button class="btn" @click="handleToAddSymbol">{{ $t('quotation.add') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixed } from '@/utils/public';
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      partition: [ // 分区(当前仅获取EOS交易对)
        'eos',
      ],
      allData: {}, // 所有数据
      showData: [], // 展示的数据 - 用于各个分区数据展示
      showDialog: false,

      // 排序 - 0： 不排序 | 1: 升序 | 2： 降序
      quoteChange: 0, // 涨跌幅
      newPrice: 0, // 最新价
      dealCount: 0, // 成交量

      // 收藏列表
      allFavoriteData: [],

      // loading
      loading: true,
      first: true, // 来源为是否为tabBar

      // 当前交易对
      symbol: '',
      isIOS: false,
    };
  },
  props: [
    'activeIndex',
  ],
  components: {
  },
  created() {
  },
  mounted() {
    this.symbol = this.$route.params.symbol;
    this.handleGetData();
    // 判断是否为ios
    const u = navigator.userAgent;
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  },
  watch: {
    activeIndex() {
      this.quoteChange = 0;
      this.newPrice = 0;
      this.dealCount = 0;
      this.showData = [];
      this.handleGetData();
    },
    '$route.params.symbol': function listen(newVal) {
      this.symbol = newVal;
    },
  },
  methods: {
    // 跳转到K线
    handleToLineK(item) {
      // this.showDialog = true;
      const params = {
        symbol: item.symbol,
      };
      this.$router.push({
        name: 'linek',
        params,
      });
    },
    // 跳转到交易
    handleToTrade(item) {
      this.$store.dispatch('setSymbolInfo', item); // 设置交易对信息
      this.$store.dispatch('setPrecision', item.precision); // 设置精度
      const params = {
        symbol: `${item.name2}_${item.name1}`,
      };
      this.$router.push({
        name: 'trade',
        params,
      });
      // 交易页面切换币种时，刷新页面
      if (this.$route.name === 'trade') {
        this.$emit('listenClose', false);
        // this.$router.go(0);
      }
    },
    // 自选区无数据点击去添加
    handleToAddSymbol() {
      this.$emit('listenActiveIndex', 2);
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    // ws监听
    handleGetData() {
      this.loading = true;
      this.partition.forEach((item) => {
          let modelData = [];
          let eosSymbolArr = [];
          this.$http.get('http://120.220.14.100:8581/exchangeApi/wallet/trade_symbol_new').then(res => {
              const data = res.data;
              const list = data.list;
              if (list) {
                  list.forEach((v, i, arr) => {
                      if (v.chain_symbol.toUpperCase() === 'QILINEOS') {
                          eosSymbolArr.push(v.symbol);
                          modelData.push({
                              asset_code1: v.asset_code1,
                              asset_code2: v.asset_code2,
                              symbol: v.symbol,
                              name: v.name,
                              precision: {
                                  coin: 4,
                                  price: 4
                              },
                          });
                      }
                  })
              }

              this.$http.get('http://120.220.14.100:8581/exchangeApi/wallet/geteoswalletasset')
                  .then(res => {
                      const data2 = res.data;
                      const list2 = data2.list;
                      list2.forEach((v, i, arr) => {
                          modelData.forEach((val, index, array) => {
                              if (v.symbol === val.asset_code1) {
                                  val.code1 = v.publish_account;
                                  val.name1 = v.display_symbol;
                              }
                              if (v.symbol === val.asset_code2) {
                                  val.code2 = v.publish_account;
                                  val.name2 = v.display_symbol;
                                  val.precision.coin = v.decimals
                              }
                          })
                      });
                      this.handleData(item, modelData);
              });

              this.$http.get('http://120.220.14.100:8581/exchangeApi/wallet/trade_quotations',{
                  params: {
                      symbol: eosSymbolArr.toString()
                  }
              }).then(res => {
                  const data1 = res.data;
                  const list1 = data1.list;
                  list1.forEach((v, i, arr) => {
                      modelData.forEach((val, index, array) => {
                          if (v.symbol === val.symbol) {
                              val.amount = v.quote_volume;
                              val.price = v.latest;
                              val.change = v.percent_change;
                              val.high = v.highest_bid;
                              val.low = v.lowest_ask;
                          }
                      })
                  });
                  this.handleData(item, modelData);
              });
          });
      });
    },
    handleData(item, modelData) {
        this.loading = false;
        this.allData[item] = modelData;
        // 自选 - 行情页
        if (this.activeIndex === 1 && this.$route.name !== 'index') {
            this.handleFavorite();
            return;
        }
        // 排序展示
        // (首页跳入 - type - 1: 涨幅榜 | 2: 交易量)
        if (this.$route.params.type && this.first) {
            this.first = false;
            if (this.$route.params.type === 1) {
                this.quoteChange = 2;
            } else {
                this.dealCount = 2;
            }
            this.handleSort(item, 2);
            return;
        }
        // (直接tabBar进入)
        this.handleSort(item);
        return;
    },
    // 排序 - 成交量
    handleDealCount() {
      let key = 'self';
      if (this.activeIndex - 2 >= 0) {
        key = this.partition[this.activeIndex - 2];
      }
      this.newPrice = 0;
      this.quoteChange = 0;
      if (this.dealCount === 0) {
        this.dealCount = 2; // 降序
      } else if (this.dealCount === 1) {
        this.dealCount = 0; // 不排序
      } else {
        this.dealCount = 1; // 升序
      }
      this.handleSort(key, this.dealCount);
    },
    // 排序 - 最新价
    handleNewPrice() {
      let key = 'self';
      if (this.activeIndex - 2 >= 0) {
        key = this.partition[this.activeIndex - 2];
      }
      this.dealCount = 0;
      this.quoteChange = 0;
      if (this.newPrice === 0) {
        this.newPrice = 2;
      } else if (this.newPrice === 1) {
        this.newPrice = 0;
      } else {
        this.newPrice = 1;
      }
      this.handleSort(key, this.newPrice);
    },
    // 排序 - 涨跌幅
    handleQuoteChange() {
      let key = 'self';
      if (this.activeIndex - 2 >= 0) {
        key = this.partition[this.activeIndex - 2];
      }
      this.newPrice = 0;
      this.dealCount = 0;
      if (this.quoteChange === 0) {
        this.quoteChange = 2;
      } else if (this.quoteChange === 1) {
        this.quoteChange = 0;
      } else {
        this.quoteChange = 1;
      }
      this.handleSort(key, this.quoteChange);
    },
    handleSort(key, type) {
      this.showData = [];
      const compare = function listenout(property) {
        return function listen(obj1, obj2) {
          const value1 = obj1[property];
          const value2 = obj2[property];
          if (type === 1) {
            return value1 - value2; // 升序
          }
          return value2 - value1; // 降序
        };
      };
      // 首页的排序
      if (this.activeIndex === 1 && this.$route.name === 'index') {
        let arr = JSON.stringify(this.allData[key]);
        arr = JSON.parse(arr);
        this.showData = arr.sort(compare('change')).slice(0, 5);
        return;
      }
      if (this.activeIndex === 2 && this.$route.name === 'index') {
        let arr = JSON.stringify(this.allData[key]);
        arr = JSON.parse(arr);
        this.showData = arr.sort(compare('amount')).slice(0, 5);
        return;
      }

      // 行情页的排序选择
      // type = 0 / null 时，不进行排序
      if (!type) {
        this.showData = this.allData[key];
        return;
      }
      // type !==0 时，1 - 生序 、 2 - 降序
      let arr = JSON.stringify(this.allData[key]); // 浅拷贝
      arr = JSON.parse(arr);
      if (this.dealCount) {
        this.showData = arr.sort(compare('amount'));
        return;
      }
      if (this.newPrice) {
        this.showData = arr.sort(compare('price'));
        return;
      }
      if (this.quoteChange) {
        this.showData = arr.sort(compare('change'));
        return;
      }
      this.showData = arr;
    },
    // 自选
    handleFavorite() {
      console.log('TableList.vue', '获取自选列表');
      this.loading = true;
      this.showData = [];
      // 异步获取自选交易对 - 进行匹配添加list
      setTimeout(() => {
          this.loading = false;
          this.allFavoriteData = this.$store.state.app.selfList;
          this.showData = [];
          // 循环收藏列表
          this.allFavoriteData.forEach((v, i, arr) => {
              // 循环 allData 列表
              for (const i in this.allData) { // eslint-disable-line
                  if (i !== 'self') {
                      this.allData[i].forEach((list) => {
                          if (v === list.name2) {
                              this.showData.push(list);
                          }
                      });
                  }
              }
          });
          const key = 'self';
          this.allData[key] = this.showData;
      }, 300);
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .scroll{
    height: calc(100vh - 3.3rem) !important;
    overflow-y: auto;
  }
}

.symbolList{
  // padding: 0px .25rem;
  height: calc(100vh - .9rem);
  overflow-y: hidden;

  &.isIOS{
    height: calc(100vh - 1.9rem);
  }
}

// 排序工具
.tools{
  padding: 0px .25rem;
  border-bottom: 1px solid $color-e3e3e3;
  height: .7rem;
  display: flex;
  align-items: center;/*垂直居中*/
  // justify-content: center;/*水平居中*/

  &>div{
    color: $color-999;
    flex: 1;
    font-size: .25rem;
    height: .7rem;
    display: flex;
    align-items: center;/*垂直居中*/
    font-weight: 300;

    &>span{
      line-height: .7rem;
    }

    &:nth-child(1){
      padding-left: .05rem;
    }

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4){
      justify-content: flex-end;
    }

    &:nth-child(3){
      min-width: 1.75rem;
    }

    &:nth-child(4){
      min-width: 2rem;
      padding-right: .05rem;
    }
  }
}

// 交易对列表
.listData{
  padding: 0px .25rem;
  font-size: .32rem;

  &.scroll{
    height: calc(100vh - 2.6rem);
    overflow-y: auto;
  }

  .itemData{
    height: 1.3rem;
    border-bottom: 1px solid $color-e3e3e3;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/

    &>div{
      flex: 1;
    }

    .info{
      padding-left: .05rem;
      flex: 2;
      text-align: left;
      display: flex;
      align-items: center;/*垂直居中*/
      // justify-content: center;/*水平居中*/

      .tip{
        margin-top: .05rem;
        font-size: .24rem;
        color: $color-999;
        font-weight: 300;
      }
    }

    .price{
      text-align: right;
      min-width: 1.75rem;
      max-width: 1.75rem;
      position: relative;
      flex: 2;
      margin: 0rem .1rem;
    }

    .increase{
      text-align: right;
      min-width: 2rem;
      position: relative;
      width: 1.55rem;

      /* 涨跌幅span标签 */
      .riseAndFallSpan{
        display: inline-block;
        border-radius: .12rem;
        box-sizing: border-box;
        line-height: .58rem;
        width: 1.55rem;
        max-width: 1.65rem;
        height: .55rem;
        font-size: .24rem;
        text-align: center;
        background-color: $color-green;
        color: white;
      }

      .bgcolor-999{
        background: #999;
      }
    }
  }
}

.loading{
  display: block;
  width: 45px;
  margin: auto;
  padding: .3rem 0rem;
}

.noData{
  height: .6rem;
  line-height: .6rem;
  font-size: .25rem;
  text-align: center !important;

  &.selfNodata{
    height: calc(100vh - .9rem);
    position: relative;

    .center{
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .imgNodata{
      width: 1.8rem;
      height: 1.8rem;
      padding-top: .30rem;
      padding-bottom: .1rem;
    }

    .btn{
      height: .8rem;
      line-height: .8rem;
      width: 3.8rem;
      background: $color-this;
      font-size: .32rem;
      color: #fFF;
      border-radius: .12rem;
      margin-top: .2rem;
    }
  }

  &.market{
    height: calc(100vh - 2.8rem);
  }
}

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}

.dialog{
  padding: .61rem 0rem;

  .tip{
    line-height: .45rem;
  }
}

.sortTip{
  width: .1rem;
  height: .7rem;
  display: flex;
  align-items: center;/*垂直居中*/
  // justify-content: center;/*水平居中*/


  .topActive{
    border-bottom: .07rem solid $color-this !important;
  }

  .bottomActive{
    border-top: .07rem solid $color-this !important;
  }

  .top{
    float: left;
    border: .07rem solid transparent;
    border-bottom: .07rem solid #999;
    margin: 0rem .05rem 0.015rem .05rem;
  }

  .bottom{
    float: left;
    border: .07rem solid transparent;
    border-top: .07rem solid #999;
    margin: .015rem .05rem 0.0rem .05rem;
  }
}

.tableData{
  font-size: .24rem;
  display: flex;

  .center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .info{
    text-align: left;
    flex: 3;
  }

  .price{
    position: relative;
    flex: 2;
    margin: 0rem .1rem;
  }

  .increase{
    position: relative;
    width: 1.55rem;
  }
}

.table{
  width: 100%;
  font-size: .32rem;
  color: $color-333;

  td:nth-child(2),
  td:nth-child(3),
  td:last-child{
    text-align: right;
  }

  td:last-child{
    padding-right: .05rem;
  }

  td:first-child{
    padding: 0rem 0rem 0rem .05rem;
  }

  thead{
    color: $color-999;
    font-weight: 300;
    font-size: .25rem;

    tr{
      height: .75rem;
      border-bottom: 1px solid $color-e3e3e3;

      &>td:nth-child(3){
        width: 1.75rem;
      }

      &>td:last-child{
        width: 2rem;
      }

      span{
        line-height: .75rem;
      }
    }

    .info{
      text-align: left;
      // height: .6rem;
      // padding: .17rem .14rem;
    }
  }

  tbody{
    tr{
      border-bottom: 1px solid $color-e3e3e3;
      width: 100%;
      height: 1.3rem;

      &:last-child{
        border-bottom: 0px;
      }
    }

    .info{
      text-align: left;
      display: flex;
      align-items: center;/*垂直居中*/
      // justify-content: center;/*水平居中*/

      .tip{
        margin-top: .05rem;
        font-size: .24rem;
        color: $color-999;
        font-weight: 300;
      }
    }

    .price{
      margin-right: .1rem;
    }

    /* 涨跌幅span标签 */
    .riseAndFallSpan{
      display: inline-block;
      border-radius: .12rem;
      box-sizing: border-box;
      line-height: .58rem;
      width: 1.55rem;
      max-width: 1.65rem;
      height: .55rem;
      font-size: .24rem;
      text-align: center;
      background-color: $color-green;
      color: white;
    }

    .bgcolor-999{
      background: #999;
    }
  }
}

// 交易页面切换币种样式
.tradeTable{
  width: 5.5rem;
  font-size: .28rem;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  .item{
    height: .8rem;
    padding: 0 .3rem;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    &.active{
      // box-shadow: 0px 0px 1px $color-this inset;
      border-top: 1px solid rgba(74,144,226,0.24);
      border-bottom: 1px solid rgba(74,144,226,0.24);
      background: rgba(74,144,226,0.11);
    }

    &>div{
      flex: 1;
    }

    .symbolName{
      // font-weight: bold;
      min-width: 2.1rem;
    }

    .symbolPrice{
      font-size: .25rem;
    }

    .symbolPrice,
    .symbolChange{
      text-align: right;
    }
  }
}

</style>
