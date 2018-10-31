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
  return moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
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

export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//生成从minNum到maxNum的随机数
export function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

