import moment from 'moment';


// 科学计数法转数值 - 处理 1e-7 这类精度问题
export function getFullNum(num) {
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
}


// 返回小数位后几位 截取
// number 数值
// p 位数
export function toFixed(number, p) {
  let num = number == null || number === '' ? '0' : number;
  num = getFullNum(num);
    var n = (num + '').split('.'); // eslint-disable-line
    var x = n.length > 1 ? n[1] : ''; // eslint-disable-line
    if (x.length > p) { // eslint-disable-line
        x = x.substr(0, p); // eslint-disable-line
    } else { // eslint-disable-line
        x += Array(p - x.length + 1).join('0'); // eslint-disable-line
    } // eslint-disable-line
    return n[0] + (x == '' ? '' : '.' + x); // eslint-disable-line
}

/**
 * 时间戳转成本地时间
 */
export function toLocalTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

export function toLocalTimeOld(time) {
  let changeTime = time;
  if (changeTime.length > 23) {
    changeTime = changeTime.substr(0, 23);
  }
  const myDate = new Date(changeTime);
  const year = myDate.getFullYear();
  const month = myDate.getMonth() + 1 > 9 ? (myDate.getMonth() + 1) : `0${(myDate.getMonth() + 1)}`;
  const day = myDate.getDate() > 9 ? myDate.getDate() : `0${myDate.getDate()}`;
  const hour = myDate.getHours() > 9 ? myDate.getHours() : `0${myDate.getHours()}`;
  const min = myDate.getMinutes() > 9 ? myDate.getMinutes() : `0${myDate.getMinutes()}`;
  const sec = myDate.getSeconds() > 9 ? myDate.getSeconds() : `0${myDate.getSeconds()}`;

  const str = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  return str;
}

export function GetUrlPara() {
  const url = document.location.toString();
  const arrUrl = url.split('?');
  if (arrUrl.length === 1) {
    return {
      dapp: 'moreWallet',
    };
  }
  const para = arrUrl[1];
  const qureyArr = para.split('&');
  const params = {};
  for (let i = 0; i < qureyArr.length; i += 1) {
    const arr = qureyArr[i].split('=');
    params[arr[0]] = arr[1];
  }
  return params;
}

