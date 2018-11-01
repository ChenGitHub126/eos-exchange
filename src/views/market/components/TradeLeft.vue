<template>
  <div class="tradeLeft">
    <!-- 买入卖出切换 -->
    <div class="typeBtn">
      <!-- 买入 -->
      <span class="buy btn" @click="handleSellOrBuy('buy')"
        :class="{'active': activeType === 'buy'}">{{ $t('public.buy') }}</span>

      <!-- 卖出 -->
      <span class="sell btn"
        :class="{'activeSell': activeType === 'sell'}"
         @click="handleSellOrBuy('sell')">{{ $t('public.sell') }}</span>
    </div>

    <!-- 限价 / 市价 -->
    <div class="priceType">
      <!-- select - 买入 / 卖出 -->
      <div class="selectDiv">
        <span class="borderTop"></span>
        <select class="select" v-model="priceType">
          <option value="0">{{ $t('quotation.limit') }}</option>
          <!--<option value="1">{{ $t('quotation.market') }}</option>-->
        </select>
      </div>

      <!-- 价格 & 数量 & range -->
      <!-- 限价交易 -->
      <div class="priceDiv mb60" v-if="priceType === '0'">
        <span class="tool item" @click="handleDecrease">
          <i class="color-red" style="font-size: .27rem;">—</i>
        </span>
        <input type="number" class="input item" v-model="thisPrice" @blur="handleThisPriceBlur">
        <span class="tool item" @click="handleAdd">
          <i class="iconfont icon-huaban26 color-green" style="font-size: .27rem;"></i>
        </span>
      </div>
      <!-- 市价交易 -->
      <div class="priceDiv mb60" v-if="priceType === '1'">
        <input type="number" class="input item marketInput" disabled :placeholder="$t('quotation.tip')">
      </div>

      <!-- 限价输入数量 -->
      <div class="numberDiv" v-if="priceType === '0'">
        <input type="number" class="input" :class="{'iptBorder': flag}" v-model="num" @blur="handleNumBlur" @focus="handleFocus">
        <span class="tip">{{ symbol1 }}</span>
        <div class="about">
          <span class="color-red fl" :class="{'hidden': !flag}">>{{minSellEos}} EOS</span>
          ≈{{ aboutPrice }}{{ symbol2 }}
        </div>
      </div>

      <!-- 市价交易输入转账金额 -->
      <div class="numberDiv" v-if="priceType === '1'">
        <input type="number" class="input" :class="{'iptBorder': flag}" v-model="price" @blur="handlePriceBlur" @focus="handleMarketFocus">
        <span class="tip" v-if="activeType === 'buy'">{{ symbol2 }}</span>
        <span class="tip" v-if="activeType === 'sell'">{{ symbol1 }}</span>
        <div class="about" :class="{'hidden': !flag}">
          <span class="color-red fl" v-if="activeType === 'buy'">>{{minSellEos}} EOS</span>
          <span class="color-red fl" v-if="activeType === 'sell'">>{{ sellCount }} {{symbol1}}</span>
        </div>
      </div>

      <div class="range" :class="{'sellRange': activeType === 'sell'}"
        @touchend="handleTouchEnd"
        @touchstart="handleTouchStart">
        <div class="desc">
          <span>
            <span class="before" @click="handleRangeSet(0)" :class="{'border-green': rangeValue >= 0}"></span>
          </span>
          <span>
            <span class="before" @click="handleRangeSet(25)" :class="{'border-green': rangeValue >= 25}"></span>
          </span>
          <span>
            <span class="before" @click="handleRangeSet(50)" :class="{'border-green': rangeValue >= 50}"></span>
          </span>
          <span>
            <span class="before" @click="handleRangeSet(75)" :class="{'border-green': rangeValue >= 75}"></span>
            <span class="last" @click.stop="handleRangeSet(100)" :class="{'border-green': rangeValue >= 100}"></span>
          </span>
        </div>
        <mt-range
          v-model="rangeValue"
          :min="0"
          :max="100"
          :step="1"
          :bar-height="5">
        </mt-range>
        <div class="ableDiv">
          <span class="able" v-if="activeType === 'sell'">{{ $t('quotation.abled') }}{{ symbol1}}：{{ toFixed(balanceSymbol1, precision.coin) }}</span>
          <span class="able" v-if="activeType === 'buy'">{{ $t('quotation.abled') }}{{ symbol2 }}：{{ toFixed(balanceSymbol2, 4) }}</span>
          <span class="precents">{{rangeValue}}%</span>
        </div>
      </div>

      <!-- iq 特别提示 -->
      <!-- <div class="special" v-if="symbol1 === 'IQ'" @click="showSpecial = true">
        <span class="iconfont icon-huaban31 specialIcon"></span>
        <span>{{ $t('quotation.iqTip') }}</span>
      </div> -->
      <!-- Lucky 特别提示 -->
      <div class="special" v-if="symbol1 === 'LUCKY'" @click="showSpecial = true">
        <span class="iconfont icon-huaban31 specialIcon"></span>
        <span>{{ $t('quotation.luckyTip') }}</span>
      </div>

      <!-- btn - 正常交易 -->
      <div class="btnDiv m40" v-if="statusInfo.status === 0">
        <button class="btn buy" v-if="activeType === 'buy'" @click="handleCheckServerStop">
            {{ $t('public.buy') }}
        </button>
        <button class="btn sell bgcolor-red" v-if="activeType === 'sell'" @click="handleCheckServerStop">{{ $t('public.sell') }}</button>
      </div>
      <!-- btn -->
      <div class="btnDiv m40" v-if="statusInfo.status !== 0">
          <!-- btn - 暂停交易 / 即将下架 / 已下架 -->
        <button class="btn btnFlex" v-if="statusInfo.status === 1" @click="stop = true">
          <span class="iconfont icon-huaban32 warn"></span>
          <span>{{ $t('quotation.stop')}}</span>
        </button>
        <button class="btn btnFlex" v-if="statusInfo.status === 2" @click="down = true">
          <span class="iconfont icon-huaban32 warn"></span>
          <span>{{ $t('quotation.down')}}</span>
        </button>
        <button class="btn btnFlex" v-if="statusInfo.status === 3" @click="oldDown = true">
          <span class="iconfont icon-huaban32 warn"></span>
          <span>{{ $t('quotation.oldDown') }}</span>
        </button>
        <!-- <button class="btn btnFlex" v-if="statusInfo.status === 4">
          <span class="iconfont icon-huaban32 warn"></span>
          <span>即将上架</span>
        </button> -->
      </div>
    </div>

    <!-- 特殊币种提示 - IQ -->
    <mt-popup
      v-if="symbol1 === 'IQ'"
      v-model="showSpecial"
      class="specialTip"
      popup-transition="popup-fade">
      <special-tip v-if="showSpecial && symbol1 === 'IQ'" @listenBack="handleBack"/>
    </mt-popup>
    <!-- 特殊币种提示 - LUCKY -->
    <mt-popup
      v-if="symbol1 === 'LUCKY'"
      v-model="showSpecial"
      class="specialTip"
      popup-transition="popup-fade">
      <special-tip-lucky v-if="showSpecial && symbol1 === 'LUCKY'" @listenBack="handleBack"/>
    </mt-popup>

    <!-- 暂停交易 -->
    <mt-popup
      v-model="stop"
      class="specialTip"
      popup-transition="popup-fade">
      <stop-tip :statusInfo="statusInfo" v-if="stop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 停止交易 -->
    <mt-popup
      v-model="down"
      class="specialTip"
      popup-transition="popup-fade">
      <down-tip :statusInfo="statusInfo" v-if="down" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 已下架 -->
    <mt-popup
      v-model="oldDown"
      class="specialTip"
      popup-transition="popup-fade">
      <old-down-tip :statusInfo="statusInfo" v-if="oldDown" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 服务维护���停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="specialTip"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 使用协议 -->
    <mt-popup
      v-model="accountAgree"
      class="specialTip"
      popup-transition="popup-fade">
      <account-agree v-if="accountAgree" @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import StopTip from '@/views/market/components/StopTip';
