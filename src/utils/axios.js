import axios from 'axios';
import qs from 'qs'; // fromData 转 string
import { Toast } from 'mint-ui';
import store from '@/store';

const ApiVersion = '/api'; // 默认请求地址 http://120.220.14.100:8088
const https = axios.create({
  baseURL: ApiVersion,
  timeout: 20000,
});

https.defaults.transformRequest = [(data, header) => { // 开始请求前期
  if (!header['Content-Type']) {
    return qs.stringify(data);
  }
  return data;
}];

// 请求前
https.interceptors.request.use(
  config => // eslint-disable-lines
  // Indicator.open();
    config
  , error => Promise.reject(error),
);

// 请求后
https.interceptors.response.use((response) => {
  // Indicator.close();
  const res = response.data;
    return res; // eslint-disable-line
}, (error) => {
  // Indicator.close();
  if (!error.response) {
    Toast({
      message: 'Request error',
      position: 'center',
      duration: 4000,
    });
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
