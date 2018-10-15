import Vue from 'vue';
import { Popup, Picker, Cell, Range, InfiniteScroll, Loadmore, Spinner, Checklist } from 'mint-ui';
import moment from 'moment';
import 'mint-ui/lib/style.css';
import https from '@/utils/axios';
import router from './router';
import './assets/css/public.scss';
import store from './store';
import i18n from './utils/lang';
import App from './App';

Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(Cell.name, Cell);
Vue.component(Range.name, Range);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Spinner.name, Spinner);
Vue.component(Checklist.name, Checklist);
Vue.use(InfiniteScroll);

// 国际化 - 语言
Vue.use(i18n);

Vue.config.productionTip = false;
Vue.prototype.$http = https;

// unix 时间戳、 utc Data类型
Vue.filter('dateFormat', value => moment.utc(value).format('YYYY-MM-DD'));
Vue.filter('dateFormatAll', value => moment.utc(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatBIH', value => moment(value).format('YYYY-MM-DD HH:mm:ss'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
});


// WEBPACK FOOTER //
// ./src/main.js
