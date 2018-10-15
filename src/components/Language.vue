<template>
  <div class="lang">
    <div class="btnDiv" @click="handleShow">
      <span class="iconfont icon-huaban24 languageIcon fl"></span>
      <span class="language fl">{{ handleLangName() }}</span>
      <span class="down fl"></span>
    </div>
    <mt-popup
      class="popup"
      v-model="popupVisible"
      pop-transition="popup-fade"
      position="bottom">
      <div class="sureDiv">
        <span class="frBtn" @click="handleSureChangeLang">{{ $t('public.sure') }}</span>
      </div>
      <mt-picker class="picker" :slots="lang.list" valueKey="name" @change="onValuesChange" defaultIndex="1" v-if="popupVisible">
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
// 按需引入部分组件


export default {
  data() {
    return {
      popupVisible: false,
      language: 'en',
      lang: {
        active: 'en',
        list: [
          {
            values: [
              {
                key: 'en',
                name: 'English',
              },
              {
                key: 'zh-CN',
                name: '简体中文',
              },
              {
                key: 'zh-TW',
                name: '繁體中文',
              },
              {
                key: 'ko',
                name: '한국어',
              },
            ],
            defaultIndex: 1,
            textAlign: 'center',
          },
        ],
      },
      solts: [
        {
          key: 'en',
          name: 'English',
        },
        {
          key: 'zh-CN',
          name: '简体中文',
        },
        {
          key: 'zh-TW',
          name: '繁體中文',
        },
        {
          key: 'ko',
          name: '한국어',
        },
      ],
      pickerItem: {
        picker: null,
        values: null,
      },
    };
  },
  watch: {
    popupVisible(newVal) {
      if (newVal) {
        const list = this.solts;
        const lang = this.$store.state.app.language;
        const arr = list.filter(item => item.key !== lang);
        const langThis = list.find(item => item.key === lang);
        const t = window.parseInt(arr.length / 2);
        arr.splice(t, 0, langThis);
        this.lang.list[0].values = arr;
        this.lang.list[0].defaultIndex = 1;
      }
    },
  },
  components: {
  },
  created() {
    this.language = this.$store.state.app.language;
    this.handleCheckLang(this.language);
  },
  mounted() {
  },
  methods: {
    handleShow() {
      this.popupVisible = !this.popupVisible;
    },
    // 确定选择语言
    handleSureChangeLang() {
      this.handleCheckLang(this.language);
      this.popupVisible = false;
    },
    // 语言切换
    onValuesChange(picker, values) {
      this.pickerItem.picker = picker;
      this.pickerItem.values = values;
      this.handleValuesSure();
    },
    handleValuesSure() {
      if (this.pickerItem.picker) {
        this.language = this.pickerItem.values[0].key;
      }
    },

    /*
    * 语言切换
    * 返回 lang
    */
    handleCheckLang(lang) {
      this.lang.active = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch('setLanguage', lang);
    },

    /*
    * 返回 语言名称
    */
    handleLangName() {
      const langs = this.lang.list[0].values;
      const value = this.lang.active;
      return langs.find(v => v.key === value).name;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.btnDiv{
  font-size: .21rem;
  border: 1px solid $color-e3e3e3;
  height: .45rem;
  line-height: .45rem;
  border-radius: .12rem;
  font-weight: 300;
  overflow: hidden;
  z-index: 888;

  .languageIcon{
    font-size: .4rem;
    margin-left: .10rem;
  }

  .down{
    display: inline-block;
    border: .07rem solid transparent;
    margin-top: .18rem;
    margin-left: .05rem;
    margin-right: .10rem;
    border-top: .07rem solid white;
  }
}

.popup{
  max-width: 750px;
  width: 100%;
  color: $color-333;
  text-align: center;

  .sureDiv{
    height: .7rem;
  }

  .frBtn{
    height: .56rem;
    line-height: .56rem;
    position: absolute;
    right: .24rem;
    top: .24rem;
    font-size: .24rem;
    width: 1.28rem;
    color: $color-this;
    border: 1px solid $color-this;
    border-radius: .12rem;
    font-weight: 300;
    z-index: 8;
  }

  .frBtn:active{
    background: $color-this;
    color: white;
  }
}
</style>


// WEBPACK FOOTER //
// src/components/Language.vue
