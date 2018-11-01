import env from './env.js'

const nodeConfig = env === 'dev'? {
    blockchain: 'eos',
    contract: 'hello23zhang',
    httpEndpoint: 'http://222.180.164.141:8888',
    protocol: 'http',
    host: '222.180.164.141',
    port: 8888,
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
} : {

};
// const nodeConfig = {
//     httpEndpoint: 'https://mainnet.meet.one',
//     protocol: 'https',
//     host: 'mainnet.meet.one',
//     port: 443,
//     chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
// };

const scatterConfig = {
  contract: nodeConfig.contract,
  eosConfig: {
    httpEndpoint: nodeConfig.httpEndpoint,
    chainId: nodeConfig.chainId,
  },
  network: {
    blockchain: nodeConfig.blockchain,
    protocol: nodeConfig.protocol,
    host: nodeConfig.host,
    port: nodeConfig.port,
    chainId: nodeConfig.chainId,
  },
  eosOptions: {
    broadcast: true,
    sign: true,
    chainId: nodeConfig.chainId,
  },
};

export default scatterConfig;
