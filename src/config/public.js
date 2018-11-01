import env from './env.js'

export default {
  chainSymbol: env === 'dev'? 'QILINEOS' : 'EOS',
  defaultSource: env === 'dev'? '1234' : 'onedex123451'
};
