import axios from 'axios';
import qs from 'qs'; // fromData 转 string
import { Toast } from 'mint-ui';
import store from '@/store';

const ApiVersion = '/api'; // 默认请求地址
const https = axios.create({
  baseURL: ApiVersion,
  timeout: 20000,
  auth: {
    // username: localStorage.getItem('token') || '',
  },
});

https.defaults.transformRequest = [(data, header) => { // 开始请求前期
  const headerThis = header;
  headerThis.account = null;
  if (store.state.app.accountInfo && store.state.app.accountInfo.account_name) {
    headerThis.account = store.state.app.accountInfo.account_name;
  }
  headerThis.token = null;
  if (localStorage.getItem('token')) {
    headerThis.token = localStorage.getItem('token');
  }
  headerThis.language = null;
  if (localStorage.getItem('language')) {
    headerThis.language = localStorage.getItem('language');
  }
  if (!header['Content-Type']) {
    return qs.stringify(data);
  }
  return data;
}];

// 请求前
https.interceptors.request.use((config) => { // eslint-disable-line
  // Indicator.open();
  return config;
}, error => Promise.reject(error));

https.interceptors.response.use((response) => { // 请求后
  // Indicator.close();
  const res = response.data;
    return res; // eslint-disable-line
}, (error) => {
  // Indicator.close();
  if (!error.response) {
    // Toast({
    //   message: 'Request error',
    //   position: 'center',
    //   duration: 4000,
    // });
    return false;
  }
  switch (error.response.status) {
    case 504:
      Toast({
        message: 'Network error',
        position: 'center',
        duration: 2000,
      });
      break;
    default:
      Toast({
        message: 'System error',
        position: 'center',
        duration: 2000,
      });
      break;
  }
  return false;
});

export default https;