import DownTip from '@/views/market/components/DownTip';
import AccountAgree from '@/views/market/components/AccountAgree';
import OldDownTip from '@/views/market/components/OldDownTip';
import ServerStop from '@/components/ServerStop';

import { toFixed, uuid, randomNum } from '@/utils/public';
import { Decimal } from 'decimal.js';
import { Toast, Indicator } from 'mint-ui';
import DApp from '@/utils/moreWallet';
import SpecialTip from './SpecialTip';
import SpecialTipLucky from './SpecialTipLucky';

export default {
  data() {
    return {
      symbol: '', // 交易对
      symbol1: '',
      symbol2: '',

      activeType: 'buy', // 选择买卖类型
      priceType: '0', // 0:限价 / 1:市价
      rangeValue: 0, // range
      num: '0.0000', // num
      thisPrice: '0.0000', // 买入 / 卖出 价格
      aboutPrice: '0.0000', // 大约价格 - 限价交易时显示

      price: '0.0000', // 市价交易转账金额
      balanceSymbol1: '0.0000', // 交易对 ‘/’ 前币种余额 - 卖出时显示
      balanceSymbol2: '0.0000', // 交易对 ‘/’ 后币种余额 - 买入时显示

      // 定时器
      timer: null,

      // 焦点
      numFocus: false,
      priceFocus: false,
      rangeFocus: false,
      flag: false,
      minSellEos: '0.100',
      sellCount: '0.100',

      showSpecial: false,
      stop: false, // 暂停交易
      down: false, // 停止交易
      oldDown: false, // 已下架
      serverStop: false, // 服务器维护

      iqFirst: true, // 第一次iq全部卖出
      accountAgree: false, // 用户同意使用协议
    };
  },
  props: [
    'symbolInfo', // 交易对信息
    'precision', // 精度
    'newPrice', // 最新价
    'priceDefault', // 买 / 卖盘价格
    'statusInfo', // 上架信息
  ],
  components: {
    SpecialTip,
    StopTip,
    DownTip,
    OldDownTip,
    ServerStop,
    AccountAgree,
    SpecialTipLucky,
  },
  watch: {
    // 数量不小于 0
    num(newVal) {
      if (Number(newVal) < 0) {
        this.num = toFixed(0, this.precision.coin);
      }
    },
    // 限价不小于 0
    thisPrice(newVal) {
      if (Number(newVal) < 0) {
        this.thisPrice = toFixed(0, this.precision.price);
      }
    },
    // 精度
    precision(newVal) {
      this.num = toFixed(this.num, newVal.coin);
      this.thisPrice = toFixed(this.thisPrice, newVal.price);
    },
    // 限价 / 市价切换
    priceType(newVal) {
      this.price = '0.0000';
      if (newVal === '1' && this.activeType === 'sell') {
        this.price = toFixed(0, this.precision.coin);
      }
      this.rangeValue = 0;
      this.num = toFixed(0, this.precision.coin);
      this.flag = false;
      this.aboutPrice = '0.0000';
      this.handlePriceDefault();
    },
    rangeValue() {
      // 是否滑动range
      if (!this.rangeFocus) {
        return;
      }
      // 限价
      if (this.priceType === '0') {
        /* ---------- 限价 - 买入 ------------ */
        if (this.activeType === 'buy') {
          if (Number(this.thisPrice) < 0) {
            return;
          }
          // 判断价格 - 为 0 时返回
          if (!Number(this.thisPrice)) {
            return;
          }
          // 计算数量
          let aboutPrice = Decimal.mul(this.rangeValue, this.balanceSymbol2);
          aboutPrice = Decimal.div(aboutPrice, 100).toString();
          if (aboutPrice < 0.0001) {
            aboutPrice = '0.0000';
          }
          this.aboutPrice = toFixed(aboutPrice, 4);
          const num = Decimal.div(aboutPrice, this.thisPrice).toString();
          this.num = toFixed(num, this.precision.coin);
          return;
        }
        /* ---------- 限价 - 卖出 ------------ */
        // 计算数量
        let num = Decimal.mul(this.rangeValue, this.balanceSymbol1);
        num = Decimal.div(num, 100).toString();
        this.num = toFixed(num, this.precision.coin);
        if (!Number(this.thisPrice)) {
          return;
        }
        let aboutPrice = Decimal.mul(this.thisPrice, this.num);
        if (aboutPrice < 0.0001) {
          aboutPrice = '0.0000';
        }
        this.aboutPrice = toFixed(aboutPrice, 4);
        return;
      }
      /* ---------- 市价 - 买入 ------------ */
      if (this.activeType === 'buy') {
        let price = Decimal.mul(this.rangeValue, this.balanceSymbol2);
        price = Decimal.div(price, 100).toString();
        this.price = toFixed(price, 4);
        return;
      }
      let price = Decimal.mul(this.rangeValue, this.balanceSymbol1);
      price = Decimal.div(price, 100).toString();
      this.price = toFixed(price, 4);
    },
    '$store.state.app.trad': function listen() {
      this.handleGetSymbil();
    },
    priceDefault() {
      this.handlePriceDefault();
    },
    '$store.state.app.clickPrice': function listen(newVal) {
      this.thisPrice = newVal;
      this.handleThisPriceBlur();
    },
    '$route.params.symbol': function listen() {
      this.handleMouted();
    },
  },
  created() {
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    // vue挂载时执行
    handleMouted() {
      this.iqFirst = localStorage.getItem('iqFirst') ? JSON.parse(localStorage.getItem('iqFirst')) : true;
      this.num = toFixed(this.num, this.precision.coin);
      this.thisPrice = toFixed(this.thisPrice, this.precision.price);

      this.handlePriceDefault();
      this.symbol = this.$route.params.symbol.toUpperCase();
      this.$nextTick(() => {
        this.symbol1 = this.$store.state.app.trad.symbol1;
        this.symbol2 = this.$store.state.app.trad.symbol2;
      });
      this.handleGetSymbil();
    },
    // 限价数量获取焦点变成浮点型数字
    handleFocus() {
      const tNum = parseFloat(this.num);
      if (tNum === 0) {
        this.num = '';
        return;
      }
      this.num = tNum;
    },
    // 市价获取焦点变成浮点型数字
    handleMarketFocus() {
      const tNum = parseFloat(this.price);
      if (tNum === 0) {
        this.price = '';
        return;
      }
      this.price = tNum;
    },
    // 关闭 暂停交易 / 停止交易
    handleClose() {
      this.stop = false;
      this.down = false;
      this.oldDown = false;
      this.serverStop = false;
      this.accountAgree = false;
    },
    // 关闭提示
    handleBack(data) {
      this.showSpecial = data;
    },
    // 买卖盘价
    handlePriceDefault() {
      if (this.activeType === 'buy') {
        this.thisPrice = toFixed(this.priceDefault.buy, this.precision.price);
        return;
      }
      this.thisPrice = toFixed(this.priceDefault.sell, this.precision.price);
    },
    // 获取交易对余额
    handleGetSymbil(next) {
      console.log('TradeLeft.vue', '获取交易对余额');
      const params = {
        code: this.$store.state.app.trad.symbol1_code,
        coin: this.$store.state.app.trad.symbol2,
      };
      if (next === 'next') {
        params.code = this.$store.state.app.trad.symbol2_code;
        params.coin = this.$store.state.app.trad.symbol1;
      }
      DApp.getCurrencyBalance(params, (err, data) => {
        if (err) {
          // 没有该币种 - 显示0
          if (next === 'next') {
            this.balanceSymbol1 = toFixed(0, this.precision.coin);
            return;
          }
          this.balanceSymbol2 = '0.0000'; // EOS 默认4位小数
          this.handleGetSymbil('next');
          return;
        }
        // 查询到余额
        if (next === 'next') {
          this.balanceSymbol1 = toFixed(parseFloat(data), this.precision.coin);
          clearTimeout(this.timer);
          if (this.$route.name === 'trade') {
            this.timer = setTimeout(() => {
              this.handleGetSymbil();
            }, 5000);
          }
          return;
        }
        this.balanceSymbol2 = toFixed(parseFloat(data), 4);
        this.handleGetSymbil('next');
      });
    },
    // 手机滑动
    handleTouchStart() {
      this.rangeFocus = true;
    },
    handleTouchEnd() {
      this.rangeFocus = false;
    },
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },
    // 买入 / 卖出 切换
    handleSellOrBuy(type) {
      this.activeType = type;
      this.price = '0.0000';
      if (this.priceType === '1' && type === 'sell') {
        this.price = toFixed(0, this.precision.coin);
      }
      this.rangeValue = 0; // range
      this.num = toFixed(0, this.precision.coin);
      this.aboutPrice = '0.0000';
      this.flag = false;
      this.handlePriceDefault();
    },
    // 减 decrease
    handleDecrease() {
      this.rangeFocus = false;

      let sub = Decimal.sub(this.thisPrice, 1 / (10 ** this.precision.price));
      if (sub < 0) {
        sub = 0;
      }
      sub = this.getFullNum(sub);
      this.thisPrice = toFixed(sub, this.precision.price);

      this.handleAboutPrice();
    },
    // 加 add
    handleAdd() {
      this.rangeFocus = false;

      let add = parseFloat(Decimal.add(this.thisPrice, 1 / (10 ** this.precision.price)));
      add = this.getFullNum(add);
      this.thisPrice = toFixed(add, this.precision.price);

      // this.handleAboutPrice();
    },
    // 科学计数法转数值 - 处理 1e-7 这类精度问题
    getFullNum(num) {
      // 处理非数字
      if (isNaN(num)) {
        return num;
      }
      // 处理不需要转换的数字
      const str = String(num);
      if (!/e/i.test(str)) {
        return num;
      }
      return (num).toFixed(18).replace(/\.?0+$/, '');
    },
    // 滑块点击
    handleRangeSet(num) {
      this.rangeFocus = true;
      this.rangeValue = num;
      setTimeout(() => {
        this.rangeFocus = false;
      }, 500);
    },
    // 数量框获取焦点
    // handleNumFocus() {
    //   this.numFocus = true;
    //   this.rangeFocus = false;
    // },
    // 数量框失去焦点
    handleNumBlur() {
      this.numFocus = false;
      this.rangeFocus = false;
      const num = toFixed(this.num, this.precision.coin);
      this.num = toFixed(Number(num), this.precision.coin);

      this.handleAboutPrice();
    },
    // 价格框失去焦点
    handleThisPriceBlur() {
      this.priceFocus = false;
      this.rangeFocus = false;
      let thisPrice = toFixed(this.thisPrice, this.precision.price);
      thisPrice = this.getFullNum(Number(thisPrice));
      this.thisPrice = toFixed(thisPrice, this.precision.price);

      this.handleAboutPrice();
    },
    // 计算大约价格 - thisPrice * num
    handleAboutPrice() {
      let aboutPrice = Decimal.mul(this.thisPrice, this.num).toString();
      if (aboutPrice < 0.0001) {
        aboutPrice = '0.0000';
      }
      this.aboutPrice = toFixed(aboutPrice, 4);

      /* ******** 计算range - start ******** */
      if (this.activeType === 'sell') {
        if (!Number(this.thisPrice)) {
          this.rangeValue = 0;
          return;
        }
        if (!Number(this.num)) {
          this.rangeValue = 0;
          return;
        }
        const precent = Decimal.div(this.num, this.balanceSymbol1).toString();
        if (precent === 'Infinity') {
          this.rangeValue = 0;
          return;
        }
        if (precent > 1) {
          this.rangeValue = 100;
          return;
        }
        this.rangeValue = Number(this.toFixed(precent * 100, 2));
        return;
      }
      if (!Number(this.num) || !Number(this.thisPrice)) {
        this.rangeValue = 0;
        return;
      }
      const precent = Decimal.div(aboutPrice, this.balanceSymbol2).toString();
      if (precent === 'Infinity' || precent === 'NaN') {
        this.rangeValue = 0;
        return;
      }
      if (precent > 1) {
        this.rangeValue = 100;
        return;
      }
      this.rangeValue = Number(this.toFixed(precent * 100, 2));
      /* ******** 计算range - end ******** */
    },
    // 市价价格框失去焦点
    handlePriceBlur() {
      this.price = toFixed(Number(this.price), 4);
      if (this.activeType === 'sell') {
        if (Number(this.price) <= 0) {
          this.rangeValue = 0;
          return;
        }
        const precent = Decimal.div(this.price, this.balanceSymbol1).toString();
        if (precent === 'Infinity') {
          this.rangeValue = 0;
          return;
        }
        if (precent > 1) {
          this.rangeValue = 100;
          return;
        }
        this.rangeValue = Number(this.toFixed(precent * 100, 2));
        return;
      }
      if (Number(this.price) <= 0) {
        this.rangeValue = 0;
        return;
      }
      const precent = Decimal.div(this.price, this.balanceSymbol2).toString();
      if (precent === 'Infinity' || precent === 'NaN') {
        this.rangeValue = 0;
        return;
      }
      if (precent > 1) {
        this.rangeValue = 100;
        return;
      }
      this.rangeValue = Number(this.toFixed(precent * 100, 2));
    },
    // 验证是否 > 0.100 EOS
    handleReg() {
      if (this.priceType === '0') {
        const buyPrice = Decimal.mul(this.thisPrice, this.num).toString();
        if (buyPrice < Number(this.minSellEos)) {
          this.flag = true; // 提示文本不显示
          return false;
        }
        this.flag = false; // 提示文本不显示
        return true;
      }
      if (this.activeType === 'buy') {
        if (this.price < Number(this.minSellEos)) {
          this.flag = true; // 提示文本不显示
          return false;
        }
        this.flag = false; // 提示文本不显示
        return true;
      }
      const sellPrice = this.price * this.newPrice;
      if (sellPrice < Number(this.minSellEos)) {
        const sellCount = Decimal.div(Number(this.minSellEos), this.newPrice).toString();
        this.sellCount = toFixed(sellCount, this.precision.coin);
        this.flag = true; // 提示文本不显示]
        return false;
      }
      this.flag = false; // 提示文本不显示
      return true;
    },
    // 验证余额是否足够使用
    handleRegBanlance() {
      /* -------- 限价 - 买入 / 卖出 -------- */
      if (this.priceType === '0') {
        // 买入验证
        if (this.activeType === 'buy') {
          const buyPrice = Decimal.mul(this.thisPrice, this.num).toString();
          if (Number(buyPrice) > Number(this.balanceSymbol2)) {
            Toast(`${this.symbol2} ${this.$t('quotation.low')}`);
            return false;
          }
          return true;
        }
        // 卖出验证
        if (Number(this.num) > Number(this.balanceSymbol1)) {
          Toast(`${this.symbol1} ${this.$t('quotation.low')}`);
          return false;
        }
        return true;
      }
      /* -------- 市价 - 买入 / 卖出 -------- */
      // 市价买入验证
      if (this.activeType === 'buy') {
        if (Number(this.price) > Number(this.balanceSymbol2)) {
          Toast(`${this.symbol2} ${this.$t('quotation.low')}`);
          return false;
        }
        return true;
      }
      // 市价卖出验证
      if (Number(this.price) > Number(this.balanceSymbol1)) {
        Toast(`${this.symbol1} ${this.$t('quotation.low')}`);
        return false;
      }
      return true;
    },
    // 买入
    handleBuy(param) {
      /* -------- 买入 -------- */
      if (this.priceType === '0') {
        // 限价 - 买入
        console.log(param);
        DApp.bids(param, (err, res) => {
          Indicator.close();
          if (!err) {
            console.log('success', res);
            Toast(this.$t('quotation.dealSuccess'));
            return;
          }
          if (err && res.type) {
            if (res.type.indexOf('signature_rejected') > -1) {
              Toast(this.$t('quotation.cancel'));
              return;
            }
          }
          Toast(this.$t('quotation.dealError') + res);
        });
      } else {
        // 市价 - 买入
      }
    },

    // 卖出
    handleSell(param) {
      /* -------- 卖出 -------- */
      if (this.priceType === '0') {
        // 限价 - 卖出
        console.log(param);
        DApp.ask(param, (err, res) => {
          Indicator.close();
          if (!err) {
            console.log('success', res);
            Toast(this.$t('quotation.dealSuccess'));
            return;
          }
          if (err && res.type) {
            if (res.type.indexOf('signature_rejected') > -1) {
              Toast(this.$t('quotation.cancel'));
              return;
            }
          }
          Toast(this.$t('quotation.dealError') + res);
        });
      } else {
        // 市价 - 卖出
      }
    },
    // 服务器是否在维护 serverStatus: false - 暂停 | true - 正常
    handleCheckServerStop() {
      const accountAgree = sessionStorage.getItem('accountAgree') ? JSON.parse(sessionStorage.getItem('accountAgree')) : false;
      const permission = this.$store.state.app.permission;
      if (!permission) {
        Toast('未授权，请先进行授权');
        this.$store.dispatch('updateauth', this.$store.state.app.key);
        return;
      }
      if (!accountAgree) {
        this.accountAgree = true;
        return;
      }
      if (!this.handleReg()) {
        return;
      }
      if (!this.handleRegBanlance()) {
        return;
      }
      const param = {
        authorization: {
          authorization: `${this.$store.state.app.accountInfo.account_name}@active`,
        },
        maker: this.$store.state.app.accountInfo.account_name,
        quantity: `${toFixed(this.num, 4)} ${this.symbol1}`,
        price: this.thisPrice * 100000000,
        source: this.$store.state.app.source,
        uuid: randomNum(9223372036854775807),
      };
        // 买入
      Indicator.open();
      if (this.activeType === 'buy') {
        param.bid_contract = this.$store.state.app.trad.symbol2_code;
        this.handleBuy(param);
        return;
      }
      // 卖出
      param.ask_contract = this.$store.state.app.trad.symbol2_code;
      this.handleSell(param);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.m40{
  margin: .4rem 0;
}
.mb60{
  margin-bottom: .6rem;
}
.m80{
  margin: .8rem 0;
}
.borderTop{
  border: .1rem solid transparent;
  border-top: .1rem solid $color-999;
  position: absolute;
  right: .36rem;
  top: 50%;
  transform: translate(0px, -30%);
}
.iptBorder{
  border-color: $color-red !important;
}
.hidden{
  visibility: hidden;
}

.tradeLeft{
  position: relative;
  // 买入卖出
  .typeBtn{
    display: flex;
    align-items: center;/*垂直居中*/

    .btn{
      flex: 1;
      box-sizing: border-box;
      text-align: center;
      height: .83rem;
      line-height: .83rem;
      font-size: .3rem;
      border: 1px solid $color-e3e3e3;
      border-top-left-radius: .12rem;
      border-bottom-left-radius: .12rem;

      &:last-child{
        // margin-left: 0.1rem;
        border-top-left-radius: 0rem;
        border-bottom-left-radius: 0rem;
        border-top-right-radius: .12rem;
        border-bottom-right-radius: .12rem;
      }

      &.active{
        color: $color-green;
        border-color: $color-green;
      }
      &.activeSell{
        color: $color-red;
        border-color: $color-red;
      }
    }
  }

  // 限价 / 市价
  .priceType{
    font-size: .32rem;

    .selectDiv{
      margin-top: .3rem;
      margin-bottom: .6rem;
      position: relative;
    }

    .select{
      background: transparent;
      font-size: .32rem;
      border: 1px solid $color-e3e3e3;
      width: 100%;
      height: .83rem;
      padding-left: .3rem;
      border-radius: .12rem;
    }

    // 价格
    .priceDiv{
      display: flex;

      .item{
        flex: 1;
        text-align: center;

        &.tool{
          // min-width: .8rem;
          // width: .8rem;
          // max-width: .8rem;
          height: .8rem;
          line-height: .8rem;
          border: 1px solid $color-e3e3e3;
          border-top-left-radius: .12rem;
          border-bottom-left-radius: .12rem;

          &:last-child{
            border-top-left-radius: 0rem;
            border-bottom-left-radius: 0rem;
            border-top-right-radius: .12rem;
            border-bottom-right-radius: .12rem;
          }

          &:active{
            background: $active-white;
          }
        }

        &.input{
          font-size: .32rem;
          width: 2rem;
          flex: 3;
          border-top: 1px solid $color-e3e3e3;
          border-bottom: 1px solid $color-e3e3e3;
        }

        &.marketInput{
          height: .8rem;
          line-height: .8rem;
          font-size: .32rem;
          width: 2rem;
          flex: 3;
          border: 1px solid $color-e3e3e3;
          border-radius: .12rem;
        }
      }
    }

    // 数量
    .numberDiv{
      position: relative;

      .input{
        box-sizing: border-box;
        height: .8rem;
        line-height: .8rem;
        width: 100%;
        position: relative;
        border: 1px solid $color-e3e3e3;
        border-radius: .12rem;
        padding-left: .3rem;
        font-size: .32rem;
        background: transparent;
        z-index: 1;
      }

      .tip{
        position: absolute;
        height: .83rem;
        line-height: .83rem;
        right: 0.2rem;
        top: 0px;
        color: $color-999;
        font-weight: 300;
        z-index: 0;
        font-size: .25rem;
      }

      .about{
        margin-top: .08rem;
        font-size: .25rem;
        text-align: right;
        line-height: .36rem;
        height: .36rem;
        font-weight: 300;
        color: $color-999;
      }
    }

    .range{
      margin-top: .3rem;

      &.sellRange{
        /deep/ .mt-range-progress{
          background-color: $color-red !important;
        }

        .border-green{
          border-color: $color-red !important;
        }
      }

      /deep/ .mt-range{
        height: .5rem;
        line-height: .5rem;

        .mt-range-content{
          margin-right: .3rem;
        }

        .mt-range-runway{
          right: -0.05rem;
        }

        .mt-range-thumb{
          width: .5rem;
          height: .5rem;
          z-index: 10;
        }

        .mt-range-progress{
          background-color: $color-green;
        }
      }

      .desc{
        display: flex;
        align-items: center;/*垂直居中*/
        position: absolute;
        width: 100%;
        height: .50rem;
        z-index: 1;
        line-height: .5rem;

        &>span{
          flex: 1;
          height: .4rem;
          display: flex;
          align-items: center;/*垂直居中*/
          text-align: right;

          .before{
            display: inline-block;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            transform: translate(-50%, 0);
            background: #ffffff;

            &.border-green{
              border-color: $color-green;
            }
          }

          &:nth-child(2) .before{
            transform: translate(-25%, 0);
          }
          &:nth-child(1) .before{
            transform: translate(0, 0);
          }

          .last{
            background: #ffffff;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            position: absolute;
            right: 0px;
          }

        }
      }

      .ableDiv{
        display: flex;
        align-items: center;/*垂直居中*/
        font-size: .25rem;
        color: $color-999;
        margin-top: .12rem;

        &>span{
          flex: 9;
        }

        .precents{
          flex: 1;
          text-align: right;
        }
      }
    }

    .special{
      margin-top: .18rem;
      font-size: .23rem;
      color: $color-this;
      display: flex;
      align-items: center;/*垂直居中*/

      .specialIcon{
        font-size: .25rem;
        margin-right: .13rem;
      }
    }

    .btnDiv{
      margin-top: .4rem;

      .btn{
        height: .8rem;
        line-height: .8rem;
        width: 100%;
        color: $color-white;
        background: $color-green;
        font-size: .32rem;
        border-radius: .08rem;

        &.buy:active{
          background: $active-green;
        }

        &.sell:active{
          background: $active-red !important;
        }
      }

      .btnFlex{
        display: flex;
        align-items: center; /*垂直居中*/
        justify-content: center; /*水平居中*/
        background: #9b9b9b;

        .warn{
          font-size: .35rem;
          padding-right: .1rem;
        }
      }
    }
  }

  .specialTip{
    border-radius: .3rem;
  }
}
</style>
